using InventorySystem.Core.Entities;
using InventorySystem.Core.Interfaces;
using InventorySystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Infrastructure.Services
{
    public class InventoryTransactionService : IInventoryTransactionService
    {
        private readonly AppDbContext _context;

        public InventoryTransactionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InventoryTransaction>> GetAllTransactionsAsync()
        {
            return await _context.InventoryTransactions
                .Include(t => t.Product)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<InventoryTransaction>> GetTransactionsByProductIdAsync(int productId)
        {
            return await _context.InventoryTransactions
                .Include(t => t.Product)
                .Where(t => t.ProductId == productId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task LogTransactionAsync(int productId, int quantityChanged, int remainingStock, string actionType)
        {
            var transaction = new InventoryTransaction
            {
                ProductId = productId,
                QuantityChanged = quantityChanged,
                RemainingStock = remainingStock,
                ActionType = actionType,
                CreatedAt = DateTime.UtcNow
            };

            _context.InventoryTransactions.Add(transaction);
            await _context.SaveChangesAsync();
        }
    }
}
