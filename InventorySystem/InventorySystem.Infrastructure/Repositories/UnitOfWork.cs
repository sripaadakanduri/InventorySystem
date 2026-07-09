using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;

namespace InventorySystem.Service.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public UnitOfWork(AppDbContext context, IProductRepository products)
        {
            _context = context;
            Products = products;
        }

        public IProductRepository Products { get; }

        public Task<int> SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }

        public Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return _context.Database.BeginTransactionAsync();
        }
    }
}
