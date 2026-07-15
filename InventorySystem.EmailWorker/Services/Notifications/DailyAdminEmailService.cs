using InventorySystem.Service.Data;
using InventorySystem.EmailWorker.Interfaces;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace InventorySystem.EmailWorker.Services.Notifications
{
    public class DailyAdminEmailService
        : BaseLowStockNotificationService,
          IAdminLowStockNotificationService
    {
        public DailyAdminEmailService(
            AppDbContext context,
            IEmailService emailService)
            : base(context, emailService)
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

            var body = await BuildEmailBody(products);

            foreach (var admin in admins)
            {
                await EmailService.SendEmailAsync(
                    admin.Email,
                    "Daily Low Stock Report",
                    body);
            }
        }
    }
}