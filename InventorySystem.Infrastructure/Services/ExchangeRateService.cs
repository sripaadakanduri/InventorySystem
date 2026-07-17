using InventorySystem.Service.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Text.Json;

namespace InventorySystem.Service.Services
{
    public class ExchangeRateService:IExchangeRateService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _configuration;
        private const String CacheKey = "ExchangeRates";

        public ExchangeRateService(HttpClient httpClient, IMemoryCache cache, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _cache = cache;
            _configuration = configuration;
        }

        public async Task<Dictionary<String,Decimal>> GetLatestRatesAsync()
        {
            if(_cache.TryGetValue(CacheKey, out Dictionary<String,Decimal>? cachedRates))
            {
                return cachedRates ?? new Dictionary<String, Decimal>();
            }

            var apiKey = _configuration["ExchangeRateApi:ApiKey"];
            var baseCurrency = _configuration["ExchangeRateApi: BaseCurrency"] ?? "USD";

            if (string.IsNullOrEmpty(apiKey))
            {
                throw new Exception("Exchange Api Key is not configured or valid");
            }

            var url = $"https://v6.exchangerate-api.com/v6/{apiKey}/latest/{baseCurrency}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<ExchnageRateApiResponse>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if(result != null && result.Result =="success" && result.Conversion_Rates != null)
            {
                var cachedEntryOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(_configuration.GetValue<int>("CacheSettings:ExchangeRateExpirationHours", 12)));

                _cache.Set(CacheKey, result.Conversion_Rates, cachedEntryOptions);

                return result.Conversion_Rates;
            }
            throw new Exception("Failed To fetch exchaneg rates");

        }
    }

    public class ExchnageRateApiResponse
    {
        public String Result { get; set; } = string.Empty;
        public string Base_Cose { get; set; } = string.Empty;

        public Dictionary<String, decimal> Conversion_Rates { get; set; } = new();
    }
}
