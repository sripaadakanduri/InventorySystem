using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;
using InventorySystem.Common.Enums;
using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Data;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Service.Services
{
    public class OrderServices : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly IUnitOfWork _unitOfWork;

        public OrderServices(AppDbContext context, IUnitOfWork unitOfWork)
        {
            _context = context;
            _unitOfWork = unitOfWork;
        }

   
        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto, int userId)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync();

            try
            {
                var order = new Order
                {
                    UserId = userId,
                    Status = OrderStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                };

                decimal totalAmount = 0;

                foreach (var item in dto.Items)
                {
                    var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                    if (product == null)
                        throw new Exception($"Product {item.ProductId} not found");

                    if (product.StockQuantity < item.Quantity)
                        throw new Exception($"Insufficient stock for {product.Name}");

                    // Reduce stock
                    product.StockQuantity -= item.Quantity;
                    product.UpdatedAt = DateTime.UtcNow;

                    decimal totalPrice = product.Price * item.Quantity;
                    totalAmount += totalPrice;

                    var orderItem = new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price,
                        TotalPrice = totalPrice
                    };

                    order.OrderItems.Add(orderItem);

                    var productExists = await _context.Products.AnyAsync(p => p.Id == product.Id);
                    var userExists = await _context.Users.AnyAsync(u => u.Id == userId);

                    if (productExists && userExists)
                    {
                        await _context.InventoryTransactions.AddAsync(new InventoryTransaction
                        {
                            ProductId = product.Id,
                            UserId = userId,
                            QuantityChanged = -item.Quantity,
                            RemainingStock = product.StockQuantity,
                            ActionType = "OrderPlaced",
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }

                order.TotalAmount = totalAmount;
                order.Status = OrderStatus.Confirmed;

                await _context.Orders.AddAsync(order);
                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                return await GetOrderByIdAsync(order.Id) ?? throw new Exception("Order creation failed");
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
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return orders.Select(MapOrderToDto).ToList();
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return null;

            return MapOrderToDto(order);
        }

        public async Task<List<OrderDto>> GetOrdersByUserAsync(
            int userId,
            bool isAdmin,
            OrderFilterDto? filter = null
        )
        {
            IQueryable<Order> query = _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product);

            if (!isAdmin)
            {
                query = query.Where(o => o.UserId == userId);
            }

            if (filter != null)
            {
                if (!string.IsNullOrWhiteSpace(filter.User))
                {
                    var username = filter.User.Trim().ToLower();

                    query = query.Where(o =>
                        o.User != null &&
                        o.User.Username.ToLower().Contains(username)
                    );
                }

                if (filter.Status.HasValue)
                {
                    query = query.Where(o =>
                        (int)o.Status == filter.Status.Value
                    );
                }

                if (filter.StartDate.HasValue)
                {
                    var startDate = filter.StartDate.Value.Date;

                    query = query.Where(o =>
                        o.CreatedAt >= startDate
                    );
                }

                if (filter.EndDate.HasValue)
                {
                    var endDate = filter.EndDate.Value.Date.AddDays(1);

                    query = query.Where(o =>
                        o.CreatedAt < endDate
                    );
                }
            }

            var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();

            return orders.Select(MapOrderToDto).ToList();
        }


        public async Task<bool> CancelOrderAsync(int orderId, int userId)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync();

            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null) return false;
                if (order.Status == OrderStatus.Cancelled)
                    throw new Exception("Order already cancelled");

                foreach (var item in order.OrderItems)
                {
                    if (item.Product == null) continue;

                    item.Product.StockQuantity += item.Quantity;
                    item.Product.UpdatedAt = DateTime.UtcNow;

                    // Safe InventoryTransaction
                    var productExists = await _context.Products.AnyAsync(p => p.Id == item.ProductId);
                    var userExists = await _context.Users.AnyAsync(u => u.Id == userId);

                    if (productExists && userExists)
                    {
                        await _context.InventoryTransactions.AddAsync(new InventoryTransaction
                        {
                            ProductId = item.ProductId,
                            UserId = userId,
                            QuantityChanged = item.Quantity,
                            RemainingStock = item.Product.StockQuantity,
                            ActionType = "OrderCancelled",
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }

                order.Status = OrderStatus.Cancelled;
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

 
        public async Task<OrderDto> UpdateOrderAsync(int orderId, CreateOrderDto dto)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync();

            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .Include(o => o.User)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null) throw new Exception("Order not found");

                foreach (var oldItem in order.OrderItems)
                {
                    if (oldItem.Product != null)
                    {
                        oldItem.Product.StockQuantity += oldItem.Quantity;

                        var productExists = await _context.Products.AnyAsync(p => p.Id == oldItem.ProductId);
                        var userExists = await _context.Users.AnyAsync(u => u.Id == order.UserId);

                        if (productExists && userExists)
                        {
                            _context.InventoryTransactions.Add(new InventoryTransaction
                            {
                                ProductId = oldItem.ProductId,
                                QuantityChanged = oldItem.Quantity,
                                RemainingStock = oldItem.Product.StockQuantity,
                                ActionType = "OrderUpdatedRevert",
                                CreatedAt = DateTime.UtcNow,
                                UserId = order.UserId
                            });
                        }
                    }
                }

                _context.OrderItems.RemoveRange(order.OrderItems);

                decimal totalAmount = 0;
                var newOrderItems = new List<OrderItem>();

                foreach (var item in dto.Items)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null) throw new Exception($"Product {item.ProductId} not found");
                    if (product.StockQuantity < item.Quantity) throw new Exception($"Insufficient stock for {product.Name}");

                    product.StockQuantity -= item.Quantity;

                    totalAmount += product.Price * item.Quantity;

                    newOrderItems.Add(new OrderItem
                    {
                        OrderId = orderId,
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price,
                        TotalPrice = product.Price * item.Quantity
                    });

                    var productExists = await _context.Products.AnyAsync(p => p.Id == product.Id);
                    var userExists = await _context.Users.AnyAsync(u => u.Id == order.UserId);

                    if (productExists && userExists)
                    {
                        _context.InventoryTransactions.Add(new InventoryTransaction
                        {
                            ProductId = product.Id,
                            QuantityChanged = -item.Quantity,
                            RemainingStock = product.StockQuantity,
                            ActionType = "OrderUpdated",
                            CreatedAt = DateTime.UtcNow,
                            UserId = order.UserId
                        });
                    }
                }

                await _context.OrderItems.AddRangeAsync(newOrderItems);

                order.TotalAmount = totalAmount;
                order.Status = OrderStatus.Updated;
                order.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                return MapOrderToDto(order);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private static OrderDto MapOrderToDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                Username = order.User?.Username ?? "",
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                TotalQuantity = order.OrderItems.Sum(x => x.Quantity),
                CreatedAt = order.CreatedAt,
                Items = order.OrderItems.Select(x => new OrderItemDto
                {
                    ProductId = x.ProductId,
                    ProductName = x.Product?.Name ?? "",
                    Quantity = x.Quantity,
                    UnitPrice = x.UnitPrice,
                    TotalPrice = x.TotalPrice
                }).ToList()
            };
        }
    }
}
