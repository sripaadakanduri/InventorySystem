using System.ComponentModel.DataAnnotations;

namespace InventorySystem.Core.DTOs
{
    public class CreateOrderDto
    {
        [Required]
        public List<CreateOrderItemDto> Items { get; set; }
            = new();
        public string Currency { get; set; } = "USD";
        public decimal ExchangeRate { get; set; } = 1.0m;
    }
}