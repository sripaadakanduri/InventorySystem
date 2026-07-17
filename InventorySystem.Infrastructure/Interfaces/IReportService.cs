using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;

namespace InventorySystem.Service.Interfaces
{
    public interface IReportService
    {
        Task<List<Order>> GetOrdersByProductAndDateRangeAsync(int productId, DateTime startDate, DateTime endDate);
        Task<Dictionary<string, int>> GetCurrencyFrequencyByProductAsync(int productId, DateTime startDate, DateTime endDate);
    }
}
