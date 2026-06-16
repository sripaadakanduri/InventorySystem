using System.Security.Claims;
using InventorySystem.Core.DTOs;
using InventorySystem.Common.Enums;
using InventorySystem.Service.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace InventorySystem.API.Controllers
    {
        [ApiController]
        [Route("api/[controller]")]
        [Authorize]
        public class ProductsController : ControllerBase
        {
            private readonly IProductService _service;

            public ProductsController(IProductService service)
            {
                _service = service;
            }


            [HttpGet]
            public async Task<IActionResult> GetAll(
                [FromQuery] ProductFilterDto filter
            )
            {
                var products =
                    await _service.GetAllProductsAsync(filter);

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
            var userId = int.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!
                    .Value
            );

            var deleted =
                await _service.DeleteProductAsync
                (
                    id,
                    userId
                );

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
        [HttpPost("import")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportProducts([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is required.");

            var failedProductsCsv = await _service.ImportProductsAsync(file);

            if (failedProductsCsv.Length > 0)
            {
                return File(
                    failedProductsCsv,
                    "text/csv",
                    "Response.csv");
            }

            return Ok(new
            {
                message = "Products imported successfully."
            });
        }

    }
}
