namespace InventorySystem.Core.DTOs
{
    public class ProductFilterDto
    {
        public string? Name { get; set; }

        public string? Category { get; set; }

        public decimal? MinPrice { get; set; }

        public decimal? MaxPrice { get; set; }

        public int? Stock { get; set; }

        public int? MaxStock { get; set; }

        public string? PriceSort { get; set; }
    }
}
