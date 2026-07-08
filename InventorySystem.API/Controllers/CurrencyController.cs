using InventorySystem.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CurrencyController : ControllerBase
    {
        private readonly ICurrencySymbolService _currencySymbolService;

        public CurrencyController(ICurrencySymbolService currencySymbolService)
        {
            _currencySymbolService = currencySymbolService;
        }

        // GET: api/currency/symbol/USD
        [HttpGet("symbol/{currencyCode}")]
        public async Task<IActionResult> GetCurrencySymbol(string currencyCode)
        {
            var symbol = await _currencySymbolService.GetSymbolAsync(currencyCode);

            if (string.IsNullOrEmpty(symbol))
            {
                return NotFound(new
                {
                    Message = $"Currency symbol not found for '{currencyCode}'."
                });
            }

            return Ok(new
            {
                CurrencyCode = currencyCode.ToUpper(),
                Symbol = symbol
            });
        }

        // GET: api/currency/symbols
        [HttpGet("symbols")]
        public async Task<IActionResult> GetAllCurrencySymbols()
        {
            var symbols = await _currencySymbolService.GetCurrencySymbolsAsync();

            return Ok(symbols);
        }
    }
}