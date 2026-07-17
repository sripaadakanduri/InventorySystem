using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Service.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Order>> GetOrdersByProductAndDateRangeAsync(int productId, DateTime startDate, DateTime endDate)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.OrderItems.Any(oi => oi.ProductId == productId) 
                         && o.CreatedAt > startDate 
                         && o.CreatedAt < endDate)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Dictionary<string, int>> GetCurrencyFrequencyByProductAsync(int productId, DateTime startDate, DateTime endDate)
        {
            return await _context.Orders
                .Where(o => o.OrderItems.Any(oi => oi.ProductId == productId)
                         && o.CreatedAt > startDate 
                         && o.CreatedAt < endDate)
                .GroupBy(o => o.Currency)
                .ToDictionaryAsync(g => g.Key, g => g.Count());
        }
    }
}
