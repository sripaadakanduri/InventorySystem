using Hangfire;
using InventorySystem.API.Extensions;
using InventorySystem.Core.Configurations;
using InventorySystem.Service.Auth;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Repositories;
using InventorySystem.Service.Services;
using InventorySystem.Service.Services.EmailServices;
using InventorySystem.Service.Services.Jobs;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("SmtpEmailSettings"));

builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<JwtServices>();
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAuthorization();

builder.Services.AddScoped<IOrderService, OrderServices>();
builder.Services.AddScoped<IInventoryTransactionService, InventoryTransactionService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IOtpService, OtpService>();
builder.Services.AddScoped<IEmailService, SmtpEmailService>();



builder.Services.AddHangfire(config =>
    config.UseSqlServerStorage(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfireServer();

builder.Services.AddScoped<IAdminLowStockNotificationService,
    DailyAdminEmailService>();
builder.Services.AddScoped<IUserLowStockNotificationService,
    DailyUsersEmailService>();
builder.Services.AddScoped<EmailJob>();




builder.Services.AddMemoryCache();
//builder.Services.AddHttpClient();
builder.Services.AddHttpClient<IExchangeRateService, ExchangeRateService>();
builder.Services.AddHttpClient<ICurrencySymbolService, CurrencySymbolService>();
var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>();


allowedOrigins = allowedOrigins?.Length > 0
    ? allowedOrigins
    : new[] { "http://localhost:5176" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins(allowedOrigins!)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();
builder.Services.AddApplicationServices();

var app = builder.Build();
// Every day at 6:00 PM
var indiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

using (var scope = app.Services.CreateScope())
{
    var recurringJobs = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

    recurringJobs.AddOrUpdate<EmailJob>(
        "daily-low-stock",
        x => x.AdminExecute(),
        "40 12 * * *",
        new RecurringJobOptions
        {
            TimeZone = indiaTimeZone
        });

    recurringJobs.AddOrUpdate<EmailJob>(
    "daily-user-email",
    x => x.UserDailyExecute(),
    "24 14 * * *",
    new RecurringJobOptions
    {
        TimeZone = indiaTimeZone
    });
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowReact");
app.UseHttpsRedirection();
app.UseHangfireDashboard();
app.MapHangfireDashboard();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
