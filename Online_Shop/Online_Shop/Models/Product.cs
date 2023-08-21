using System.ComponentModel.DataAnnotations;

namespace Online_Shop.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required, MaxLength(30)]
        public string? Name { get; set; }

        [Required]
        public int Price { get; set; }

        [Required]
        public int Amount { get; set; }

        public string? Description { get; set; }

        public byte[]? Image { get; set; }

        public List<OrderProduct>? OrderProducts { get; set; }

        public bool Deleted { get; set; }

        public User? User { get; set; }

        public int UserId { get; set; }

    }
}
