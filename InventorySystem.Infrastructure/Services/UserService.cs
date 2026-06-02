using InventorySystem.Core.DTOs.Users;
using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Data;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Service.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IUnitOfWork _unitOfWork;

        public UserService(AppDbContext context, IUnitOfWork unitOfWork)
        {
            _context = context;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateUserRoleAsync(int userId, string role)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return false;

            user.Role = role;

            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}
