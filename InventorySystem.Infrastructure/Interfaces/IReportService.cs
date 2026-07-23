public interface IReportService
{
    Task<List<ProductSalesReportDto>> GetOrdersByProductAndDateRangeAsync(
        int productId,
        DateTime startDate,
        DateTime endDate);

    Task<Dictionary<string, int>> GetCurrencyFrequencyByProductAsync(
        int productId,
        DateTime startDate,
        DateTime endDate);
    Task<ProductSalesSummaryDto> GetTotalQuantityAndRange(int productId,
        DateTime startDate,
        DateTime endDate);
}
