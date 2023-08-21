namespace Online_Shop.Dto
{
    public class CreateOrderDto
    {
        public List<CreateOrderProductDto> OrderProducts { get; set; } = null!;

        public string Address { get; set; } = null!;

        public string? Comment { get; set; }


    }
}
