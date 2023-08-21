using Online_Shop.Models;

namespace Online_Shop.Dto
{
    public class UserDto
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime BirthDate { get; set; }

        public string Address { get; set; }

        public byte[] Image { get; set; }
    }
}
