using Online_Shop.Data;
using Online_Shop.Interfaces.RepositoryInterfaces;
using Online_Shop.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Online_Shop.Repository
{
    public class OrderRepository : IOrderRepository
    {

        private readonly DataContext dc;

        public OrderRepository(DataContext dataContext)
        {
            this.dc = dataContext;

        }
        public async Task<Order> CreateOrder(Order order)
        {

            dc.Orders.Add(order);

            try
            {
                dc.SaveChanges();
                
                return order;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public async Task<List<Order>> GetAllOrders()
        {
            try
            {
                List<Order> orders = dc.Orders.Include(o => o.OrderProducts).ThenInclude(op => op.Product).ToList();
                
                return orders;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<Order> GetOrderById(int id)
        {
            try
            {
                Order order = dc.Orders.Include(o => o.OrderProducts).Where(o => o.Id == id).FirstOrDefault();
                
                return order;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public async Task SaveChanges()
        {

            dc.SaveChanges();
        }
    }
}
