using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Online_Shop.Models;

namespace Online_Shop.Data.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id).ValueGeneratedOnAdd();
            builder.Property(p => p.Name).IsRequired().HasMaxLength(30);
            builder.Property(p => p.Price).IsRequired();

            builder.Property(p => p.Amount).IsRequired();

            builder.Property(p => p.Deleted).HasDefaultValue(false);    

            builder.HasOne(p => p.User)
                .WithMany(p => p.Products)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
