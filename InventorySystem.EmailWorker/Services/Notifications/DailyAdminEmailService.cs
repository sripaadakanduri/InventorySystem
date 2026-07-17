using InventorySystem.Service.Data;
using InventorySystem.EmailWorker.Interfaces;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using InventorySystem.Core.Configurations;
using InventorySystem.EmailWorker.Services;


namespace InventorySystem.EmailWorker.Services.Notifications
{
    public class DailyAdminEmailService
        : BaseLowStockNotificationService,
          IAdminLowStockNotificationService
    {
        public DailyAdminEmailService(
            AppDbContext context,
            SmtpEmailService emailService,
            IOptions<LowStockNotificationSettings> settings)
            : base(context, emailService, settings)
        {
        }

        public async Task SendDailyAdminLowStockReportAsync()
        {
            var admins = await Context.Users
                .Where(x => x.Role == "Admin")
                .ToListAsync();

            if (!admins.Any())
                return;

            var products = await GetLowStockProductsAsync();

            if (!products.Any())
                return;

            var body = await BuildEmailBody(products,"admin");
            var pdfBytes = LowStockPdfReportGenerator.Generate(products);

            foreach (var admin in admins)
            {
                await EmailService.SendEmailWithAttachmentAsync(
                    admin.Email,
                    "Daily Low Stock Report",
                    body,
                    pdfBytes,
                    "LowStockReport.pdf");
            }
        }
    }
}