using InventorySystem.Core.Entities;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System.Net.WebSockets;

namespace InventorySystem.Service.Services.EmailServices
{
    public class DailyUsersEmailService : IUserLowStockNotificationService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private const string TemplatePath =
            "EmailPages/LowStockReportTemplate.html";

        public DailyUsersEmailService(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task SendDailyUserLowStockReportAsync()
        {
            var users = await _context.Users
                .Where(x => x.Role == "User" && x.NotificationSchedule=="D")
                .ToListAsync();
            if (!users.Any())
            {
                return;
            }

            var lowStockProducts = await _context.Products
                .Where(p => p.StockQuantity <= 5)
                .OrderBy(p => p.Name)
                .ToListAsync();

            if (!lowStockProducts.Any())
                return;

            var body =await BuildEmailBody(lowStockProducts);

            foreach(var user in users)
            {
                await _emailService.SendEmailAsync(user.Email, "Daily Low Stock Repost", body);
            }

        }
        private async Task<string> BuildEmailBody(List<Product> products)
        {
            var path = Path.Combine(
                AppContext.BaseDirectory,
                TemplatePath.Replace('/', Path.DirectorySeparatorChar));

            var template = await File.ReadAllTextAsync(path);

            var rows = "";

            foreach (var product in products)
            {
                rows += $@"
                <tr>
                    <td>{product.Name}</td>
                    <td>{product.StockQuantity}</td>
                </tr>";
            }

            return template.Replace("{{PRODUCT_ROWS}}", rows);
        }
    }
}
