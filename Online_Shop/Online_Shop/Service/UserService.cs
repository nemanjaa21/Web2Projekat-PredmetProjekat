using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using Online_Shop.Common;
using Online_Shop.Dto;
using Online_Shop.Exceptions;
using Online_Shop.Interfaces.RepositoryInterfaces;
using Online_Shop.Interfaces.ServiceInterfaces;
using Online_Shop.Models;
using Online_Shop.Repository;
using System.Text;

namespace Online_Shop.Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepo;
        private readonly IMapper imapper;
        private readonly IConfiguration _configuration;
        private readonly IEmailService email;

        public UserService(IUserRepository userRepo, IEmailService emailService, IMapper mapper)
        {
            this.userRepo = userRepo;
            this.email = emailService;
            this.imapper = mapper;
            
        }
        public async Task<UserDto> AcceptVerification(int id)
        {
            User u = await userRepo.GetById(id);
            if (u == null)
                throw new NotFoundException($"User with ID: {id} doesn't exist.");
            if(u.Verification != EVerificationStatus.INPROGRESS)
                throw new BadRequestException($"Cant change verification anymore!");

            u = await userRepo.AcceptVerification(id);
            if(u != null)
            {

                await email.SendEmail(u.Email, u.Verification.ToString());

            }
            return imapper.Map<User, UserDto>(u);
        }

        public async Task<UserDto> DenyVerification(int id)
        {
            User u = await userRepo.GetById(id);
            if (u == null)
                throw new NotFoundException($"User with ID: {id} doesn't exist.");
            if (u.Verification != EVerificationStatus.INPROGRESS)
                throw new BadRequestException($"Cant change verification anymore!");

            u = await userRepo.DenyVerification(id);
            if (u != null)
            {
                email.SendEmail(u.Email, u.Verification.ToString());
            }
            return imapper.Map<User, UserDto>(u);
        }

        public async Task<List<UserDto>> GetAll()
        {
            List<User> users = await userRepo.GetAll();
            if (users == null)
                throw new NotFoundException($"There are no users!");
            return imapper.Map<List<User>, List<UserDto>>(users);
        }

        public async Task<List<UserVerificationDto>> GetAllSalesmans()
        {
            List<User> users = await userRepo.GetAllSalesmans();
            if (users == null)
                throw new NotFoundException($"There are no users!");
            return imapper.Map<List<User>, List<UserVerificationDto>>(users);
        }

        public async Task<UserDto> GetById(int id)
        {
            User u = await userRepo.GetById(id);
            if (u == null)
                throw new NotFoundException($"User with ID: {id} doesn't exist.");
            return imapper.Map<User, UserDto>(u);
        }
        public async Task<UserDto> Register(RegisterDto registerDto)
        {
            List<User> users = await userRepo.GetAll();

            if (String.IsNullOrEmpty(registerDto.FirstName) || String.IsNullOrEmpty(registerDto.LastName) || String.IsNullOrEmpty(registerDto.Username) ||
                String.IsNullOrEmpty(registerDto.Email) || String.IsNullOrEmpty(registerDto.Address) ||
                String.IsNullOrEmpty(registerDto.Password) || String.IsNullOrEmpty(registerDto.RepeatPassword) || String.IsNullOrEmpty(registerDto.Type.ToString()))
                throw new BadRequestException($"You must fill in all fields for registration!");

            if (users.Any(u => u.Username == registerDto.Username))
                throw new ConflictException("Username already in use. Try again!");

            if (users.Any(u => u.Email == registerDto.Email))
                throw new ConflictException("Email already in use. Try again!");

            if (registerDto.Password != registerDto.RepeatPassword)
                throw new BadRequestException("Passwords do not match. Try again!");

            User newUser = imapper.Map<RegisterDto, User>(registerDto);
            if(registerDto.ImageForm != null)
            {
                using (var memoryStream = new MemoryStream())
                {


                    registerDto.ImageForm.CopyTo(memoryStream);


                    var imageBytes = memoryStream.ToArray();


                    newUser.Image = imageBytes;

                }
            }
            newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
            newUser.Type = (EUserType)Enum.Parse(typeof(EUserType), registerDto.Type.ToUpper());

            if(newUser.Type == EUserType.SALESMAN)
                newUser.Verification = EVerificationStatus.INPROGRESS;
            else
                newUser.Verification = EVerificationStatus.ACCEPTED;



            UserDto dto = imapper.Map<User, UserDto>(await userRepo.Register(newUser));


            return dto;
        }

        public async Task<UserDto> UpdateProfile(int id, UpdateProfileDto profileDto)
        {
            List<User> users = await userRepo.GetAll();
            User user = await userRepo.GetById(id);
            if (user == null)
                throw new NotFoundException($"User with {id} doesn't exist!");

            if (String.IsNullOrEmpty(profileDto.FirstName) || String.IsNullOrEmpty(profileDto.LastName) || 
                String.IsNullOrEmpty(profileDto.Username) || String.IsNullOrEmpty(profileDto.Email) || 
                String.IsNullOrEmpty(profileDto.Address))
                throw new BadRequestException($"You must fill in all fields for update profile!");

            if(profileDto.Username != user.Username)
                if (users.Any(u => u.Username == profileDto.Username))
                    throw new ConflictException("Username already in use. Try again!");

            if (profileDto.Email != user.Email)
                if (users.Any(u => u.Email == profileDto.Email))
                    throw new ConflictException("Email already in use. Try again!");

            if (!String.IsNullOrEmpty(profileDto.PasswordUpdate))
            {
                if (String.IsNullOrEmpty(profileDto.OldPasswordUpdate))
                    throw new BadRequestException("You must enter old password!");

                if (!BCrypt.Net.BCrypt.Verify(profileDto.OldPasswordUpdate, user.Password.TrimEnd()))
                    throw new BadRequestException("Old password is incorrect!");

                user.Password = BCrypt.Net.BCrypt.HashPassword(profileDto.PasswordUpdate);

            }

            if (!String.IsNullOrEmpty(profileDto.OldPasswordUpdate))
            {
                if (String.IsNullOrEmpty(profileDto.PasswordUpdate))
                    throw new BadRequestException("You must enter new password!");
            }

            if (String.IsNullOrEmpty(profileDto.PasswordUpdate) && String.IsNullOrEmpty(profileDto.OldPasswordUpdate))
                profileDto.PasswordUpdate = user.Password;

            imapper.Map(profileDto, user);

            if(profileDto.ImageForm != null)
            {


                using (var memoryStream = new MemoryStream())
                {


                    profileDto.ImageForm.CopyTo(memoryStream);

                    var imageBytes = memoryStream.ToArray();

                    user.Image = imageBytes;


                }
            }
            user.BirthDate = user.BirthDate.Date;
            UserDto dto = imapper.Map<User, UserDto>(await userRepo.UpdateProfile(user));

            return dto;
        }
    }
}
