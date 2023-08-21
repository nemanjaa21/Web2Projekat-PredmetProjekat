using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Online_Shop.Dto;
using Online_Shop.Interfaces.ServiceInterfaces;
using Online_Shop.Service;

namespace Online_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        //POST api/auth
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Post([FromBody] LoginDto loginDto)
        {
            string token = await _service.Login(loginDto);
            if (token == null)
                return BadRequest();
            return Ok(token);
        }

        [HttpPost("google-login")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleLogin([FromForm] string googleToken)
        {
            string token = await _service.GoogleLogin(googleToken);
            return Ok(token);
        }
    }
}
