using Online_Shop.Dto;
using Online_Shop.Models;

namespace Online_Shop.Interfaces.ServiceInterfaces
{
    public interface IOrderService
    {
        Task<List<OrderDto>> GetAllOrders();
        Task<List<OrderDto>> GetAllDeliveredOrders(int id);
        Task<List<OrderDto>> GetAllInProgressOrders(int id);
        Task<OrderDto> GetOrderById(int id);
        Task<OrderDto> CreateOrder(int userId, CreateOrderDto orderDto);
        Task<bool> DenyOrder(int id);
    }
}
