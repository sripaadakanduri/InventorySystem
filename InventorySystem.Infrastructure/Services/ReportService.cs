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

        public async Task<List<ProductSalesReportDto>> GetOrdersByProductAndDateRangeAsync(
            int productId,
            DateTime startDate,
            DateTime endDate)
        {
            return await _context.OrderItems
                .Where(i =>
                    i.ProductId == productId &&
                    i.Order.CreatedAt >= startDate &&
                    i.Order.CreatedAt <= endDate)
                .Select(i => new ProductSalesReportDto
                {
                    ProductName = i.Product.Name,
                    OrderNumber = i.Order.OrderNumber,
                    OrderDate = i.Order.CreatedAt,
                    Quantity = i.Quantity,
                    OriginalAmount = i.TotalPrice,
                    OriginalCurrency = i.Order.Currency,
                    ConvertedAmount = i.BaseTotalPrice
                })
                .OrderByDescending(x => x.OrderDate)
                .ToListAsync();
        }

        public async Task<Dictionary<string, int>> GetCurrencyFrequencyByProductAsync(int productId, DateTime startDate, DateTime endDate)
        {
            var data = await _context.Orders
             .Where(o => o.OrderItems.Any(oi => oi.ProductId == productId)
                      && o.CreatedAt >= startDate
                      && o.CreatedAt <= endDate)
             .GroupBy(o => o.Currency)
             .Select(g => new
             {
                 Currency = g.Key,
                 Count = g.Count()
             })
             .OrderByDescending(x => x.Count)
             .ToListAsync();

            return data.ToDictionary(x => x.Currency, x => x.Count);
        }

        public async Task<ProductSalesSummaryDto> GetTotalQuantityAndRange(
            int productId,
            DateTime startDate,
            DateTime endDate)
        {
            var totalQuantity = await _context.OrderItems
                .Where(i =>
                    i.ProductId == productId &&
                    i.Order.CreatedAt >= startDate &&
                    i.Order.CreatedAt <= endDate)
                .SumAsync(i => (int?)i.Quantity) ?? 0;

            return new ProductSalesSummaryDto
            {
                TotalQuantity = totalQuantity,
                TotalDays = (endDate.Date - startDate.Date).Days + 1
            };
        }
    }
}
