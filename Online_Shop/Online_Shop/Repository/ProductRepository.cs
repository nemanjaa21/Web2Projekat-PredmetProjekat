using Online_Shop.Data;
using Online_Shop.Interfaces.RepositoryInterfaces;
using Online_Shop.Models;

namespace Online_Shop.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext dc;
        public ProductRepository(DataContext dataContext)
        {
            this.dc = dataContext;
        }
        public async Task<Product> CreateProduct(Product product)
        {
            try
            {
                dc.Products.Add(product);
                await dc.SaveChangesAsync();
                return product;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<bool> DeleteProduct(int id)
        {

            try
            {
                Product product = dc.Products.Find((int)id);

                product.Deleted = true;


                await dc.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {

                return false;

            }
        }

        public async Task<List<Product>> GetAllProducts()
        {
            try
            {
                List<Product> products = dc.Products.ToList();

                return products;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<Product> GetProductById(int id)
        {
            try
            {
                Product product = dc.Products.Find((int)id);

                if (product.Deleted)
                    return null;
                return product;

            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<Product> UpdateProduct(Product product)
        {

            try
            {
                dc.Products.Update(product);

                await dc.SaveChangesAsync();

                return product;
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }
}
