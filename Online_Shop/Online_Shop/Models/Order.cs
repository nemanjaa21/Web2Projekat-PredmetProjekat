using Online_Shop.Common;
using System.ComponentModel.DataAnnotations;

namespace Online_Shop.Models
{
    public class Order
    {
        public int Id { get; set; }

        public string? Comment { get; set; }

        [Required, MaxLength(30)]
        public string? Address { get; set; }

        public double Price { get; set; }

        public DateTime OrderTime { get; set; }

        public DateTime DeliveryTime { get; set; }

        public EOrderStatus Status { get; set; }

        public List<OrderProduct>? OrderProducts { get; set; }

        public User? User { get; set; }

        public int UserId { get; set; }

        public int DeliveryPrice { get; set; }

    }
}
