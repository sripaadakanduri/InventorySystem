using InventorySystem.Common.Enums;
using InventorySystem.Core.DTOs;
using InventorySystem.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = UserRoles.Admin)]
    public class InventoryTransactionsController : ControllerBase
    {
        private readonly IInventoryTransactionService _transactionService;

        public InventoryTransactionsController(
            IInventoryTransactionService transactionService
        )
        {
            _transactionService = transactionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTransactions(
            [FromQuery] InventoryTransactionFilterDto filter
        )
        {
            var transactions =
                await _transactionService.GetAllTransactionsAsync(filter);

            return Ok(transactions);
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetTransactionsByProductId(
            int productId
        )
        {
            var transactions =
                await _transactionService.GetTransactionsByProductIdAsync(
                    productId
                );

            return Ok(transactions);
        }
    }
}
