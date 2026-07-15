namespace InventorySystem.EmailWorker.Interfaces
{
    public interface IUserLowStockNotificationService
    {
        Task SendDailyUserLowStockReportAsync();
    }
}