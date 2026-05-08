using Microsoft.EntityFrameworkCore;
using InventorySystem.Core.Entities;

namespace InventorySystem.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders => Set<Order>();

        public DbSet<OrderItem> OrderItems => Set<OrderItem>();

        public DbSet<InventoryTransaction> InventoryTransactions
            => Set<InventoryTransaction>(); 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(p => p.Price).HasColumnType("decimal(18,2)");

                entity.Property(p => p.Name).IsRequired();

                entity.Property(p => p.Category).IsRequired();

                modelBuilder.Entity<Product>()
                    .Property(p => p.Version)
                    .IsRowVersion();

                modelBuilder.ApplyConfigurationsFromAssembly(
                    typeof(AppDbContext).Assembly);

                });
        }
    }
}
