using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Online_Shop.Dto;
using Online_Shop.Interfaces.ServiceInterfaces;
using Online_Shop.Models;

namespace Online_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        //GET api/user/GetAllUsers
        [HttpGet("get-all-users")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public async Task<IActionResult> GetAllUsers()
        {
            List<UserDto> users = await _service.GetAll();
            if (users == null)
                return BadRequest();
            return Ok(users);
        }

        //GET api/user
        [Authorize]
        [HttpGet("get-my-profile")]
        public async Task<IActionResult> GetMyProfile()
        {
            int id = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
            UserDto user = await _service.GetById(id);
            if (user == null)
                return BadRequest();
            return Ok(user);
        }

        [HttpGet("get-all-salesmans")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public async Task<IActionResult> GetAllSalesmans()
        {
            List<UserVerificationDto> salesmans = await _service.GetAllSalesmans();
            if (salesmans == null)
                return BadRequest();
            return Ok(salesmans);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        [AllowAnonymous]
        public async Task<IActionResult> Post([FromForm]RegisterDto registerDto)
        {
            UserDto user = await _service.Register(registerDto);
            if (user == null)
                return BadRequest();
            return Ok(user);
        }

        [HttpPut]
        [Consumes("multipart/form-data")]
        [Authorize]
        public async Task<IActionResult> Put([FromForm] UpdateProfileDto profileDto)
        {
            int id = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
            UserDto user = await _service.UpdateProfile(id, profileDto);
            if (user == null)
                return BadRequest();
            return Ok(user);
        }

        [HttpPut("accept-verification/{id}")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public async Task<IActionResult> AcceptVerification(int id)
        {
            UserDto user = await _service.AcceptVerification(id);
            if (user == null)
                return BadRequest();
            return Ok(user);
        }

        [HttpPut("deny-verification/{id}")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public async Task<IActionResult> DenyVerification(int id)
        {
            UserDto user = await _service.DenyVerification(id);
            if (user == null)
                return BadRequest();
            return Ok(user);
        }
    }
}
