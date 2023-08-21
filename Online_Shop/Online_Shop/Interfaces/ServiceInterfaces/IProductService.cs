using Online_Shop.Dto;
using Online_Shop.Models;

namespace Online_Shop.Interfaces.ServiceInterfaces
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetAll();
        Task<List<ProductDto>> GetMyProducts(int id);
        Task<ProductDto> GetProductById(int id);
        Task<ProductDto> UpdateProduct(int userId, int productId, UpdateProductDto productDto);
        Task<bool> DeleteProduct(int userId, int productId);
        Task<ProductDto> CreateProduct(int id, CreateProductDto productDto);
    }
}
