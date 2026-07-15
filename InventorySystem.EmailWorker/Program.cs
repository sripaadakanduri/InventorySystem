using InventorySystem.Core.Configurations;
using InventorySystem.EmailWorker.Interfaces;
using InventorySystem.EmailWorker.Jobs;
using InventorySystem.EmailWorker.Services;
using InventorySystem.EmailWorker.Services.Notifications;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var logFile = Path.Combine(AppContext.BaseDirectory, "worker.log");

try
{
    File.AppendAllText(logFile,
        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Worker started{Environment.NewLine}");

    var builder = Host.CreateApplicationBuilder(args);

    // Explicitly load configuration
    builder.Configuration
        .SetBasePath(AppContext.BaseDirectory)
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddEnvironmentVariables();

    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    File.AppendAllText(logFile,
        $"Connection String: {connectionString ?? "NULL"}{Environment.NewLine}");

    if (string.IsNullOrWhiteSpace(connectionString))
        throw new InvalidOperationException("DefaultConnection was not found in appsettings.json.");

    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(connectionString));

    builder.Services.Configure<EmailSettings>(
        builder.Configuration.GetSection("SmtpEmailSettings"));

    builder.Services.AddScoped<IEmailService, SmtpEmailService>();
    builder.Services.AddScoped<IAdminLowStockNotificationService, DailyAdminEmailService>();
    builder.Services.AddScoped<IUserLowStockNotificationService, DailyUsersEmailService>();
    builder.Services.AddScoped<EmailJob>();

    using var host = builder.Build();

    using var scope = host.Services.CreateScope();

    var job = scope.ServiceProvider.GetRequiredService<EmailJob>();

    File.AppendAllText(logFile,
        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Executing Admin Job{Environment.NewLine}");

    await job.AdminExecute();

    File.AppendAllText(logFile,
        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Admin Job Completed{Environment.NewLine}");

    File.AppendAllText(logFile,
        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Executing User Job{Environment.NewLine}");

    await job.UserDailyExecute();

    File.AppendAllText(logFile,
        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] User Job Completed{Environment.NewLine}");

    File.AppendAllText(logFile,
        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Worker Finished{Environment.NewLine}");
}
catch (Exception ex)
{
    File.AppendAllText(logFile,
        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] ERROR{Environment.NewLine}{ex}{Environment.NewLine}");

    throw;
}