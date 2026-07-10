namespace InventorySystem.Service.Interfaces
{
    public interface IOtpService
    {
        Task SendOtpAsync(int userId);

        Task<bool> ValidateOtpAsync(int userId, string otp);

        Task SendOtpByEmailAsync(string email);

        Task<bool> ValidateOtpByEmailAsync(string email, string otp);
    }
}