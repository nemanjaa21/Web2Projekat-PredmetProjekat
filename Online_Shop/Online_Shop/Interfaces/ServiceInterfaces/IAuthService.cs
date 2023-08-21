using Online_Shop.Dto;

namespace Online_Shop.Interfaces.ServiceInterfaces
{
    public interface IAuthService
    {
        Task<string> Login(LoginDto loginDto);
        Task<string> GoogleLogin(string token);
    }
}
