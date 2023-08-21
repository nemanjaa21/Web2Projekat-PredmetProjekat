using Online_Shop.Models;

namespace Online_Shop.Interfaces.RepositoryInterfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllProducts();
        Task<Product> GetProductById(int id);
        Task<Product> UpdateProduct(Product product);
        Task<bool> DeleteProduct(int productId);
        Task<Product> CreateProduct(Product product);
    }
}
