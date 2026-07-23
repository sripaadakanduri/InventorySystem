using InventorySystem.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("orders-by-product")]
        public async Task<IActionResult> GetOrdersByProductAndDateRange(
            [FromQuery] int productId, 
            [FromQuery] DateOnly startDate, 
            [FromQuery] DateOnly endDate)
        {
            var startDateTime = startDate.ToDateTime(TimeOnly.MinValue);
            var endDateTime = endDate.ToDateTime(TimeOnly.MaxValue);
            
            var orders = await _reportService.GetOrdersByProductAndDateRangeAsync(productId, startDateTime, endDateTime);
            return Ok(orders);
        }

        [HttpGet("currency-frequency")]
        public async Task<IActionResult> GetCurrencyFrequencyByProduct(
            [FromQuery] int productId, 
            [FromQuery] DateOnly startDate, 
            [FromQuery] DateOnly endDate)
        {
            var startDateTime = startDate.ToDateTime(TimeOnly.MinValue);
            var endDateTime = endDate.ToDateTime(TimeOnly.MaxValue);

            var frequencies = await _reportService.GetCurrencyFrequencyByProductAsync(productId, startDateTime, endDateTime);
            return Ok(frequencies);
        }
        [HttpGet("total-quantity")]
        public async Task<IActionResult> GetTotalQuantityAndRange(
            [FromQuery] int productId,
            [FromQuery] DateOnly startDate,
            [FromQuery] DateOnly endDate)
        {
            var startDateTime = startDate.ToDateTime(TimeOnly.MinValue);
            var endDateTime = endDate.ToDateTime(TimeOnly.MaxValue);

            var result = await _reportService.GetTotalQuantityAndRange(productId, startDateTime, endDateTime);

            return Ok(result);
        }
    }
}
