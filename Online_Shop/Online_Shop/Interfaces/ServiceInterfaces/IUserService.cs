using Online_Shop.Dto;
using Online_Shop.Models;

namespace Online_Shop.Interfaces.ServiceInterfaces
{
    public interface IUserService
    {
        Task<UserDto> GetById(int id);
        Task<List<UserDto>> GetAll();
        Task<List<UserVerificationDto>> GetAllSalesmans();
        Task<UserDto> UpdateProfile(int id, UpdateProfileDto profileDto);
        Task<UserDto> Register(RegisterDto registerDto);
        Task<UserDto> AcceptVerification(int id);
        Task<UserDto> DenyVerification(int id);
    }
}
