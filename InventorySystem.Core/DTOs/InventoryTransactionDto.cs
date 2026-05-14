namespace InventorySystem.Core.DTOs
{
    public class InventoryTransactionDto
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public string ProductName { get; set; }
            = string.Empty;

        public int UserId { get; set; }

        public string Username { get; set; }
            = string.Empty;

        public int QuantityChanged { get; set; }

        public int RemainingStock { get; set; }

        public string ActionType { get; set; }
            = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}