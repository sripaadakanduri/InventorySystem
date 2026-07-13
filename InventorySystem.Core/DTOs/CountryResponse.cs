namespace InventorySystem.Service.DTOs
{
    public class CountryResponse
    {
        public Dictionary<string, CurrencyInfo>? Currencies { get; set; }
    }

    public class CurrencyInfo
    {
        public string Name { get; set; } = string.Empty;
        public string Symbol { get; set; } = string.Empty;
    }
}