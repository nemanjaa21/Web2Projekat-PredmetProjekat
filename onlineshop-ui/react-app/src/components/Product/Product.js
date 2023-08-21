import React, { useState, useEffect } from "react";
import NewProduct from "./NewProduct/NewProduct";
import {
  Box,
  Button,
  Avatar,

} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NavBar from "../NavBar/NavBar";
import {
  deleteProduct,
  getMyProducts,
  getProductById,
} from "../../services/ProductService";
import UpdateProduct from "./UpdateProduct/UpdateProduct.js";

const Product = () => {
  //const exceptionRead = (value) => value.split(":")[1].split("at")[0];
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [updateProductOpen, setUpdateProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [change, setChange] = useState(false);

  const img = "data:image/*;base64,";
  const imgUrl = process.env.PUBLIC_URL + "/product.jpg";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyProducts();
        setProducts(response.data);
      } catch (error) {
       if (error) alert(error.response.data);
        return;
      }
    };

    fetchData();
  }, [change]);

  const handleAddProduct = () => {
    setNewProductOpen(true);
  };

  const handleCloseNewProduct = () => {
    setNewProductOpen(false);
    setChange(!change);
  };

  const handleUpdateProduct = (id) => {
    setUpdateProductOpen(true);
    const fetchData = async () => {
      try {
        const response = await getProductById(id);
        setSelectedProduct(response.data);
      } catch (error) {
        if (error) alert(error.response.data);
        return;
      }
    };

    fetchData();
  };

  const handleCloseUpdateProduct = () => {
    setUpdateProductOpen(false);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await deleteProduct(id);
      setChange(!change);
    } catch (error) {
      if (error) alert(error.response.data);
      return;
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80, type: "number" },
    {
      field: "image",
      headerName: "Image",
      width: 250,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <Avatar
              src={Image !== "" ? img + params.row.image : imgUrl}
              style={{ width: "100%", height: "auto" }}
            ></Avatar>
          </div>
        );
      },
    },
    { field: "name", headerName: "Name", width: 130 },
    { field: "description", headerName: "Description", width: 170 },
    { field: "amount", headerName: "Amount", width: 100 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: 'productButton',
      headerName: '',
      width: 150,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: 'right',
      renderHeader: () => (
        <Button
          variant="contained"
          color="success"
          onClick={() => handleAddProduct()}
          sx={{ m: 1 }}
        >
          Add new product
        </Button>
      ),
      width: 230,
      sortable: false,
      renderCell: (params) => {
        const { id } = params.row;
        return (
          <div>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleUpdateProduct(id)}
            >
              Change
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteProduct(id)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#8B008B",
        }}
      >
        <NewProduct open={newProductOpen} onClose={handleCloseNewProduct} />
        {selectedProduct && (
          <UpdateProduct
            open={updateProductOpen}
            onClose={handleCloseUpdateProduct}
            product={selectedProduct}
          />
        )}
        <DataGrid
          rows={products}
          columns={columns}
          rowHeight={200}
          sx={{ color: "white", textAlign: "center" }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Box>
    </>
  );
};

export default Product;
