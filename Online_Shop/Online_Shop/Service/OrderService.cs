using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Online_Shop.Dto;
using Online_Shop.Exceptions;
using Online_Shop.Interfaces.RepositoryInterfaces;
using Online_Shop.Interfaces.ServiceInterfaces;
using Online_Shop.Models;
using Online_Shop.Repository;
using System.Text;

namespace Online_Shop.Service
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;
        
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;
        public OrderService(IOrderRepository orderRepository, IProductRepository productRepository, IUserRepository userRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _userRepository = userRepository;
            _productRepository = productRepository;
            _mapper = mapper;
            
        }

        public async Task<OrderDto> CreateOrder(int userId, CreateOrderDto orderDto)
        {
            if (String.IsNullOrEmpty(orderDto.Address))
                throw new Exception($"You must fill field for address!");

            Order newOrder = _mapper.Map<CreateOrderDto, Order>(orderDto);
            newOrder.UserId = userId;
            newOrder.OrderTime = DateTime.Now;
            newOrder.DeliveryTime = DateTime.Now.AddHours(1).AddMinutes(new Random().Next(60));
            newOrder.DeliveryPrice = 200;
            newOrder.Status = Common.EOrderStatus.INPROGRESS;

            foreach (OrderProduct op in newOrder.OrderProducts)
            {
                Product p = await _productRepository.GetProductById(op.ProductId);

                if (op.Amount > p.Amount)
                    throw new BadRequestException("There is not enough amount of this product.");

                op.ProductId = p.Id;
                p.Amount -= op.Amount;
                newOrder.Price += op.Amount * p.Price;

            }

            OrderDto dto = _mapper.Map<Order, OrderDto>(await _orderRepository.CreateOrder(newOrder));
            return dto;
        }

        public async Task<bool> DenyOrder(int id)
        {
            Order o = await _orderRepository.GetOrderById(id);
            if (o == null)
                throw new Exception($"Order with ID: {id} doesn't exist.");
            o.Status = Common.EOrderStatus.DENIED;
            List<Product> products = await _productRepository.GetAllProducts();
            foreach(OrderProduct op in o.OrderProducts)
            {
                foreach(Product p in products)
                {
                    if(p.Id == op.ProductId)
                    {
                        p.Amount += op.Amount;
                    }
                }
            }
            _orderRepository.SaveChanges();
            return true;
        }

        public async Task<List<OrderDto>> GetAllInProgressOrders(int id)
        {
            User user = await _userRepository.GetById(id);
            if (user == null)
                throw new NotFoundException($"User with id:{id} doesn't exist!");

            List<Order> allOrders = await _orderRepository.GetAllOrders();
            allOrders = allOrders.Where(o => o.Status == Common.EOrderStatus.INPROGRESS).ToList();
            if (allOrders == null)
                throw new Exception($"There are no orders!");

            if (user.Type == Common.EUserType.CUSTOMER)
            {
                List<Order> customerOrders = new List<Order>();
                customerOrders = allOrders.Where(o => o.UserId == user.Id).ToList();
                return _mapper.Map<List<Order>, List<OrderDto>>(customerOrders);
            }
            else if (user.Type == Common.EUserType.SALESMAN)
            {
                List<Order> salesmanOrders = new List<Order>();
                List<Product> products = await _productRepository.GetAllProducts();
                products = products.Where(p => p.UserId == user.Id).ToList();

                foreach (Order o in allOrders)
                {
                    foreach(OrderProduct op in o.OrderProducts)
                    {
                        foreach (Product p in products)
                        {
                            if (p.Id == op.ProductId)
                                salesmanOrders.Add(o);
                        }
                    }
                }
                return _mapper.Map<List<Order>, List<OrderDto>>(salesmanOrders);
            }
            return null;
        }

        public async Task<List<OrderDto>> GetAllDeliveredOrders(int id)
        {
            User user = await _userRepository.GetById(id);
            if (user == null)
                throw new NotFoundException($"User with id:{id} doesn't exist!");

            List<Order> allOrders = await _orderRepository.GetAllOrders();
            allOrders = allOrders.Where(o => o.Status == Common.EOrderStatus.DELIVERED).ToList();
            if (allOrders == null)
                throw new Exception($"There are no orders!");

            if (user.Type == Common.EUserType.CUSTOMER)
            {
                List<Order> customerOrders = new List<Order>();
                customerOrders = allOrders.Where(o => o.UserId == user.Id).ToList();
                return _mapper.Map<List<Order>, List<OrderDto>>(customerOrders);
            }
            else if(user.Type == Common.EUserType.SALESMAN)
            {
                List<Order> salesmanOrders = new List<Order>();
                List<Product> products = await _productRepository.GetAllProducts();
                products = products.Where(p => p.UserId == user.Id).ToList();

                foreach (Order o in allOrders)
                {
                    foreach(Product p in products)
                    {
                        foreach(OrderProduct op in o.OrderProducts)
                        {
                            if (p.Id == op.ProductId)
                                salesmanOrders.Add(o);
                        }
                    }
                }
                return _mapper.Map<List<Order>, List<OrderDto>>(salesmanOrders);
            }

            return null;
        }

        public async Task<OrderDto> GetOrderById(int id)
        {
            Order o = await _orderRepository.GetOrderById(id);
            if (o == null)
                throw new Exception($"Order with ID: {id} doesn't exist.");
            return _mapper.Map<Order, OrderDto>(o);
        }

        public async Task<List<OrderDto>> GetAllOrders()
        {
            List<Order> allOrders = await _orderRepository.GetAllOrders();
            return _mapper.Map<List<Order>, List<OrderDto>>(allOrders);
        }
    }
}
