using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;
using InventorySystem.Service.Interfaces;
using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Runtime.Intrinsics.Arm;


namespace InventorySystem.Service.Services
{
    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IInventoryTransactionService _transactionService;

        public ProductService(IUnitOfWork unitOfWork, IInventoryTransactionService transactionService)
        {
            _unitOfWork = unitOfWork;
            _transactionService = transactionService;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync(
            ProductFilterDto? filter = null
        )
        {
            var products = await _unitOfWork.Products.GetAllAsync(filter);

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
            var product = await _unitOfWork.Products.GetByIdAsync(id);
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

        public async Task<ProductDto> CreateProductAsync(BaseDto dto, int userId)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync();

            try
            {
                var existingProduct = await _unitOfWork.Products
                    .GetByNameAndCategoryAsync(dto.Name, dto.Category);

                if (existingProduct != null)
                {
                    throw new DuplicateProductException(
                        existingProduct.Name,
                        existingProduct.Category);
                }

                var product = new Product
                {
                    Name = dto.Name,
                    Price = dto.Price,
                    StockQuantity = dto.StockQuantity,
                    Category = dto.Category,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _unitOfWork.Products.AddAsync(product);
                await _unitOfWork.SaveChangesAsync();

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

                await transaction.CommitAsync();

                return new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    StockQuantity = product.StockQuantity,
                    Category = product.Category
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdateProductAsync(int id, BaseDto dto, int userId)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync();

            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(id);
                if (product == null) return false;

                var oldStock = product.StockQuantity;

                product.Name = dto.Name;
                product.Price = dto.Price;
                product.StockQuantity = dto.StockQuantity;
                product.Category = dto.Category;
                product.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.Products.Update(product);
                await _unitOfWork.SaveChangesAsync();

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

                await transaction.CommitAsync();

                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteProductAsync(int id, int userId)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync();

            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(id);
                if (product == null) return false;

                product.IsDeleted = true;
                product.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.Products.Update(product);

                await _transactionService.LogTransactionAsync(
                    product.Id,
                    userId,
                    -product.StockQuantity,
                    0,
                    "ProductDeleted"
                );

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<byte[]> ImportProductsAsync(IFormFile file, int userId)
        {
            var validProducts = new List<Product>();
            var failedProducts = new List<FailedDto>();
            var importProductKeys = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            using var reader = new StreamReader(file.OpenReadStream());

            var dbProducts = await _unitOfWork.Products.GetAllAsync();
            var existingCategories = new HashSet<string>(
                dbProducts.Select(p => p.Category?.Trim() ?? string.Empty))
                .Where(c => !string.IsNullOrEmpty(c));

            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HeaderValidated = null,
                MissingFieldFound = null
            };

            using var csv = new CsvReader(reader, config);
            var records = csv.GetRecords<BaseDto>().ToList();
            foreach(var record in records)
            {
                var errors = new List<string>();
                var name = record.Name?.Trim() ?? string.Empty;
                var category = record.Category?.Trim() ?? string.Empty;

                if (string.IsNullOrWhiteSpace(name))
                    errors.Add("Name is required");
                if (record.Price <= 0)
                    errors.Add("Price must be greater than 0");
                if (record.StockQuantity <= 0)
                    errors.Add("quantity must be greater than 0");
                if (string.IsNullOrWhiteSpace(category))
                    errors.Add("Category is required");
                if (!existingCategories.Contains(category))
                {
                    errors.Add("category not foound");
                }

                var existingProduct =
                    await _unitOfWork.Products.GetByNameAndCategoryAsync(
                        name,
                        category
                    );

                if (existingProduct != null)
                    errors.Add("Product already exists");

                var importKey = $"{name}|{category}";

                if (!string.IsNullOrWhiteSpace(name) &&
                    !string.IsNullOrWhiteSpace(category) &&
                    !importProductKeys.Add(importKey))
                {
                    errors.Add("Duplicate product in import file");
                }

                if (errors.Any())
                {
                    failedProducts.Add(new FailedDto
                    {
                        Name = name,
                        Price = record.Price,
                        StockQuantity = record.StockQuantity,
                        Category = category,
                        ErrorMessage = string.Join(",", errors)

                    });
                }
                else
                {
                    validProducts.Add(new Product
                    {
                        Name = name,
                        Price = record.Price,
                        StockQuantity = record.StockQuantity,
                        Category = category
                    });
                }
            }
            if (validProducts.Any())
            {
                await _unitOfWork.Products.AddRangeAsync(validProducts);
                await _unitOfWork.SaveChangesAsync();

                foreach (var product in validProducts)
                {
                    await _transactionService.LogTransactionAsync(
                        product.Id,
                        userId,
                        product.StockQuantity,
                        product.StockQuantity,
                        "Product Imported"
                    );
                }
            }

            if (!failedProducts.Any())
            {
                return Array.Empty<byte>();
            }

            return GenerateFailedCsv(failedProducts);
        }

        public byte[] GenerateFailedCsv(List<FailedDto> failedProducts)
        {
            using var memoryStream = new MemoryStream();

            using var writer = new StreamWriter(memoryStream);

            using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);

            csv.WriteRecords(failedProducts);
            writer.Flush();
            return memoryStream.ToArray();
        }
    }

}
