using InventorySystem.Core.DTOs.Users;
using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Data;
using Microsoft.EntityFrameworkCore;
using InventorySystem.Core.DTOs;
using InventorySystem.Service.Helpers;

namespace InventorySystem.Service.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOtpService _otpService;

        public UserService(
            AppDbContext context,
            IUnitOfWork unitOfWork,
            IOtpService otpService)
        {
            _context = context;
            _unitOfWork = unitOfWork;
            _otpService = otpService;
        }

        public async Task<List<UserDisplay>> GetAllUsersAsync(UserFilterDto? filter = null)
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

            var rawUsers = await query
                .Select(u => new 
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.Role,
                    u.CreatedAt,
                    u.LastLoginAt
                })
                .ToListAsync();

            return rawUsers.Select(u => new UserDisplay
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt.ToString("o"),
                LastLoginAt = u.LastLoginAt.HasValue ? u.LastLoginAt.Value.ToString("o") : string.Empty
            }).ToList();
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

        public async Task<RegisterDto?> GetUserAsync(string username)
        {
            return await _context.Users
                .Where(u => u.Username == username)
                .Select(u => new RegisterDto
                {
                    Username = u.Username,
                    Role = u.Role
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return false;

            if (!string.IsNullOrWhiteSpace(dto.Username) &&
                dto.Username != user.Username)
            {
                var usernameExists = await _context.Users.AnyAsync(u =>
                    u.Username == dto.Username && u.Id != userId);

                if (usernameExists)
                    throw new Exception("Username already exists.");

                user.Username = dto.Username;
            }

            if (!string.IsNullOrWhiteSpace(dto.Email) &&
                dto.Email != user.Email)
            {
                var emailExists = await _context.Users.AnyAsync(u =>
                    u.Email == dto.Email && u.Id != userId);

                if (emailExists)
                    throw new Exception("Email already exists.");

                user.Email = dto.Email;
            }

            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                var hasOldPassword = !string.IsNullOrWhiteSpace(dto.OldPassword);
                var hasOtp = !string.IsNullOrWhiteSpace(dto.Otp);

                if (!hasOldPassword && !hasOtp)
                    throw new Exception("Either old password or OTP is required.");

                if (hasOldPassword && hasOtp)
                    throw new Exception("Use either old password or OTP, not both.");

                if (hasOldPassword)
                {
                    var oldPasswordValid = PasswordHasher.Verify(
                        dto.OldPassword!,
                        user.PasswordHash);

                    if (!oldPasswordValid)
                        throw new Exception("Old password is incorrect.");
                }
                else
                {
                    var otpValid = await _otpService.ValidateOtpAsync(
                        userId,
                        dto.Otp!);

                    if (!otpValid)
                        throw new Exception("Invalid or expired OTP.");
                }

                user.PasswordHash = PasswordHasher.Hash(dto.NewPassword);
            }

            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<UserDto?> GetProfileAsync(int userId)
        {
            return await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role
                })
                .FirstOrDefaultAsync();
        }

        public async Task ResetPasswordByEmailAsync(string email, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                throw new Exception("User not found.");

            user.PasswordHash = PasswordHasher.Hash(newPassword);
            await _context.SaveChangesAsync();
        }
    }
}
