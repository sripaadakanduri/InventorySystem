using InventorySystem.Core.Interfaces;
using InventorySystem.Core.Entities;
using InventorySystem.Core.DTOs;
namespace InventorySystem.Infrastructure.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repo;
        private readonly IInventoryTransactionService _transactionService;
        TimeZoneInfo istZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

        public ProductService(IProductRepository repo, IInventoryTransactionService transactionService)
        {
            _repo = repo;
            _transactionService = transactionService;
        }
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
            if (product == null)
            {
                return null;
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

        public async Task<ProductDto> CreateProductAsync(BaseDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                Category = dto.Category
            };
            await _repo.AddAsync(product);
            await _repo.SaveChangesAsync();

            if (product.StockQuantity > 0)
            {
                await _transactionService.LogTransactionAsync(product.Id, product.StockQuantity, product.StockQuantity, "StockIn");
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

        public async Task<bool> UpdateProductAsync(int id, BaseDto dto)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product == null)
            {
                return false;
            }
            var oldStock = product.StockQuantity;
            product.Name = dto.Name;
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;
            product.Category = dto.Category;
            product.UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, istZone);

            _repo.Update(product);
            await _repo.SaveChangesAsync();

            if (oldStock != product.StockQuantity)
            {
                var change = product.StockQuantity - oldStock;
                var actionType = change > 0 ? "ManualAdd" : "ManualRemove";
                await _transactionService.LogTransactionAsync(product.Id, change, product.StockQuantity, actionType);
            }
            return true;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _repo.GetByIdAsync(id);

            if (product == null)
            {
                return false;
            }

            // Log transaction BEFORE deletion
            //await _transactionService.LogTransactionAsync(
            //    product.Id,
            //    -product.StockQuantity,
            //    0,
            //    "Delete"
            //);

            _repo.Delete(product);

            try
            {
                await _repo.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.InnerException?.Message);
                throw;
            }

            return true;
        }
    }
}
