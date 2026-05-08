using InventorySystem.Core.DTOs;

namespace InventorySystem.Core.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(CreateOrderDto dto);

        Task<List<OrderDto>> GetAllOrdersAsync();

        Task<OrderDto?> GetOrderByIdAsync(int id);
    }
}