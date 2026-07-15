namespace InventorySystem.Service.Interfaces
{
    public interface IUserLowStockNotificationService
    {
        Task SendDailyUserLowStockReportAsync();
    }
}