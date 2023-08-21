namespace Online_Shop.Dto
{
    public class UpdateProductDto
    {
        public string Name { get; set; }

        public int Price { get; set; }

        public int Amount { get; set; }

        public string Description { get; set; }

        public IFormFile ImageForm { get; set; }

    }
}
