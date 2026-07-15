using InventorySystem.Service.Interfaces;

namespace InventorySystem.Service.Services.Jobs
{
    public class EmailJob
    {
        private readonly IAdminLowStockNotificationService _adminNotificationService;
        private readonly IUserLowStockNotificationService _userNotificationService;

        public EmailJob(
            IAdminLowStockNotificationService adminNotificationService,
            IUserLowStockNotificationService userNotificationService)
        {
            _adminNotificationService = adminNotificationService;
            _userNotificationService = userNotificationService;
        }

        public async Task AdminExecute()
        {
            Console.WriteLine("Admin emails started sending");

            await _adminNotificationService.SendDailyAdminLowStockReportAsync();

            Console.WriteLine("Admin emails successfully sent");
        }

        public async Task UserDailyExecute()
        {
            Console.WriteLine("User emails started sending");

            await _userNotificationService.SendDailyUserLowStockReportAsync();

            Console.WriteLine("User emails successfully sent");
        }
    }
}
