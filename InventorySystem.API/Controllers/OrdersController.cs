using InventorySystem.Core.DTOs;
using InventorySystem.Core.Enums;
using InventorySystem.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InventorySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController
        (
            IOrderService orderService
        )
        {
            _orderService = orderService;
        }


        [HttpPost]
        public async Task<IActionResult> CreateOrder
        (
            [FromBody] CreateOrderDto dto
        )
        {
            try
            {
                var userId = int.Parse(
                    User.FindFirst(
                        ClaimTypes.NameIdentifier
                    )!.Value
                );

                var result =
                    await _orderService
                        .CreateOrderAsync
                        (
                            dto,
                            userId
                        );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }



        //[HttpGet("all")]
        //public async Task<IActionResult> GetAllOrders()
        //{
        //    var result =
        //        await _orderService
        //            .GetAllOrdersAsync();

        //    return Ok(result);
        //}



        [HttpGet("{id}")]
        public async Task<IActionResult>
            GetOrderById(int id)
        {
            var result =
                await _orderService
                    .GetOrderByIdAsync(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            try
            {
                var userId = int.Parse(
                    User.FindFirst(
                        ClaimTypes.NameIdentifier
                    )!.Value
                );

                var cancelled =
                    await _orderService.CancelOrderAsync(
                        id,
                        userId
                    );

                if (!cancelled)
                {
                    return NotFound(new
                    {
                        message = "Order not found"
                    });
                }

                return Ok(new
                {
                    message = "Order cancelled successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] CreateOrderDto dto)
        {
            try
            {
                var updatedOrder = await _orderService.UpdateOrderAsync(id, dto);
                return Ok(updatedOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetOrders()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var role = User.FindFirst(ClaimTypes.Role)!.Value;

            bool isAdmin = role == UserRoles.Admin;

            var orders = await _orderService.GetOrdersByUserAsync(userId, isAdmin);

            return Ok(orders);
        }
    }
}