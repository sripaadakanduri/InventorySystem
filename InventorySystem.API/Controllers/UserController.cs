using InventorySystem.Core.DTOs.Users;
using InventorySystem.Core.Interfaces;
using InventorySystem.Core.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = UserRoles.Admin)]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();

            return Ok(users);
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(
            int id,
            UpdateUserRoleDto dto)
        {
            var result = await _userService
                .UpdateUserRoleAsync(id, dto.Role);

            if (!result)
                return NotFound("User not found");

            return Ok("Role updated successfully");
        }


    }
}