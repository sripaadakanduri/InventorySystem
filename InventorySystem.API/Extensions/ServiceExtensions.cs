using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Repositories;
using InventorySystem.Service.Services;

namespace InventorySystem.API.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services)
        {
            services.AddScoped<IProductRepository, ProductRepository>();

            services.AddScoped<IProductService, ProductService>();

            return services;
        }
    }
}