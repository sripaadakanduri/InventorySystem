using System.ComponentModel.DataAnnotations;

namespace InventorySystem.Core.DTOs
{
    public class BaseDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be strictly positive.")]
        public decimal Price { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Stock quantity must be at least 1.")]
        public int StockQuantity { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;
    }
}
