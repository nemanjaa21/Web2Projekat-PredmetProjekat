namespace Online_Shop.Interfaces.ServiceInterfaces
{
    public interface IEmailService
    {
        Task SendEmail(string email, string verification);
    }
}
