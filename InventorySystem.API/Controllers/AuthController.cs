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
                SetAuthCookie(result.Token);
                return Ok(CreateUserResponse(result.Username, result.Role));
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
                SetAuthCookie(result.Token);
                return Ok(CreateUserResponse(result.Username, result.Role));
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
                SetAuthCookie(result.Token);
                return Ok(CreateUserResponse(result.Username, result.Role));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("AuthToken", new CookieOptions
            {
                Secure = true,
                SameSite = SameSiteMode.None
            });

            return Ok();
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

        private void SetAuthCookie(string token)
        {
            Response.Cookies.Append(
                "AuthToken",
                token,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTimeOffset.UtcNow.AddHours(2)
                });
        }

        private static object CreateUserResponse(string username, string role)
        {
            return new
            {
                Username = username,
                Role = role
            };
        }
    }
}
