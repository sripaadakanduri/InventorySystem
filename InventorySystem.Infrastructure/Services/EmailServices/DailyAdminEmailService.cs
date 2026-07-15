using InventorySystem.Core.Entities;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Service.Services
{
    public class DailyAdminEmailService:IAdminLowStockNotificationService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        private const string TemplatePath =
            "EmailPages/LowStockReportTemplate.html";

        public DailyAdminEmailService(
            AppDbContext context,
            IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task SendDailyAdminLowStockReportAsync()
        {
            var admins = await _context.Users
                .Where(x => x.Role == "Admin")
                .ToListAsync();

            if (!admins.Any())
                return;

            var lowStockProducts = await _context.Products
                .Where(p => p.StockQuantity <= 5)
                .OrderBy(p => p.Name)
                .ToListAsync();

            if (!lowStockProducts.Any())
                return;

            var body = await BuildEmailBody(lowStockProducts);

            foreach (var admin in admins)
            {
                await _emailService.SendEmailAsync(
                    admin.Email,
                    "Daily Low Stock Report",
                    body);
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