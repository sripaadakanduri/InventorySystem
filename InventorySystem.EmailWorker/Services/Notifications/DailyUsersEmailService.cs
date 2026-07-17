using InventorySystem.EmailWorker.Interfaces;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using InventorySystem.Core.Configurations;
using InventorySystem.EmailWorker.Services;

namespace InventorySystem.EmailWorker.Services.Notifications
    {
        public class DailyUsersEmailService
            : BaseLowStockNotificationService,
              IUserLowStockNotificationService
        {
        public DailyUsersEmailService(
            AppDbContext context,
            SmtpEmailService emailService,
            IOptions<LowStockNotificationSettings> settings)
            : base(context, emailService, settings)
        {
        }

            public async Task SendDailyUserLowStockReportAsync()
            {
                var today = DateTime.Today;

                var validSchedules = new List<string>
                {
                    "D",
                    $"W-{(int)today.DayOfWeek}",
                    $"M-{today.Day}",
                    $"Y-{today.Month}-{today.Day}"
                };

                var daysInMonth = DateTime.DaysInMonth(today.Year, today.Month);
                if (today.Day == daysInMonth)
                {
                    for (int d = today.Day + 1; d <= 31; d++)
                    {
                        validSchedules.Add($"M-{d}");
                        validSchedules.Add($"Y-{today.Month}-{d}");
                    }
                }

                var users = await Context.Users
                    .Where(x => x.Role == "User" && validSchedules.Contains(x.NotificationSchedule))
                    .ToListAsync();

                if (!users.Any())
                    return;

                var products = await GetLowStockProductsAsync();

                if (!products.Any())
                    return;

                var pdfBytes = LowStockPdfReportGenerator.Generate(products);

                foreach (var user in users)
                {
                    var body = await BuildEmailBody(products, user);
                    await EmailService.SendEmailWithAttachmentAsync(
                        user.Email,
                        "Low Stock Report",
                        body,
                        pdfBytes,
                        "LowStockReport.pdf");
                }
            }
        }
    }