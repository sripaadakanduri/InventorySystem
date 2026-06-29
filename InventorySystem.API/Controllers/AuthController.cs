using InventorySystem.Core.DTOs;
using InventorySystem.Service.Interfaces;
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

        public AuthController(IAuthService service)
        {
            _service = service;
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
        public IActionResult Me()
        {
            return Ok(new
            {
                Username = User.Identity?.Name,
                Role = User.FindFirstValue(ClaimTypes.Role)
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok();
        }
    }
}