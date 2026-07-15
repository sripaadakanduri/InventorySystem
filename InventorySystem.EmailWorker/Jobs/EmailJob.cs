using InventorySystem.EmailWorker.Interfaces;

namespace InventorySystem.EmailWorker.Jobs
{
    public class EmailJob
    {
        private readonly IAdminLowStockNotificationService _adminService;
        private readonly IUserLowStockNotificationService _userService;

        public EmailJob(
            IAdminLowStockNotificationService adminService,
            IUserLowStockNotificationService userService)
        {
            _adminService = adminService;
            _userService = userService;
        }

        public async Task AdminExecute()
        {
            Console.WriteLine("Admin email job started.");

            await _adminService.SendDailyAdminLowStockReportAsync();

            Console.WriteLine("Admin email job completed.");
        }

        public async Task UserDailyExecute()
        {
            Console.WriteLine("User email job started.");

            await _userService.SendDailyUserLowStockReportAsync();

            Console.WriteLine("User email job completed.");
        }
    }
}
