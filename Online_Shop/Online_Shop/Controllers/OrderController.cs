using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Online_Shop.Dto;
using Online_Shop.Interfaces.ServiceInterfaces;
using System.Data;

namespace Online_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        IOrderService _service;
        public OrderController(IOrderService service)
        {
            _service = service;
        }

        [HttpPost("create-order")]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> CreateOrder(CreateOrderDto orderDto)
        {
            int id = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
            OrderDto order = await _service.CreateOrder(id, orderDto);
            if (order == null)
                return BadRequest();
            return Ok(order);
        }

        //GET api/order
        [HttpGet("get-all-orders")]
        [Authorize(Roles = "ADMINISTRATOR")]
        public async Task<IActionResult> GetAllOrders()
        {
            List<OrderDto> orders = await _service.GetAllOrders();
            if (orders == null)
                return BadRequest();
            return Ok(orders);
        }

        //GET api/order
        [HttpGet("get-customer-delivered-orders")]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> GetCustomerDeliveredOrders()
        {
            int id = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
            List<OrderDto> orders = await _service.GetAllDeliveredOrders(id);
            if (orders == null)
                return BadRequest();
            return Ok(orders);
        }

        //GET api/order
        [HttpGet("get-salesman-delivered-orders")]
        [Authorize(Roles = "SALESMAN", Policy = "VerifiedUserOnly")]
        public async Task<IActionResult> GetSalesmanDeliveredOrders()
        {
            int id = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
            List<OrderDto> orders = await _service.GetAllDeliveredOrders(id);
            if (orders == null)
                return BadRequest();
            return Ok(orders);
        }

        //GET api/order
        [HttpGet("get-customer-in-progress-orders")]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> GetCustomerInProgressOrders()
        {
            int id = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
            List<OrderDto> orders = await _service.GetAllInProgressOrders(id);
            if (orders == null)
                return BadRequest();
            return Ok(orders);
        }

        //GET api/order
        [HttpGet("get-salesman-in-progress-orders")]
        [Authorize(Roles = "SALESMAN", Policy = "VerifiedUserOnly")]
        public async Task<IActionResult> GetSalesmanInProgressOrders()
        {
            int id = int.Parse(User.Claims.First(c => c.Type == "UserId").Value);
            List<OrderDto> orders = await _service.GetAllInProgressOrders(id);
            if (orders == null)
                return BadRequest();
            return Ok(orders);
        }

        //GET api/order
        [HttpPut("deny-order/{id}")]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> DenyOrder(int id)
        {
            bool temp = await _service.DenyOrder(id);
            if (!temp)
                return BadRequest();
            return Ok();
        }
    }
}
