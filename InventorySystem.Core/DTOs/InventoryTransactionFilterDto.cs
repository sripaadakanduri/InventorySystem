namespace InventorySystem.Core.DTOs
{
    public class InventoryTransactionFilterDto
    {
        public string? Username { get; set; }

        public string? Product { get; set; }

        public string? ActionType { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
