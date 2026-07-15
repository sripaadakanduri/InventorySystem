namespace InventorySystem.EmailWorker.Interfaces
{
    public interface IAdminLowStockNotificationService
    {
        Task SendDailyAdminLowStockReportAsync();
    }
}