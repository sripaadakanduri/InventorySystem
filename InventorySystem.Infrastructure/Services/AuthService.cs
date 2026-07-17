using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;
using InventorySystem.Service.Auth;
using InventorySystem.Service.Data;
using InventorySystem.Service.Helpers;
using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Repositories;
using Microsoft.Extensions.Configuration;
using Google.Apis.Auth;

namespace InventorySystem.Service.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserRepository _repo;
        private readonly JwtServices _jwt;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public AuthService(UserRepository userRepository, JwtServices jwt, IUnitOfWork unitOfWork, IConfiguration config)
        {
            _repo = userRepository;
            _jwt = jwt;
            _unitOfWork = unitOfWork;
            _config = config;
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

            var role = string.IsNullOrEmpty(dto.Role) ? "User" : dto.Role;
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = PasswordHasher.Hash(dto.Password),
                Role = string.IsNullOrEmpty(dto.Role) ? "User" : dto.Role,
                NotificationSchedule = role == "Admin" ? "D" : "N"
            };
            await _repo.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);
            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
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
            await _unitOfWork.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);
            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task<AuthResponseDto> GoogleLoginAsync(GoogleLoginDto dto)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["Authentication:Google:ClientId"] }
            };

            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, settings);
            }
            catch (InvalidJwtException ex)
            {
                throw new InvalidOperationException("Invalid Google token.", ex);
            }

            var user = await _repo.GetByEmailAsync(payload.Email);
            if (user == null)
            {
                user = new User
                {
                    Username = payload.Email.Split('@')[0],
                    Email = payload.Email,
                    PasswordHash = string.Empty,
                    Role = "User"
                };
                await _repo.AddAsync(user);
                await _unitOfWork.SaveChangesAsync();
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();

            var token = _jwt.GenerateToken(user);
            return new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };
        }
    }
}
