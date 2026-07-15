using InventorySystem.Service.DTOs.CurrencyInfoDtos;

namespace InventorySystem.Service.DTOs.CurrencyInfoDtos
{
    public class ApiResponse
    {
        public ApiData? Data { get; set; }
    }

    public class ApiData
    {
        public List<CountryResponse>? Objects { get; set; }

        public Meta? Meta { get; set; }
    }

    public class Meta
    {
        public bool More { get; set; }
    }

    public class CountryResponse
    {
        public CountryNames? Names { get; set; }

        public List<CurrencyInfo>? Currencies { get; set; }
    }

    public class CountryNames
    {
        public string? Common { get; set; }

        public string? Official { get; set; }
    }
}