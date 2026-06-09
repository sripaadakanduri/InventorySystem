using InventorySystem.Core.DTOs;
using InventorySystem.Core.Entities;
using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Services;
using Microsoft.EntityFrameworkCore.Storage;
using Moq;
using Xunit;

namespace InventorySystem.Tests.Services;

public class ProductServiceTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IInventoryTransactionService> _transactionMock;
    private readonly Mock<IProductRepository> _productRepoMock;
    private readonly Mock<IDbContextTransaction> _dbTransactionMock;

    private readonly ProductService _service;

    public ProductServiceTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _transactionMock = new Mock<IInventoryTransactionService>();
        _productRepoMock = new Mock<IProductRepository>();
        _dbTransactionMock = new Mock<IDbContextTransaction>();

        _unitOfWorkMock
            .Setup(x => x.Products)
            .Returns(_productRepoMock.Object);

        _unitOfWorkMock
            .Setup(x => x.BeginTransactionAsync())
            .ReturnsAsync(_dbTransactionMock.Object);

        _service = new ProductService(
            _unitOfWorkMock.Object,
            _transactionMock.Object);
    }

    [Fact]
    public async Task GetProductByIdAsync_Returns_Product()
    {
        var product = new Product
        {
            Id = 1,
            Name = "Laptop",
            Price = 1000,
            StockQuantity = 10,
            Category = "Electronics"
        };

        _productRepoMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync(product);

        var result = await _service.GetProductByIdAsync(1);

        Assert.NotNull(result);
        Assert.Equal("Laptop", result.Name);
    }

    [Fact]
    public async Task GetProductByIdAsync_Returns_Null_When_NotFound()
    {
        _productRepoMock
            .Setup(x => x.GetByIdAsync(1))
            .ReturnsAsync((Product?)null);

        var result = await _service.GetProductByIdAsync(1);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetAllProductsAsync_Returns_All_Products()
    {
        var products = new List<Product>
        {
            new()
            {
                Id = 1,
                Name = "Laptop",
                Price = 1000,
                StockQuantity = 10,
                Category = "Electronics"
            },
            new()
            {
                Id = 2,
                Name = "Mouse",
                Price = 50,
                StockQuantity = 20,
                Category = "Accessories"
            }
        };

        _productRepoMock
            .Setup(x => x.GetAllAsync(It.IsAny<ProductFilterDto>()))
            .ReturnsAsync(products);

        var result = await _service.GetAllProductsAsync();

        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task CreateProductAsync_Should_Create_Product()
    {
        var dto = new BaseDto
        {
            Name = "Laptop",
            Price = 1000,
            StockQuantity = 10,
            Category = "Electronics"
        };

        await _service.CreateProductAsync(dto, 1);

        _productRepoMock.Verify(
            x => x.AddAsync(It.IsAny<Product>()),
            Times.Once);

        _unitOfWorkMock.Verify(
            x => x.SaveChangesAsync(),
            Times.Once);

        _dbTransactionMock.Verify(
            x => x.CommitAsync(It.IsAny<CancellationToken>()),
            Times.Once);
    }
}