using InventorySystem.Core.Entities;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace InventorySystem.EmailWorker.Services.Notifications
{
    public abstract class BaseLowStockNotificationService
    {
        protected readonly AppDbContext Context;
        protected readonly IEmailService EmailService;

        protected const string TemplatePath = "Templates/LowStockReportTemplate.html";

        protected BaseLowStockNotificationService(
            AppDbContext context,
            IEmailService emailService)
        {
            Context = context;
            EmailService = emailService;
        }

        protected async Task<List<Product>> GetLowStockProductsAsync()
        {
            return await Context.Products
                .Where(x => x.StockQuantity <= 5)
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        protected async Task<string> BuildEmailBody(List<Product> products)
        {
            var path = Path.Combine(
                AppContext.BaseDirectory,
                TemplatePath.Replace('/', Path.DirectorySeparatorChar));

            var template = await File.ReadAllTextAsync(path);

            var rows = new StringBuilder();

            foreach (var product in products)
            {
                rows.Append($@"
                <tr>
                    <td>{product.Name}</td>
                    <td>{product.StockQuantity}</td>
                </tr>");
            }

            return template.Replace("{{PRODUCT_ROWS}}", rows.ToString());
        }
    }
}