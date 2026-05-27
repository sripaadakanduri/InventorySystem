using InventorySystem.Service.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace InventorySystem.Service.Interfaces
{
    public interface IUnitOfWork
    {
        IProductRepository Products { get; }

        Task<int> SaveChangesAsync();

        Task<IDbContextTransaction> BeginTransactionAsync();
    }
}
