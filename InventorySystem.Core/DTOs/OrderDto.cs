using InventorySystem.Common.Enums;

namespace InventorySystem.Core.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public OrderStatus Status { get; set; }

        public decimal TotalAmount { get; set; }

        public string Currency { get; set; } = "INR";
        public decimal ExchnageRate { get; set; } = 1.0m;
        public int TotalQuantity { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<OrderItemDto> Items { get; set; }
            = new();
    }
}