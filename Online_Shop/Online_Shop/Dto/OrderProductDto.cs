using Online_Shop.Models;

namespace Online_Shop.Dto
{
    public class OrderProductDto
    {
        public int Id { get; set; }

        public int Amount { get; set; }

        public ProductDto Product { get; set; } = null!;

    }
}
