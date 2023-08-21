using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Online_Shop.Common;
using Online_Shop.Models;

namespace Online_Shop.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Id).ValueGeneratedOnAdd();

            builder.Property(c => c.Username).IsRequired();
            builder.HasIndex(u => u.Username).IsUnique();
            builder.Property(c => c.Email).IsRequired();

            builder.Property(c => c.Password).IsRequired();
            builder.Property(c => c.FirstName).IsRequired().HasMaxLength(30);

            builder.Property(c => c.LastName).IsRequired().HasMaxLength(30);
            builder.Property(c => c.BirthDate).IsRequired();

            builder.Property(c => c.Address).IsRequired().HasMaxLength(30);

            builder.Property(c => c.Type).HasConversion(new EnumToStringConverter<EUserType>());
            builder.Property(c => c.Verification).HasConversion(new EnumToStringConverter<EVerificationStatus>());
        }
    }
}
