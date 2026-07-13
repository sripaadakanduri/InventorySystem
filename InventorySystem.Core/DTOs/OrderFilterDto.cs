namespace InventorySystem.Core.DTOs
{
    public class OrderFilterDto
    {
        public string? User { get; set; }

        public int? Status { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string? OrderNumber{ get; set; }
    }
}
