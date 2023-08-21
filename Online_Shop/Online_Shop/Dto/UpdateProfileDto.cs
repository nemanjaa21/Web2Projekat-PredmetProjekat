namespace Online_Shop.Dto
{
    public class UpdateProfileDto
    {
        public string? Username { get; set; }

        public string? Email { get; set; }

        public string? PasswordUpdate { get; set; }

        public string? OldPasswordUpdate { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public DateTime BirthDate { get; set; }

        public string? Address { get; set; }

        public IFormFile? ImageForm { get; set; }
    }
}
