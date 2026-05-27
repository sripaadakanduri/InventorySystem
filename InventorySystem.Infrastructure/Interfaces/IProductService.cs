using InventorySystem.Core.DTOs;

namespace InventorySystem.Service.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();

        Task<ProductDto?> GetProductByIdAsync(int id);

        Task<ProductDto> CreateProductAsync(
            BaseDto dto,
            int userId
        );

        Task<bool> UpdateProductAsync(
            int id,
            BaseDto dto,
            int userId
        );

        Task<bool> DeleteProductAsync(
            int id,
            int userId
        );
    }
}
