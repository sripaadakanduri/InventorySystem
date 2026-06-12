using InventorySystem.Core.DTOs;
namespace InventorySystem.Service.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> GoogleLoginAsync(GoogleLoginDto dto);
    }
}
