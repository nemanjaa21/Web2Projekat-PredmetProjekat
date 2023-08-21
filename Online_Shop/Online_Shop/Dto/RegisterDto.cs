using Online_Shop.Common;

namespace Online_Shop.Dto
{
    public class RegisterDto
    {
        public string Username { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string RepeatPassword { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime BirthDate { get; set; }

        public string Address { get; set; }

        public IFormFile? ImageForm { get; set; }

        public string Type { get; set; }

    }
}
