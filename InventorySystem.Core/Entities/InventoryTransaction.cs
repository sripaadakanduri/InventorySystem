namespace InventorySystem.Core.Entities
{
    public class InventoryTransaction
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public Product? Product { get; set; }

        public int UserId { get; set; }

        public User? User { get; set; }

        public int QuantityChanged { get; set; }

        public int RemainingStock { get; set; }

        public string ActionType { get; set; }
            = string.Empty;

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;
    }
}