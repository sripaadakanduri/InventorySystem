using InventorySystem.Core.DTOs;
using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InventorySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;
        private readonly IUserService _userService;
        private readonly IOtpService _otpService;

        public AuthController(IAuthService service, IUserService userService, IOtpService otpService)
        {
            _service = service;
            _userService = userService;
            _otpService = otpService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            try
            {
                var result = await _service.RegisterAsync(dto);

                return Ok(new
                {
                    Token = result.Token,
                    Username = result.Username,
                    Role = result.Role
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            try
            {
                var result = await _service.LoginAsync(dto);

                return Ok(new
                {
                    Token = result.Token,
                    Username = result.Username,
                    Role = result.Role
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin(GoogleLoginDto dto)
        {
            try
            {
                var result = await _service.GoogleLoginAsync(dto);

                return Ok(new
                {
                    Token = result.Token,
                    Username = result.Username,
                    Role = result.Role
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var username = User.Identity?.Name;

            if (string.IsNullOrEmpty(username))
                return Unauthorized();

            var user = await _userService.GetUserAsync(username);

            return Ok(new
            {
                Username = user.Username,
                Role = user.Role
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("forgot-password-otp")]
        public async Task<IActionResult> ForgotPasswordOtp([FromBody] ForgotPasswordDto dto)
        {
            try
            {
                await _otpService.SendOtpByEmailAsync(dto.Email);
                return Ok(new { message = "OTP has been sent to your email." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("forgot-password-reset")]
        public async Task<IActionResult> ForgotPasswordReset([FromBody] ResetPasswordDto dto)
        {
            try
            {
                var isValid = await _otpService.ValidateOtpByEmailAsync(dto.Email, dto.Otp);
                if (!isValid)
                    return BadRequest(new { message = "Invalid or expired OTP." });

                await _userService.ResetPasswordByEmailAsync(dto.Email, dto.NewPassword);
                return Ok(new { message = "Password has been successfully reset." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}