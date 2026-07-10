namespace InventorySystem.Core.DTOs
{
    public class OrderItemDto
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }

        public decimal BaseUnitPrice { get; set; }

        public decimal BaseTotalPrice { get; set; }
    }
}
