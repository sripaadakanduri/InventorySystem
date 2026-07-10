using System.ComponentModel.DataAnnotations;

namespace InventorySystem.Core.DTOs
{
    public class BaseDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }
        [Required]
        public int StockQuantity { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;
    }
}
