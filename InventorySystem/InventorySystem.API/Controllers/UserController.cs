using InventorySystem.Core.DTOs.Users;
using InventorySystem.Common.Enums;
using InventorySystem.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InventorySystem.Core.DTOs;

namespace InventorySystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = UserRoles.Admin)]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllUsers(
        [FromQuery] UserFilterDto filter
        )
        {
            var users = await _userService.GetAllUsersAsync(filter);

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