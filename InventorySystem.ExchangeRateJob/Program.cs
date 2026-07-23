using InventorySystem.Core.Entities;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

Console.WriteLine("Starting Exchange Rate Job...");

var builder = Host.CreateDefaultBuilder(args)
    .ConfigureAppConfiguration((context, config) =>
    {
        config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
    })
    .ConfigureServices((context, services) =>
    {
        // Add DB Context
        var connectionString = context.Configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString));

        // Add Dependencies for Exchange Rate Service
        services.AddMemoryCache();
        services.AddHttpClient<IExchangeRateService, ExchangeRateService>();
        services.AddScoped<IExchangeRateService, ExchangeRateService>();
    });

using var host = builder.Build();

using (var scope = host.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    
    try
    {
        var dbContext = services.GetRequiredService<AppDbContext>();
        var exchangeRateService = services.GetRequiredService<IExchangeRateService>();
        
        Console.WriteLine("Fetching latest rates...");
        var rates = await exchangeRateService.GetLatestRatesAsync();
        
        var today = DateTime.UtcNow.Date;
        int addedCount = 0;

        foreach (var rate in rates)
        {
            var currencyCode = rate.Key;
            var rateValue = rate.Value;
            
            // Check if rate already exists for today
            var exists = await dbContext.ExchangeRates
                .AnyAsync(er => er.Date == today && er.CurrencyCode == currencyCode);
                
            if (!exists)
            {
                dbContext.ExchangeRates.Add(new ExchangeRate
                {
                    Date = today,
                    CurrencyCode = currencyCode,
                    Rate = rateValue
                });
                addedCount++;
            }
        }
        
        if (addedCount > 0)
        {
            await dbContext.SaveChangesAsync();
            Console.WriteLine($"Successfully added {addedCount} new exchange rates for {today.ToShortDateString()}.");
        }
        else
        {
            Console.WriteLine($"No new rates to add for {today.ToShortDateString()}. They already exist.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while running the job: {ex.Message}");
    }
}

Console.WriteLine("Job completed successfully.");
