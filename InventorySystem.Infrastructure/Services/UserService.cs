using InventorySystem.Core.DTOs.Users;
using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Data;
using Microsoft.EntityFrameworkCore;
using InventorySystem.Core.DTOs;

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

        public async Task<List<UserDto>> GetAllUsersAsync(UserFilterDto? filter = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter?.User))
            {
                var username = filter.User.Trim().ToLower();

                query = query.Where(u =>
                    u.Username.ToLower().Contains(username)
                );
            }

            if (!string.IsNullOrWhiteSpace(filter?.Role))
            {
                var role = filter.Role.Trim().ToLower();

                query = query.Where(u =>
                    u.Role.ToLower() == role
                );
            }

            return await query
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
