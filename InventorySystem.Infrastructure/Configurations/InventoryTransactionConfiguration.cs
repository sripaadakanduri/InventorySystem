using InventorySystem.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InventorySystem.Infrastructure.Configurations
{
    public class InventoryTransactionConfiguration
        : IEntityTypeConfiguration<InventoryTransaction>
    {
        public void Configure(
            EntityTypeBuilder<InventoryTransaction> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId);
        }
    }
}