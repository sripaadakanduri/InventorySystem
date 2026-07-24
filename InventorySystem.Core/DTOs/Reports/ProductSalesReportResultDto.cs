namespace InventorySystem.Core.DTOs.Reports
{
    public class ProductSalesReportResultDto
    {
        public List<ProductSalesReportDto> Orders { get; set; } = new();

        public Dictionary<string, int> CurrencyFrequency { get; set; } = new();

        public int TotalQuantity { get; set; }

        public int TotalDays { get; set; }
    }
}