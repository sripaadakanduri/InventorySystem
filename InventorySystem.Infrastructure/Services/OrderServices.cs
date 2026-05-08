using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;
using InventorySystem.Core.Interfaces;
using InventorySystem.Core.Enums;




using InventorySystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Infrastructure.Services
{
    public class OrderServices:IOrderService
    {
        private readonly AppDbContext _context;

        public OrderServices(AppDbContext context)
        {
            _context = context;
        }

        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto)
        {
           using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = new Order
                {
                    Status = OrderStatus.Pending
                };
                decimal totalAmount = 0;
                foreach(var item in dto.Items)
                {
                    var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                    if (product == null)
                    {
                        throw new Exception($"product {item.ProductId} not found");
                    }
                    if(product.StockQuantity < item.Quantity)
                    {
                        order.Status = OrderStatus.Failed;
                        throw new Exception($"insufficent stock for {product.Name}");
                    }
                    product.StockQuantity -= item.Quantity;

                    product.UpdatedAt = DateTime.Now;

                    decimal totalPrice = 0;
                    totalPrice += product.Price * item.Quantity;

                    totalAmount += totalPrice;

                    var orderItem = new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price,
                        TotalPrice = totalPrice
                    };

                    order.OrderItems.Add(orderItem);

                    var inventoryTransaction =
                        new InventoryTransaction
                        {
                            ProductId = product.Id,
                            QuantityChanged = -item.Quantity,
                            RemainingStock = product.StockQuantity,
                            ActionType = "OrderPlaced"
                        };

                    await _context.InventoryTransactions
                        .AddAsync(inventoryTransaction);
                }

                order.TotalAmount = totalAmount;

                order.Status = OrderStatus.Confirmed;

                await _context.Orders.AddAsync(order);

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return await GetOrderByIdAsync(order.Id)
                    ?? throw new Exception("Order creation failed");
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                throw new Exception("concurrency conflit  occured");
            }
            catch
            {
                await transaction.RollbackAsync();

                throw;
            }
        }
        public async Task<List<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return orders.Select(MapOrderToDto).ToList();
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return null;
            }

            return MapOrderToDto(order);
        }


        public static OrderDto MapOrderToDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                CreatedAt = order.CreatedAt,

                Items = order.OrderItems.Select(x =>
                
                    new OrderItemDto
                    {
                        ProductId = x.ProductId,
                        ProductName = x.Product?.Name ?? "",
                        Quantity = x.Quantity,
                        UnitPrice = x.UnitPrice,
                        TotalPrice = x.TotalPrice,
                    }

                ).ToList()
            };
        }

    }
}
