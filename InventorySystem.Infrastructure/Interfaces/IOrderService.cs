
using InventorySystem.Core.DTOs;

namespace InventorySystem.Service.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(
            CreateOrderDto dto,
            int userId
        );

        Task<List<OrderDto>> GetAllOrdersAsync();

        Task<OrderDto?> GetOrderByIdAsync(int id);

        Task<bool> CancelOrderAsync(
            int orderId,
            int userId
        );
        Task<OrderDto> UpdateOrderAsync(int orderId, CreateOrderDto dto);

        Task<List<OrderDto>> GetOrdersByUserAsync(
            int userId,
            bool isAdmin,
            OrderFilterDto? filter = null
        );
    }
}
