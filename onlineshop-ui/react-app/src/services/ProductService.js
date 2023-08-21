import api from "../helpers/ConfigHelper";

export const getAllProducts = async () => {
  return await api.get(`/product/get-all-products`)
}

export const getMyProducts = async () => {
  return await api.get(`/product/get-my-products`);
};

export const getProductById = async (id) => {
  return await api.get(`/product/` + id);
};

export const createNewProduct = async (productData) => {
  return await api.post(`/product`, productData, {headers: {"Content-Type":"multipart/form-data"}});
};

export const updateProduct = async (id, productData) => {
  return await api.put(`/product` + id, productData);
};

export const deleteProduct = async (id) => {
  return await api.delete(`/product/` + id);
};
