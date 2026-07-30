using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
namespace InventorySystem.Service.Services
{
    public class OtpService : IOtpService
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private const string OtpTemplatePath = "EmailPages/OtpEmailTemplate.html";

        public OtpService(
            AppDbContext context,
            IMemoryCache cache,
            IEmailService emailService,
            IConfiguration configuration)
        {
            _context = context;
            _cache = cache;
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task SendOtpAsync(int userId)
        {
            Console.WriteLine("Finding user...");

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);

            if (user == null)
                throw new Exception("User not found.");

            Console.WriteLine("Generating OTP...");

            var otp = RandomNumberGenerator.GetInt32(1000, 10000).ToString();

            _cache.Set(
                $"OTP_{userId}",
                otp,
                TimeSpan.FromMinutes(_configuration.GetValue<int>("OtpSettings:ExpirationMinutes", 5)));

            var body = await BuildOtpEmailBodyAsync(user.Username, otp);

            await _emailService.SendEmailAsync(
                user.Email,
                "Password Change OTP",
                body);

            Console.WriteLine("Email sent successfully.");
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

        public async Task SendOtpByEmailAsync(string email)
        {   
            email = email.Trim().ToLowerInvariant();
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);

            if (user == null)
                throw new Exception("User not found.");

            var otp = RandomNumberGenerator.GetInt32(1000, 10000).ToString();
            
            _cache.Set(
                $"OTP_{email.ToLower()}",
                otp,
                TimeSpan.FromMinutes(_configuration.GetValue<int>("OtpSettings:ExpirationMinutes", 5)));

            var body = await BuildOtpEmailBodyAsync(user.Username, otp);

            await _emailService.SendEmailAsync(
                user.Email,
                "Password Reset OTP",
                body);
        }
        
        public Task<bool> ValidateOtpByEmailAsync(string email, string otp)
        {
            email = email.Trim().ToLowerInvariant();
            if (!_cache.TryGetValue($"OTP_{email.ToLower()}", out string? storedOtp))
                return Task.FromResult(false);

            if (storedOtp != otp)
                return Task.FromResult(false);

            _cache.Remove($"OTP_{email.ToLower()}");

            return Task.FromResult(true);
        }

        private static async Task<string> BuildOtpEmailBodyAsync(string name, string otp)
        {
            var templatePath = Path.Combine(
                AppContext.BaseDirectory,
                OtpTemplatePath.Replace('/', Path.DirectorySeparatorChar));

            if (!File.Exists(templatePath))
                throw new FileNotFoundException($"Email template not found: {templatePath}");

            var template = await File.ReadAllTextAsync(templatePath);

            return template
                .Replace("{{NAME}}", name)
                .Replace("{{OTP}}", otp);
        }
    }
}
