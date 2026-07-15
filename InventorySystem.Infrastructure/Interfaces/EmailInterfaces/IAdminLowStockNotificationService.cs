namespace InventorySystem.Service.Interfaces
{
    public interface IAdminLowStockNotificationService
    {
        Task SendDailyAdminLowStockReportAsync();
    }
}