using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Online_Shop.Dto;
using Online_Shop.Interfaces.ServiceInterfaces;
using System.Data;
using System.IdentityModel.Tokens.Jwt;

namespace Online_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductController(IProductService service)
        {
            _service = service;
        }

        //GET api/product
        [HttpGet("get-my-products")]
        [Authorize(Roles = "SALESMAN", Policy = "VerifiedUserOnly")]
        public async Task<IActionResult> GetMyProducts()
        {
            int id = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
            List<ProductDto> products = await _service.GetMyProducts(id);
            if (products == null)
                return BadRequest();
            return Ok(products);
        }

        //GET api/product
        [HttpGet("get-all-products")]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> GetAllProducts()
        {
            List<ProductDto> products = await _service.GetAll();
            if (products == null)
                return BadRequest();
            return Ok(products);
        }

        //GET api/product/id
        [HttpGet("{id}")]
        [Authorize(Roles = "SALESMAN")]
        public async Task<IActionResult> Get(int id)
        {
            ProductDto productDto = await _service.GetProductById(id);
            if (productDto == null)
                return BadRequest();
            return Ok(productDto);
        }

        //POST api/product
        [HttpPost]
        [Authorize(Roles = "SALESMAN", Policy = "VerifiedUserOnly")]
        public async Task<IActionResult> Post([FromForm] CreateProductDto productDto)
        {
            int id = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
            ProductDto product = await _service.CreateProduct(id, productDto);
            if (product == null)
                return BadRequest();
            return Ok(product);
        }

        //PUT api/product
        [HttpPut("{id}")]
        [Authorize(Roles = "SALESMAN", Policy = "VerifiedUserOnly")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateProductDto productDto)
        {
            int userId = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
            ProductDto product = await _service.UpdateProduct(userId, id, productDto);
            if (product == null)
                return BadRequest();
            return Ok(product);
        }

        //DELETE api/product/id
        [HttpDelete("{id}")]
        [Authorize(Roles = "SALESMAN", Policy = "VerifiedUserOnly")]
        public async Task<IActionResult> Delete(int id)
        {
            int userId = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
            bool deleted = await _service.DeleteProduct(userId, id);
            if (deleted == false)
                return BadRequest();
            return Ok();
        }
    }
}
