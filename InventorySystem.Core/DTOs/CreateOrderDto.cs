using System.ComponentModel.DataAnnotations;

namespace InventorySystem.Core.DTOs
{
    public class CreateOrderDto
    {
        [Required]
        public List<CreateOrderItemDto> Items { get; set; }
            = new();
    }
}