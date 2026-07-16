using InventorySystem.Core.Configurations;
using InventorySystem.Core.Entities;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text;

namespace InventorySystem.EmailWorker.Services.Notifications
{
    public abstract class BaseLowStockNotificationService
    {
        protected readonly AppDbContext Context;
        protected readonly IEmailService EmailService;
        protected readonly LowStockNotificationSettings Settings;

        protected BaseLowStockNotificationService(
            AppDbContext context,
            IEmailService emailService,
            IOptions<LowStockNotificationSettings> settings)
        {
            Context = context;
            EmailService = emailService;
            Settings = settings.Value;
        }

        protected async Task<List<Product>> GetLowStockProductsAsync()
        {
            return await Context.Products
                .Where(p => p.StockQuantity <= Settings.Threshold)
                .OrderBy(p => p.Name)
                .ToListAsync();
        }

        protected async Task<string> BuildEmailBody(List<Product> products, string role)
        {
            var templatePath = role.Equals("admin", StringComparison.OrdinalIgnoreCase)
                ? "Templates/LowStockReportTemplate.html"
                : "Templates/UserTemplate.html";

            var path = Path.Combine(
                AppContext.BaseDirectory,
                templatePath.Replace('/', Path.DirectorySeparatorChar));

            var template = await File.ReadAllTextAsync(path);

            var rows = new StringBuilder();

            foreach (var product in products.Take(Settings.MaxProductsInEmail))
            {
                rows.Append($@"
        <tr>
            <td>{product.Name}</td>
            <td>{product.Category}</td>
            <td>{product.StockQuantity}</td>
        </tr>");
            }

            template = template.Replace("{{PRODUCT_ROWS}}", rows.ToString());

            if (products.Count > Settings.MaxProductsInEmail)
            {
                var link = $@"
                    <p style='margin-top:20px;'>
                        There are more low-stock products.
                        <a href='{Settings.ProductPageUrl}'>
                            Click here to view all low-stock products.
                        </a>
                    </p>";

                template = template.Replace("{{MORE_PRODUCTS_LINK}}", link);
            }
            else
            {
                template = template.Replace("{{MORE_PRODUCTS_LINK}}", string.Empty);
            }

            return template;
        }
    }
}