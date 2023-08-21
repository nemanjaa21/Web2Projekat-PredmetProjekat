using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Online_Shop.Models;

namespace Online_Shop.Data.Configurations
{
    public class OrderProductConfiguration : IEntityTypeConfiguration<OrderProduct>
    {
        public void Configure(EntityTypeBuilder<OrderProduct> builder)
        {
            builder.HasKey(op => new { op.OrderId, op.ProductId });

            builder.HasOne(op => op.Product)
                .WithMany(op => op.OrderProducts)
                .HasForeignKey(op => op.ProductId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(op => op.Order)
                .WithMany(op => op.OrderProducts)
                .HasForeignKey(op => op.OrderId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
