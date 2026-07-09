namespace InventorySystem.Service.Interfaces
{
    public interface IOtpService
    {
        Task SendOtpAsync(int userId);

        Task<bool> ValidateOtpAsync(int userId, string otp);
    }
}