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

        public async Task<Dictionary<string, string>> GetCurrencySymbolsAsync()
        {
            if (_cache.TryGetValue(CacheKey, out Dictionary<string, string>? cached))
            {
                return cached!;
            }

            var apiKey = _configuration["RestCountries:ApiKey"];

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            var symbols = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

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
                        if (country.Currencies == null)
                            continue;

                        foreach (var currency in country.Currencies)
                        {
                            if (string.IsNullOrWhiteSpace(currency.Code))
                                continue;

                            symbols.TryAdd(
                                currency.Code,
                                string.IsNullOrWhiteSpace(currency.Symbol)
                                    ? currency.Code
                                    : currency.Symbol);
                        }
                    }
                }

                more = result?.Data?.Meta?.More ?? false;
                offset += limit;
            }

            _cache.Set(CacheKey, symbols, TimeSpan.FromHours(24));

            return symbols;
        }

        public async Task<string?> GetSymbolAsync(string currencyCode)
        {
            var symbols = await GetCurrencySymbolsAsync();

            return symbols.TryGetValue(currencyCode.ToUpperInvariant(), out var symbol)
                ? symbol
                : null;
        }

        // ==========================================================
        // DTOs
        // ==========================================================

        private class ApiResponse
        {
            public ApiData? Data { get; set; }
        }

        private class ApiData
        {
            public List<CountryResponse>? Objects { get; set; }

            public Meta? Meta { get; set; }
        }

        private class Meta
        {
            public bool More { get; set; }
        }

        private class CountryResponse
        {
            public List<CurrencyInfo>? Currencies { get; set; }
        }

        private class CurrencyInfo
        {
            public string Code { get; set; } = string.Empty;

            public string Name { get; set; } = string.Empty;

            public string? Symbol { get; set; }
        }
    }
}