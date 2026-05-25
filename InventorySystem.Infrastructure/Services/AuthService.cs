using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;
using InventorySystem.Core.Interfaces;
using InventorySystem.Infrastructure.Auth;
using InventorySystem.Infrastructure.Data;
using InventorySystem.Infrastructure.Helpers;
using InventorySystem.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
namespace InventorySystem.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserRepository _repo;
        private readonly JwtServices _jwt;
        private readonly AppDbContext _context;

        public AuthService(UserRepository userRepository, JwtServices jwt, AppDbContext context)
        {
            _repo = userRepository;
            _jwt = jwt;
            _context = context;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existingUsername = await _repo.GetByUsernameAsync(dto.Username);
            if (existingUsername != null)
            {
                throw new InvalidOperationException("Username is already taken. Please choose another.");
            }

            var existingEmail = await _repo.GetByEmailAsync(dto.Email);
            if (existingEmail != null)
            {
                throw new InvalidOperationException("An account with this email address already exists.");
            }

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = PasswordHasher.Hash(dto.Password),
                Role = string.IsNullOrEmpty(dto.Role) ? "User" : dto.Role
            };
            await _repo.AddAsync(user);
            var token = _jwt.GenerateToken(user);
            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Role = user.Role
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _repo.GetByUsernameAsync(dto.Username);
            if (user == null)
            {
                throw new InvalidOperationException("Invalid username or password.");
            }

            if (!PasswordHasher.Verify(dto.Password, user.PasswordHash))
            {
                throw new InvalidOperationException("Invalid username or password.");
            }
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);
            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Role = user.Role
            };
        }
    }
}
