using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
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

        public async Task<IEnumerable<Product>> GetAllAsync(
            ProductFilterDto? filter = null
        )
        {
            var query = _context.Products
                .Where(p => !p.IsDeleted && p.StockQuantity > 0);

            if (filter != null)
            {
                if (!string.IsNullOrWhiteSpace(filter.Name))
                {
                    var name = filter.Name.Trim().ToLower();

                    query = query.Where(p =>
                        p.Name.ToLower().Contains(name)
                    );
                }

                if (!string.IsNullOrWhiteSpace(filter.Category))
                {
                    var category = filter.Category.Trim().ToLower();

                    query = query.Where(p =>
                        p.Category.ToLower().Contains(category)
                    );
                }

                if (filter.MinPrice.HasValue)
                {
                    query = query.Where(p =>
                        p.Price >= filter.MinPrice.Value
                    );
                }

                if (filter.MaxPrice.HasValue)
                {
                    query = query.Where(p =>
                        p.Price <= filter.MaxPrice.Value
                    );
                }

                if (filter.MinStock.HasValue)
                {
                    query = query.Where(p =>
                        p.StockQuantity >= filter.MinStock.Value
                    );
                }

                if (filter.MaxStock.HasValue)
                {
                    query = query.Where(p =>
                        p.StockQuantity <= filter.MaxStock.Value
                    );
                }

                query = filter.PriceSort switch
                {
                    "lowToHigh" => query.OrderBy(p => p.Price),
                    "highToLow" => query.OrderByDescending(p => p.Price),
                    _ => query.OrderBy(p => p.Id)
                };
            }
            else
            {
                query = query.OrderBy(p => p.Id);
            }

            return await query.ToListAsync();
        }

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

        public async Task AddRangeAsync(IEnumerable<Product> products)
        {
            await _context.Products.AddRangeAsync(products);
        }

        public async Task<Product?> GetByNameAndCategoryAsync(string name, string category)
        {
            return await _context.Products
                .FirstOrDefaultAsync(p =>
                    !p.IsDeleted &&
                    p.Name.ToLower() == name.ToLower() &&
                    p.Category.ToLower() == category.ToLower());
        }
    }
}
