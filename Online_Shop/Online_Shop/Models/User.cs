using Online_Shop.Common;
using System.ComponentModel.DataAnnotations;

namespace Online_Shop.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, RegularExpression(@"^[a-zA-Z0-9_]$")]
        public string? Username { get; set; }

        [Required, EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Password { get; set; }

        [Required, MaxLength(30)]
        public string? FirstName { get; set; }

        [Required, MaxLength(30)]
        public string? LastName { get; set; }

        [Required, DataType(DataType.Date)]
        public DateTime BirthDate { get; set; }

        [Required, MaxLength(30)]
        public string? Address { get; set; }

        public byte[]? Image { get; set; }

        public EUserType Type { get; set; }

        public EVerificationStatus Verification { get; set; }

        public List<Order>? Orders { get; set; }

        public List<Product>? Products { get; set; }
    }
}
