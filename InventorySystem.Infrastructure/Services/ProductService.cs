using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;
using InventorySystem.Service.Interfaces;


namespace InventorySystem.Service.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repo;
        private readonly IInventoryTransactionService _transactionService;

        public ProductService(IProductRepository repo, IInventoryTransactionService transactionService)
        {
            _repo = repo;
            _transactionService = transactionService;
        }

        // Get all active products
        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _repo.GetAllAsync();
            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                Category = p.Category
            });
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product == null) return null;

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                Category = product.Category
            };
        }

        // Create new product
        public async Task<ProductDto> CreateProductAsync(BaseDto dto, int userId)
        {
            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                Category = dto.Category,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(product);
            await _repo.SaveChangesAsync();

            if (product.StockQuantity > 0)
            {
                await _transactionService.LogTransactionAsync(
                    product.Id,
                    userId,
                    product.StockQuantity,
                    product.StockQuantity,
                    "StockIn"
                );
            }
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                Category = product.Category
            };
        }

        // Update product
        public async Task<bool> UpdateProductAsync(int id, BaseDto dto, int userId)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product == null) return false;

            var oldStock = product.StockQuantity;

            product.Name = dto.Name;
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;
            product.Category = dto.Category;
            product.UpdatedAt = DateTime.UtcNow;

            _repo.Update(product);
            await _repo.SaveChangesAsync();

            if (oldStock != product.StockQuantity)
            {
                var change = product.StockQuantity - oldStock;
                var actionType = change > 0 ? "ManualAdd" : "ManualRemove";

                await _transactionService.LogTransactionAsync(
                    product.Id,
                    userId,
                    change,
                    product.StockQuantity,
                    actionType
                );
            }

            return true;
        }

        // Soft delete
        public async Task<bool> DeleteProductAsync(int id, int userId)
        {
            var product = await _repo.GetByIdAsync(id);

            if (product == null) return false;

            product.IsDeleted = true;
            product.UpdatedAt = DateTime.UtcNow;

            _repo.Update(product);
            await _repo.SaveChangesAsync();

            // Log delete transaction
            await _transactionService.LogTransactionAsync(
                product.Id,
                userId,
                -product.StockQuantity,
                0,
                "Product Deleted"
            );

            return true;
        }
    }
}