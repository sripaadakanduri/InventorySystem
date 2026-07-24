namespace InventorySystem.Core.DTOs.Reports
{
    public class ProductSalesReportDto
    {
        public string ProductName { get; set; }
        public string OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public int Quantity { get; set; }
        public decimal OriginalAmount { get; set; }
        public string OriginalCurrency { get; set; }
        public decimal ConvertedAmount { get; set; }
    }
}