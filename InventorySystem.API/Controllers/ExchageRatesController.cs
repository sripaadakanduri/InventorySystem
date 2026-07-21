using InventorySystem.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]    public class ExchangeRatesController : ControllerBase
    {
        private readonly IExchangeRateService _exchangeRateService;

        public ExchangeRatesController(IExchangeRateService exchangeRateService)
        {
            _exchangeRateService = exchangeRateService;
        }
        [HttpGet]
        public async Task<IActionResult> GetLatestRates()
        {
            try
            {
                var rates = await _exchangeRateService.GetLatestRatesAsync();
                return Ok(rates);
            }
            catch(Exception ex)
            {
                return BadRequest(new { message =ex.Message});
            }
        }

    }
}
