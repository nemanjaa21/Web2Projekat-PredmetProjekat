using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Online_Shop.Common;
using Online_Shop.Models;

namespace Online_Shop.Data.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(o => o.Id);
            builder.Property(o => o.Id).ValueGeneratedOnAdd();

            builder.Property(o => o.Address).IsRequired().HasMaxLength(30);


            builder.Property(o => o.Status).HasConversion(new EnumToStringConverter<EOrderStatus>());

            builder.HasOne(o => o.User)
                .WithMany(o => o.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
