using InventorySystem.Core.Entities;
using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Data;
using Microsoft.EntityFrameworkCore;
 namespace InventorySystem.Service.Repositories
{ 

    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        // Get all active products
        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products
                .Where(p => !p.IsDeleted && p.StockQuantity > 0)
                .OrderBy(p => p.Id)
                .ToListAsync();
        }

        // Get by ID
        public async Task<Product> GetByIdAsync(int id)
        {
            return await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);
        }

        public async Task AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);
        }

        public void Update(Product product)
        {
            _context.Products.Update(product);
        }

        public void Delete(Product product)
        {
            _context.Products.Remove(product); 
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}