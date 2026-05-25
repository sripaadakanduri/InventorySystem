using InventorySystem.Core.DTOs.Users;

namespace InventorySystem.Service.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllUsersAsync();

        Task<bool> UpdateUserRoleAsync(int userId, string role);
    }
}