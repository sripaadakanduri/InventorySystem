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

        [HttpGet("report-data")]
        public async Task<IActionResult> GetOrdersByProductAndDateRange(
            [FromQuery] int productId, 
            [FromQuery] DateOnly startDate, 
            [FromQuery] DateOnly endDate,
            [FromQuery] string currency)
        {
            var startDateTime = startDate.ToDateTime(TimeOnly.MinValue);
            var endDateTime = endDate.ToDateTime(TimeOnly.MaxValue);
            
            var data = await _reportService.GetProductSalesReportAsync(productId, startDateTime, endDateTime,currency);
            return Ok(data);
        }
    }
}
