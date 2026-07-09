using InventorySystem.Core.DTOs;
using InventorySystem.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InventorySystem.API.Controllers
{
    [Route("api/user-management")]
    [ApiController]
    [Authorize]
    public class UserManagementController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IOtpService _otpService;

        public UserManagementController(IUserService userService, IOtpService otpService)
        {
            _userService = userService;
            _otpService = otpService;
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            try
            {
                var result = await _userService.UpdateProfileAsync(userId, dto);

                if (!result)
                    return NotFound();

                var user = await _userService.GetProfileAsync(userId);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var user = await _userService.GetProfileAsync(userId);

            return Ok(user);
        }

        [HttpPost("request-otp")]
        public async Task<IActionResult> RequestOtp()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _otpService.SendOtpAsync(userId);

            return Ok(new
            {
                message = "OTP has been sent to your email."
            });
        }
    }
}
