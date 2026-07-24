using InventorySystem.Core.DTOs.Reports;
public interface IReportService
{
    Task<ProductSalesReportResultDto> GetProductSalesReportAsync(
            int productId,
            DateTime startDate,
            DateTime endDate,
            string currency);
}
