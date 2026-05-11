using InventorySystem.Core.Enums;
using InventorySystem.Core.Interfaces;
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

        public InventoryTransactionsController(IInventoryTransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTransactions()
        {
            var transactions = await _transactionService.GetAllTransactionsAsync();
            return Ok(transactions);
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetTransactionsByProductId(int productId)
        {
            var transactions = await _transactionService.GetTransactionsByProductIdAsync(productId);
            return Ok(transactions);
        }
    }
}
