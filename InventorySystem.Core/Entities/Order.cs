using InventorySystem.Common.Enums;

namespace InventorySystem.Core.Entities
{
    public class Order
    {
        public int Id { get; set; }

        // Foreign Key
        public int UserId { get; set; }

        public User? User { get; set; }

        public OrderStatus Status { get; set; }
            = OrderStatus.Pending;

        public decimal TotalAmount { get; set; }

        public string Currency { get; set; } = "USD";
        public decimal ExchangeRate { get; set; } = 1.0m;

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> OrderItems { get; set; }
            = new List<OrderItem>();
    }
}
