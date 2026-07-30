using InventorySystem.API.Extensions;
using InventorySystem.Core.Configurations;
using InventorySystem.Service.Auth;
using InventorySystem.Service.Data;
using InventorySystem.Service.Interfaces;
using InventorySystem.Service.Repositories;
using InventorySystem.Service.Services;
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
builder.Services.AddScoped<IReportService, ReportService>();





builder.Services.AddMemoryCache();
//builder.Services.AddHttpClient();
builder.Services.AddHttpClient<IExchangeRateService, ExchangeRateService>();
builder.Services.AddHttpClient<ICurrencySymbolService, CurrencySymbolService>();
var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

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

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddOpenApi();
builder.Services.AddApplicationServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowReact");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
