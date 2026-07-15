namespace InventorySystem.Service.DTOs.CurrencyInfoDtos
{
    public class CurrencyInfo
    {
        public string Code { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string? Symbol { get; set; }

        public string CountryOfficialName { get; set; } = string.Empty;
    }
}