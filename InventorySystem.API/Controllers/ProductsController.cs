using System.Security.Claims;

using InventorySystem.Core.DTOs;
using InventorySystem.Core.Interfaces;
using InventorySystem.Core.Enums;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventorySystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductsController(IProductService service)
        {
            _service = service;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products =
                await _service.GetAllProductsAsync();

            return Ok(products);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product =
                await _service.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Product not found"
                });
            }

            return Ok(product);
        }


        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> Create(BaseDto dto)
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!
                    .Value
            );

            var product =
                await _service.CreateProductAsync
                (
                    dto,
                    userId
                );

            return CreatedAtAction(
                nameof(GetById),
                new { id = product.Id },
                product
            );
        }


        [HttpPut("{id}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> Update
        (
            int id,
            BaseDto dto
        )
        {
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!
                    .Value
            );

            var updated =
                await _service.UpdateProductAsync
                (
                    id,
                    dto,
                    userId
                );

            if (!updated)
            {
                return NotFound(new
                {
                    message =
                        "Product not found to update"
                });
            }

            return Ok(new
            {
                message =
                    "Product successfully updated"
            });
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted =
                await _service.DeleteProductAsync(id);

            if (!deleted)
            {
                return NotFound(new
                {
                    message = "Product not found"
                });
            }

            return Ok(new
            {
                message =
                    "Product deleted successfully"
            });
        }
    }
}