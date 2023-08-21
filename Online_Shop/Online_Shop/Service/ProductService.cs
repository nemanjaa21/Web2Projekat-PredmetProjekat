using AutoMapper;
using Online_Shop.Dto;
using Online_Shop.Exceptions;
using Online_Shop.Interfaces.RepositoryInterfaces;
using Online_Shop.Interfaces.ServiceInterfaces;
using Online_Shop.Models;
using Online_Shop.Repository;
using System.Text;

namespace Online_Shop.Service
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository productRepo;
        private readonly IUserRepository userRepo;
        private readonly IMapper imapper;
        

        public ProductService(IProductRepository productRepository, IUserRepository userRepository, IMapper mapper)
        {
            this.productRepo = productRepository;
            this.userRepo = userRepository;
            this.imapper = mapper;
            
        }

        public async Task<ProductDto> CreateProduct(int id, CreateProductDto productDto)
        {
            if (String.IsNullOrEmpty(productDto.Name) || String.IsNullOrEmpty(productDto.Amount.ToString()) ||
                String.IsNullOrEmpty(productDto.Price.ToString()) || String.IsNullOrEmpty(productDto.Description))
                throw new BadRequestException($"You must fill in all fields for adding product!");

            if(productDto.Price < 1 || productDto.Amount < 1)
                throw new BadRequestException($"Invalid field values!");

            List<User> users = await userRepo.GetAll();
            User salesman = users.Where(s => s.Id == id).FirstOrDefault();

            if (salesman == null)
                throw new NotFoundException($"Salesman with ID: {id} doesn't exist.");

            Product newProduct = imapper.Map<Product>(productDto);
            using(var memoryStream = new MemoryStream())
            {
                productDto.ImageForm.CopyTo(memoryStream);
                var imageBytes = memoryStream.ToArray();
                newProduct.Image = imageBytes;
            }

            newProduct.Deleted = false;
            newProduct.User = salesman;
            newProduct.UserId = id;

            ProductDto dto = imapper.Map<Product, ProductDto>(await productRepo.CreateProduct(newProduct));         
            return dto;
        }

        public async Task<bool> DeleteProduct(int userId, int productId)
        {
            List<Product> products = await productRepo.GetAllProducts();
            products = products.Where(p=> p.UserId ==  userId).ToList();
            Product p = products.Where(p => p.Id == productId).FirstOrDefault();
            if (p == null)
                throw new NotFoundException($"Product with ID: {productId} doesn't exist.");
            return await productRepo.DeleteProduct(productId);
        }

        public async Task<List<ProductDto>> GetAll()
        {
            List<Product> products = await productRepo.GetAllProducts();
            products = products.Where(p => p.Deleted == false).ToList();

            return imapper.Map<List<Product>, List<ProductDto>>(products);
        }

        public async Task<List<ProductDto>> GetMyProducts(int id)
        {
            List<Product> products = await productRepo.GetAllProducts();
            products = products.Where(p => p.UserId == id && p.Deleted == false).ToList();
            if (products == null)
                throw new NotFoundException($"There are no products!");
            List<ProductDto> lista = imapper.Map<List<Product>, List<ProductDto>>(products);
            return lista;
        }

        public async Task<ProductDto> GetProductById(int id)
        {
            Product p = await productRepo.GetProductById(id);
            if (p == null)
                throw new NotFoundException($"Product with ID: {id} doesn't exist.");
            return imapper.Map<Product, ProductDto>(p);
        }

        public async Task<ProductDto> UpdateProduct(int userId, int productId, UpdateProductDto productDto)
        {
            Product p = await productRepo.GetProductById(productId);
            if (p == null)
                throw new NotFoundException($"Product with ID:{productId} doesn't exist.");

            if (p.UserId != userId)
                throw new BadRequestException($"You can't update this product!");

            if (String.IsNullOrEmpty(productDto.Name) || String.IsNullOrEmpty(productDto.Amount.ToString()) ||
                String.IsNullOrEmpty(productDto.Price.ToString()) || String.IsNullOrEmpty(productDto.Description))
                throw new BadRequestException($"You must fill in all fields for updating product!");

            if (productDto.Price < 1 || productDto.Amount < 1)
                throw new BadRequestException($"Invalid field values!");

            imapper.Map(productDto, p);
            using (var memoryStream = new MemoryStream())
            {
                productDto.ImageForm.CopyTo(memoryStream);
                var imageBytes = memoryStream.ToArray();
                p.Image = imageBytes;
            }

            ProductDto dto = imapper.Map<Product, ProductDto>(await productRepo.UpdateProduct(p));
            return dto;
        }
    }
}
