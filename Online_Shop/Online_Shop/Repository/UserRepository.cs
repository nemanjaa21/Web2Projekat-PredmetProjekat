using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Online_Shop.Common;
using Online_Shop.Data;
using Online_Shop.Interfaces.RepositoryInterfaces;
using Online_Shop.Models;
using Microsoft.EntityFrameworkCore;


namespace Online_Shop.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext dc;

        public UserRepository(DataContext dataContext)
        {
            this.dc = dataContext;
        }
        public async Task<User> AcceptVerification(int id)
        {
            try
            {
                User? user = dc.Users.Find((int)id);

                user.Verification = EVerificationStatus.ACCEPTED;

                await dc.SaveChangesAsync();

                return user;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<User> DenyVerification(int id)
        {
            try
            {
                User? user = dc.Users.Find((int)id);

                user.Verification = EVerificationStatus.DENIED;

                await dc.SaveChangesAsync();
                return user;

            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<List<User>> GetAll()
        {
            try
            {
                List<User> users = await dc.Users.Include(u => u.Orders).ToListAsync();

                return users;
            }
            catch (Exception e)
            {

                return null;

            }
        }

        public async Task<List<User>> GetAllSalesmans()
        {
            try
            {

                List<User> salesmans = await dc.Users.Include(u => u.Products).Where(s => s.Type == EUserType.SALESMAN).ToListAsync();
                
                return salesmans;
            }
            catch (Exception e)
            {


                return null;

            }
        }

        public async Task<User> GetById(int id)
        {

            try
            {

                User user = await dc.Users.Include(o => o.Orders).Where(o => o.Id == id).FirstOrDefaultAsync();

                return user;

            }
            catch (Exception e)
            {

                return null;

            }
        }

        public async Task<User> Register(User user)
        {
            dc.Users.Add(user);

            try
            {

                await dc.SaveChangesAsync();

                return user;
            }
            catch (Exception e)
            {

                return null;

            }
        }

        public async Task<User> UpdateProfile(User newUser)
        {

            try
            {
                dc.Users.Update(newUser);

                await dc.SaveChangesAsync();

                return newUser;
            }
            catch (Exception e)
            {

                return null;

            }
        }
    }
}
