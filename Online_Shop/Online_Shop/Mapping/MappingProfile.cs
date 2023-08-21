using AutoMapper;
using Online_Shop.Dto;
using Online_Shop.Models;

namespace Online_Shop.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, RegisterDto>().ReverseMap();
            CreateMap<User, UpdateProfileDto>().ReverseMap();
            CreateMap<User, UserVerificationDto>().ReverseMap();


            CreateMap<Order, OrderDto>().ReverseMap();
            CreateMap<Order, CreateOrderDto>().ReverseMap();



            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<Product, CreateProductDto>().ReverseMap();
            CreateMap<Product, UpdateProductDto>().ReverseMap();



            CreateMap<OrderProduct, OrderProductDto>().ReverseMap();
            CreateMap<OrderProduct, CreateOrderProductDto>().ReverseMap();



            CreateMap<IFormFile, byte[]>().ConvertUsing((file, _, context) => ConvertIFormFileToByteArray(file, context));
            CreateMap<byte[], IFormFile>().ConvertUsing((byteArray, _, context) => ConvertByteArrayToIFormFile(byteArray, context));

        }

        public byte[] ConvertIFormFileToByteArray(IFormFile file, ResolutionContext context)
        {

            using (var m = new MemoryStream())
            {


                file.CopyTo(m);

                return m.ToArray();

            }
        }

        public IFormFile ConvertByteArrayToIFormFile(byte[] nizBajtova, ResolutionContext context)
        {

            var m = new MemoryStream(nizBajtova);
            var fajl = new FormFile(m, 0, nizBajtova.Length, null, "file");



            return fajl;
        }
    }
}
