using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;

namespace InventorySystem.Service.Interfaces
{
    public interface IInventoryTransactionService
    {
        Task<IEnumerable<InventoryTransaction>> GetAllTransactionsAsync(
            InventoryTransactionFilterDto? filter = null
        );

        Task<IEnumerable<InventoryTransaction>>
            GetTransactionsByProductIdAsync(int productId);

        Task LogTransactionAsync(
            int productId,
            int userId,
            int quantityChanged,
            int remainingStock,
            string actionType
        );
    }
}
