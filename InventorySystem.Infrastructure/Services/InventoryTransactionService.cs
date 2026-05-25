using InventorySystem.Core.Entities;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Service.Services
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
                .Include(t => t.User)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new InventoryTransaction
                {
                    Id = t.Id,
                    ProductId = t.ProductId,
                    Product = t.Product != null ? t.Product : null,
                    UserId = t.UserId,
                    User = t.User != null ? t.User : null,
                    QuantityChanged = t.QuantityChanged,
                    RemainingStock = t.RemainingStock,
                    ActionType = t.ActionType,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<InventoryTransaction>> GetTransactionsByProductIdAsync(int productId)
        {
            return await _context.InventoryTransactions
                .Include(t => t.Product)
                .Include(t => t.User)
                .Where(t => t.ProductId == productId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new InventoryTransaction
                {
                    Id = t.Id,
                    ProductId = t.ProductId,
                    Product = t.Product != null ? t.Product : null,
                    UserId = t.UserId,
                    User = t.User != null ? t.User : null,
                    QuantityChanged = t.QuantityChanged,
                    RemainingStock = t.RemainingStock,
                    ActionType = t.ActionType,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();
        }

        public async Task LogTransactionAsync(
            int productId,
            int userId,
            int quantityChanged,
            int remainingStock,
            string actionType
        )
        {
            if (string.IsNullOrWhiteSpace(actionType))
                throw new ArgumentException("ActionType is required");

            var productExists = await _context.Products.AnyAsync(p => p.Id == productId);
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);

            if (!productExists) throw new Exception($"Product {productId} does not exist");
            if (!userExists) throw new Exception($"User {userId} does not exist");

            var transaction = new InventoryTransaction
            {
                ProductId = productId,
                UserId = userId,
                QuantityChanged = quantityChanged,
                RemainingStock = remainingStock,
                ActionType = actionType,
                CreatedAt = DateTime.UtcNow
            };

            await _context.InventoryTransactions.AddAsync(transaction);
            await _context.SaveChangesAsync();
        }
    }
}