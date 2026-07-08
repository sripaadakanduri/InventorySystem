public interface ICurrencySymbolService
{
    Task<Dictionary<string, string>> GetCurrencySymbolsAsync();

    Task<string?> GetSymbolAsync(string currencyCode);
}