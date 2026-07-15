using InventorySystem.Service.DTOs.CurrencyInfoDtos;

namespace InventorySystem.Service.Interfaces
{
    public interface ICurrencySymbolService
    {
        Task<Dictionary<string, CurrencyInfo>> GetCurrencySymbolsAsync();

        Task<string?> GetSymbolAsync(string currencyCode);

        Task<string?> GetCountryNameAsync(string currencyCode);
    }
}