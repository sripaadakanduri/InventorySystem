using InventorySystem.Core.Interfaces;
using InventorySystem.Infrastructure.Repositories;
using InventorySystem.Infrastructure.Auth;
using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using InventorySystem.Infrastructure.Helpers;
namespace InventorySystem.Infrastructure.Services
{
    public class AuthService:IAuthService
    {
        private readonly UserRepository _repo;
        private readonly JwtServices _jwt;
        
        public AuthService(UserRepository userRepository, JwtServices jwt)
        {
            _repo = userRepository;
            _jwt = jwt;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var existinguser = await _repo.GetByUsernameAsync(dto.Username);
            if (existinguser != null)
            {
                throw new InvalidOperationException("User already exists");
            }

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = PasswordHasher.Hash(dto.Password)
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
                throw new InvalidOperationException("User not Found");
            }

            if (!PasswordHasher.Verify(dto.Password, user.PasswordHash))
            {
                throw new InvalidOperationException("Invalid Password");
            }

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
