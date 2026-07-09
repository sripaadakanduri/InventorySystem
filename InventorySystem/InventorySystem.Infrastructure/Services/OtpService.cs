using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Cryptography;
namespace InventorySystem.Service.Services
{
    public class OtpService : IOtpService
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IEmailService _emailService;

        public OtpService(
            AppDbContext context,
            IMemoryCache cache,
            IEmailService emailService)
        {
            _context = context;
            _cache = cache;
            _emailService = emailService;
        }

        public async Task SendOtpAsync(int userId)
        {
            Console.WriteLine("Finding user");
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null)
                throw new Exception("User not found.");
            Console.WriteLine("Generating OTP");

            var otp = RandomNumberGenerator.GetInt32(1000, 10000).ToString();
            Console.WriteLine("Saving cache");
            _cache.Set(
                $"OTP_{userId}",
                otp,
                TimeSpan.FromMinutes(5));

            await _emailService.SendEmailAsync(
                user.Email,
                "Password Change OTP",
                $"Your OTP is {otp}. It expires in 5 minutes.");
            Console.WriteLine("Email sent");
        }

        public Task<bool> ValidateOtpAsync(int userId, string otp)
        {
            if (!_cache.TryGetValue($"OTP_{userId}", out string? storedOtp))
                return Task.FromResult(false);

            if (storedOtp != otp)
                return Task.FromResult(false);

            _cache.Remove($"OTP_{userId}");

            return Task.FromResult(true);
        }
    }
}