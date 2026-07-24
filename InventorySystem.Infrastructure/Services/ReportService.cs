using InventorySystem.Core.DTOs.Reports;
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

        public async Task<ProductSalesReportResultDto> GetProductSalesReportAsync(
            int productId,
            DateTime startDate,
            DateTime endDate,
            string currency)
        {
            var orderItems = await _context.OrderItems
                .Where(i =>
                    i.ProductId == productId &&
                    i.Order.CreatedAt >= startDate &&
                    i.Order.CreatedAt <= endDate)
                .Select(i => new
                {
                    ProductName = i.Product.Name,
                    OrderNumber = i.Order.OrderNumber,
                    OrderDate = i.Order.CreatedAt,
                    Quantity = i.Quantity,
                    OriginalAmount = i.TotalPrice,
                    OriginalCurrency = i.Order.Currency,
                    BaseAmount = i.BaseTotalPrice
                })
                .OrderByDescending(i => i.OrderDate)
                .ToListAsync();

            var exchangeRates = await _context.ExchangeRates
                .Where(r =>
                    r.CurrencyCode == currency &&
                    r.Date >= startDate.Date &&
                    r.Date <= endDate.Date)
                .OrderBy(r => r.Date)
                .ToListAsync();

            var reportOrders = new List<ProductSalesReportDto>();

            foreach (var item in orderItems)
            {
                var rate = exchangeRates
                    .Where(r => r.Date.Date == item.OrderDate.Date)
                    .FirstOrDefault();

                if (rate == null)
                {
                    rate = exchangeRates.FirstOrDefault();
                }

                decimal convertedAmount = rate != null
                    ? item.BaseAmount * rate.Rate
                    : item.BaseAmount;

                reportOrders.Add(new ProductSalesReportDto
                {
                    ProductName = item.ProductName,
                    OrderNumber = item.OrderNumber,
                    OrderDate = item.OrderDate,
                    Quantity = item.Quantity,
                    OriginalAmount = item.OriginalAmount,
                    OriginalCurrency = item.OriginalCurrency,
                    ConvertedAmount = convertedAmount
                });
            }

            return new ProductSalesReportResultDto
            {
                Orders = reportOrders,

                CurrencyFrequency = orderItems
                    .GroupBy(x => x.OriginalCurrency)
                    .ToDictionary(g => g.Key, g => g.Count()),

                TotalQuantity = orderItems.Sum(x => x.Quantity),

                TotalDays = (endDate.Date - startDate.Date).Days + 1
            };
        }
    }
}