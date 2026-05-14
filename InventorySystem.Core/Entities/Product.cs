using System.ComponentModel.DataAnnotations;
namespace InventorySystem.Core.Entities
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }
        [Required]
        public int StockQuantity { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;

        [Timestamp]
        public byte[]? Version { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }= DateTime.UtcNow;

    }
}
