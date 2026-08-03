using Microsoft.EntityFrameworkCore;
using InventorySystem.Core.Entities;

namespace InventorySystem.Service.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();
        public DbSet<ExchangeRate> ExchangeRates => Set<ExchangeRate>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Product Configuration
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Name).IsRequired().HasMaxLength(150);
                entity.Property(p => p.Category).IsRequired().HasMaxLength(100);
                entity.Property(p => p.Price).HasColumnType("decimal(18,2)");
                entity.Property(p => p.Version).IsRowVersion();
                entity.Property(p => p.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(p => p.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Username).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.Role).HasMaxLength(50);
                entity.Property(u => u.NotificationSchedule).HasMaxLength(20).HasDefaultValue("N");
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.Username).IsUnique();
            });

            // Order Configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(o => o.Id);

                entity.Property(o => o.OrderNumber)
                      .HasMaxLength(20)
                      .IsRequired();

                entity.HasIndex(o => o.OrderNumber)
                      .IsUnique();

                entity.Property(o => o.TotalAmount)
                      .HasColumnType("decimal(18,2)");

                entity.Property(o => o.BaseTotalAmount)
                      .HasColumnType("decimal(18,2)");

                entity.Property(o => o.Currency)
                      .IsRequired()
                      .HasMaxLength(3)
                      .HasDefaultValue("USD");

                entity.Property(o => o.ExchangeRate)
                      .HasColumnType("decimal(18,6)")
                      .HasDefaultValue(1.0m);

                entity.Property(o => o.CreatedAt)
                      .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(o => o.UpdatedAt)
                      .HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(o => o.User)
                      .WithMany(u => u.Orders)
                      .HasForeignKey(o => o.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // OrderItem Configuration
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(oi => oi.Id);
                entity.Property(oi => oi.UnitPrice).HasColumnType("decimal(18,2)");
                entity.Property(oi => oi.BaseUnitPrice).HasColumnType("decimal(18,2)");
                entity.Property(oi => oi.TotalPrice).HasColumnType("decimal(18,2)");
                entity.Property(oi => oi.BaseTotalPrice).HasColumnType("decimal(18,2)");
                entity.HasOne(oi => oi.Order)
                      .WithMany(o => o.OrderItems)
                      .HasForeignKey(oi => oi.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(oi => oi.Product)
                      .WithMany()
                      .HasForeignKey(oi => oi.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // InventoryTransaction Configuration
            modelBuilder.Entity<InventoryTransaction>(entity =>
            {
                entity.HasKey(it => it.Id);
                entity.Property(it => it.ActionType).IsRequired().HasMaxLength(100);
                entity.Property(it => it.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                entity.HasOne(it => it.Product)
                      .WithMany()
                      .HasForeignKey(it => it.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(it => it.User)
                      .WithMany(u => u.InventoryTransactions)
                      .HasForeignKey(it => it.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ExchangeRate Configuration
            modelBuilder.Entity<ExchangeRate>(entity =>
            {
                entity.HasKey(er => new { er.Date, er.CurrencyCode });
                entity.Property(er => er.CurrencyCode).IsRequired().HasMaxLength(3);
                entity.Property(er => er.Rate).HasColumnType("decimal(18,6)");
            });

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
