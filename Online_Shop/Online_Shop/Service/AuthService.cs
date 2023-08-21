using AutoMapper;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Online_Shop.Common;
using Online_Shop.Dto;
using Online_Shop.Exceptions;
using Online_Shop.Interfaces.RepositoryInterfaces;
using Online_Shop.Interfaces.ServiceInterfaces;
using Online_Shop.Models;
using Online_Shop.Repository;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Online_Shop.Service
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IConfigurationSection _googleClientId;

        public AuthService(IUserRepository repository, IMapper mapper, IConfiguration configuration)
        {
            _repository = repository;
            _mapper = mapper;
            _configuration = configuration;
            _googleClientId = configuration.GetSection("GoogleClientId");
        }
        public async Task<string> Login(LoginDto loginDto)
        {
            var users = await _repository.GetAll();
            User? user = users.Where(u => u.Email == loginDto.Email).FirstOrDefault();
            if (user == null)
                throw new Exception($"User with {loginDto.Email} doesn't exist! Try again.");
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
                throw new Exception($"Password is incorrect! Try again.");

            var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("UserId", user.Id.ToString()),
                        new Claim("Email", user.Email!),
                        new Claim(ClaimTypes.Role, user.Type.ToString()),
                        new Claim("Verification", user.Verification.ToString())

                    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "default"));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: signIn);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<string> GoogleLogin(string token)
        {
            GoogleUserDto externalUser = await VerifyGoogleToken(token);
            if (externalUser == null) { throw new ConflictException("Invalid user google token."); }

            List<User> users = await _repository.GetAll();
            User user = users.Find(u => u.Email.Equals(externalUser.Email));

            if (user == null)
            {
                user = new User()
                {
                    FirstName = externalUser.FirstName,
                    LastName = externalUser.LastName,
                    Username = externalUser.Username,
                    Email = externalUser.Email,
                    Image = new byte[0],
                    Password = "",
                    Address = "",
                    BirthDate = DateTime.Now,
                    Type = EUserType.CUSTOMER,
                    Verification = EVerificationStatus.ACCEPTED
                };

                await _repository.Register(user);
            }

            var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                        new Claim("UserId", user.Id.ToString()),
                        new Claim("Email", user.Email!),
                        new Claim(ClaimTypes.Role, user.Type.ToString()),
                        new Claim("Verification", user.Verification.ToString())

                    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "default"));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var tokenString = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: signIn);
            return new JwtSecurityTokenHandler().WriteToken(tokenString);

        }

        private async Task<GoogleUserDto> VerifyGoogleToken(string externalLoginToken)
        {
            try
            {
                var validationSettings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _googleClientId.Value }
                };

                var googleUserInfo = await GoogleJsonWebSignature.ValidateAsync(externalLoginToken, validationSettings);

                GoogleUserDto externalUser = new GoogleUserDto()
                {
                    Username = googleUserInfo.Email.Split("@")[0],
                    FirstName = googleUserInfo.GivenName,
                    LastName = googleUserInfo.FamilyName,
                    Email = googleUserInfo.Email
                };

                return externalUser;
            }
            catch
            {
                return null;
            }
        }
    }
}
