using InventorySystem.Service.DTOs.CurrencyInfoDtos;
using InventorySystem.Service.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text.Json;

namespace InventorySystem.Service.Services
{
    public class CurrencySymbolService : ICurrencySymbolService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _configuration;

        private const string CacheKey = "CurrencySymbols";

        public CurrencySymbolService(
            HttpClient httpClient,
            IMemoryCache cache,
            IConfiguration configuration)
        {
            _httpClient = httpClient;
            _cache = cache;
            _configuration = configuration;
        }

        public async Task<Dictionary<string, CurrencyInfo>> GetCurrencySymbolsAsync()
        {
            if (_cache.TryGetValue(CacheKey, out Dictionary<string, CurrencyInfo>? cached))
            {
                return cached!;
            }

            var apiKey = _configuration["RestCountries:ApiKey"];

            _httpClient.DefaultRequestHeaders.Clear();

            if (!string.IsNullOrWhiteSpace(apiKey))
            {
                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", apiKey);
            }

            var currencies = new Dictionary<string, CurrencyInfo>(StringComparer.OrdinalIgnoreCase);

            const int limit = 100;
            int offset = 0;
            bool more = true;

            while (more)
            {
                var response = await _httpClient.GetAsync(
                    $"https://api.restcountries.com/countries/v5?limit={limit}&offset={offset}");

                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();

                var result = JsonSerializer.Deserialize<ApiResponse>(
                    json,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                if (result?.Data?.Objects != null)
                {
                    foreach (var country in result.Data.Objects)
                    {
                        if (country.Currencies == null || country.Currencies.Count == 0)
                            continue;

                        foreach (var currency in country.Currencies)
                        {
                            if (string.IsNullOrWhiteSpace(currency.Code))
                                continue;

                            currencies.TryAdd(
                                currency.Code,
                                new CurrencyInfo
                                {
                                    Code = currency.Code,
                                    Name = currency.Name,
                                    Symbol = string.IsNullOrWhiteSpace(currency.Symbol)
                                        ? currency.Code
                                        : currency.Symbol,
                                    CountryOfficialName = country.Names?.Common ?? string.Empty
                                });
                        }
                    }
                }

                more = result?.Data?.Meta?.More ?? false;
                offset += limit;
            }

            var sortedCurrencies = currencies
                .OrderBy(c => c.Key) // Sort by currency code (AUD, CAD, EUR...)
                .ToDictionary(
                    c => c.Key,
                    c => c.Value,
                    StringComparer.OrdinalIgnoreCase);

            _cache.Set(
                CacheKey,
                sortedCurrencies,
                new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(
                        _configuration.GetValue<int>("CacheSettings:CurrencySymbolExpirationHours", 24))
                });

            return sortedCurrencies;
        }

        public async Task<string?> GetSymbolAsync(string currencyCode)
        {
            if (string.IsNullOrWhiteSpace(currencyCode))
                return null;

            var currencies = await GetCurrencySymbolsAsync();

            return currencies.TryGetValue(
                currencyCode.ToUpperInvariant(),
                out var currency)
                ? currency.Symbol
                : null;
        }

        public async Task<string?> GetCountryNameAsync(string currencyCode)
        {
            if (string.IsNullOrWhiteSpace(currencyCode))
                return null;

            var currencies = await GetCurrencySymbolsAsync();

            return currencies.TryGetValue(
                currencyCode.ToUpperInvariant(),
                out var currency)
                ? currency.Name
                : null;
        }

    }
}
