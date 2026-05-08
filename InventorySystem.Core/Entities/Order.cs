using InventorySystem.Core.Enums;

namespace InventorySystem.Core.Entities
{
    public class Order
    {
        public int Id { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public decimal TotalAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<OrderItem> OrderItems { get; set; }
            = new List<OrderItem>();
    }
}