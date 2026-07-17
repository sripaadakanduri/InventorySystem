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
        protected readonly SmtpEmailService EmailService;
        protected readonly LowStockNotificationSettings Settings;

        protected BaseLowStockNotificationService(
            AppDbContext context,
            SmtpEmailService emailService,
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

        protected async Task<string> BuildEmailBody(List<Product> products, User user)
        {
            var templatePath = user.Role.Equals("admin", StringComparison.OrdinalIgnoreCase)
                ? "Templates/LowStockReportTemplate.html"
                : "Templates/UserTemplate.html";

            var path = Path.Combine(
                AppContext.BaseDirectory,
                templatePath.Replace('/', Path.DirectorySeparatorChar));

            var template = await File.ReadAllTextAsync(path);

            var tableHtml = string.Empty;
            var linkHtml = string.Empty;

            if (products.Count <= Settings.MaxProductsInEmail)
            {
                var rows = new StringBuilder();
                foreach (var product in products)
                {
                    rows.Append($@"
        <tr>
            <td>{product.Name}</td>
            <td>{product.Category}</td>
            <td>{product.StockQuantity}</td>
        </tr>");
                }

                tableHtml = $@"
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Current Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>";
            }
            else
            {
                linkHtml = $@"
                    <p style='margin-top:20px;'>
                        There are {products.Count} low-stock products. 
                        <a href='{Settings.ProductPageUrl}?stock={Settings.Threshold}&userEmail={user.Email}'>
                            Click here to view all low-stock products.
                        </a>
                    </p>";
            }

            template = template.Replace("{{PRODUCT_TABLE}}", tableHtml);
            template = template.Replace("{{MORE_PRODUCTS_LINK}}", linkHtml);
            template = template.Replace("{{USERNAME}}", user.Username);

            var imagePath = Path.Combine(AppContext.BaseDirectory, "Images", "inventory_image.jpg");
            if (File.Exists(imagePath))
            {
                var imageBytes = await File.ReadAllBytesAsync(imagePath);
                var base64Image = Convert.ToBase64String(imageBytes);
                template = template.Replace("{{LOGO_IMAGE}}", $"data:image/jpeg;base64,{base64Image}");
            }
            else
            {
                template = template.Replace("{{LOGO_IMAGE}}", string.Empty);
            }

            return template;
        }
    }
}