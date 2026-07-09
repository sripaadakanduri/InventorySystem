using InventorySystem.Core.DTOs;
using InventorySystem.Core.DTOs.Users;

namespace InventorySystem.Service.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllUsersAsync(UserFilterDto? filter = null);

        Task<bool> UpdateUserRoleAsync(int userId, string role);

        Task<RegisterDto?> GetUserAsync(string username);

        Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto dto);

        Task<UserDto?> GetProfileAsync(int userId);
    }
}
