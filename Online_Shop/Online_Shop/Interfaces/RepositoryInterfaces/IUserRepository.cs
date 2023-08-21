using Online_Shop.Models;

namespace Online_Shop.Interfaces.RepositoryInterfaces
{
    public interface IUserRepository
    {
        Task<User> GetById(int id);
        Task<List<User>> GetAll();
        Task<List<User>> GetAllSalesmans();
        Task<User> UpdateProfile(User newUser);
        Task<User> Register(User user);
        Task<User> AcceptVerification(int id);
        Task<User> DenyVerification(int id);
    }
}
