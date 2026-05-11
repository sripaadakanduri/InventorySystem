using InventorySystem.Core.Entities;

namespace InventorySystem.Core.Interfaces
{
    public interface IInventoryTransactionService
    {
        Task<IEnumerable<InventoryTransaction>> GetAllTransactionsAsync();
        Task<IEnumerable<InventoryTransaction>> GetTransactionsByProductIdAsync(int productId);
        Task LogTransactionAsync(int productId, int quantityChanged, int remainingStock, string actionType);
    }
}
