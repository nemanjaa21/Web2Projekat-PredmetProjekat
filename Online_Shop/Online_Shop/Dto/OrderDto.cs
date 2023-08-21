using Online_Shop.Common;
using Online_Shop.Models;
using System.ComponentModel.DataAnnotations;

namespace Online_Shop.Dto
{
    public class OrderDto
    {
        public int Id { get; set; }

        public string? Comment { get; set; }

        public string? Address { get; set; }

        public double Price { get; set; }

        public DateTime OrderTime { get; set; }

        public DateTime DeliveryTime { get; set; }

        public string Status { get; set; }

        public List<OrderProductDto>? OrderProducts { get; set; }

        public int UserId { get; set; }

        public int DeliveryPrice { get; set; }


    }
}
