import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import ImageForm from "../../ImageForm/ImageForm";
import {
  updateProduct,
} from "../../../services/ProductService";

const UpdateProduct = ({ open, onClose, product }) => {
  
  const exceptionRead = (value) => value.split(":")[1].split("at")[0];
  const [data, setData] = useState({
    Name: product.name,
    Description: product.description,
    Amount: product.amount,
    Price: product.price,
    ImageForm: "",
  });

  useEffect(() => {
    setData({
      ...data,
      Name: product.name,
      Description: product.description,
      Amount: product.amount,
      Price: product.price,
    })
  }, [product]);

  const [displayImage, setDisplayImage] = useState(
    process.env.PUBLIC_URL + "/product.jpg"
  );
  const imageSrc = `data:image/*;base64,` + product.image;
  const imageInput = useRef(null);

  const imageUploadHandler = () => {
    if (!imageInput.current) {
      return;
    }
    imageInput.current.children[0].click();
  };

  const imageChangeHandler = (event) => {
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setDisplayImage(reader.result.toString());
      };
    }
    setData({
      ...data,
      ImageForm: file,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Name", data.Name);
    formData.append("Description", data.Description);
    formData.append("Amount", data.Amount);
    formData.append("Price", data.Price);
    formData.append("ImageForm", data.ImageForm);

      try {
        const response = await updateProduct(formData).then(() => {onClose();});
      } catch (error) {
        if (error) alert(exceptionRead(error.response.data));
        return;
      }
    updateProduct();
  };

  return (
      <Modal open={open} onClose={onClose}>
        <Typography component="h1" variant="h5">
          Update product
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Box
            sx={{
              backgroundColor: "#243b55",
              display: "flex",
              marginLeft: "40%",
              width: 350,
              height: 550,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Grid
              display="flex"
              flexDirection="column"
              sx={{
                justifyContent: "flex-end",
                alignItems: "center",
                mt: -2,
                marginTop: "10%",
              }}
            >
              <Grid>
                <TextField
                  inputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "white" } }}
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  defaultValue={product && product.name}
                  onChange={(e) => setData({ ...data, Name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "white" } }}
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="description"
                  defaultValue={product && product.description}
                  onChange={(e) =>
                    setData({ ...data, Description: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "white" } }}
                  required
                  fullWidth
                  name="amount"
                  label="Amount"
                  type="number"
                  id="amount"
                  autoComplete="amount"
                  defaultValue={product && product.amount}
                  onChange={(e) => setData({ ...data, Amount: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputProps={{ style: { color: "white" } }}
                  InputLabelProps={{ style: { color: "white" } }}
                  required
                  fullWidth
                  name="price"
                  label="Price"
                  type="price"
                  id="price"
                  autoComplete="price"
                  defaultValue={product && product.price}
                  onChange={(e) => setData({ ...data, Price: e.target.value })}
                />
              </Grid>
              <Grid>
                <Box
                  noValidate
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  {
                    <ImageForm
                      disabled={true}
                      image={displayImage ? displayImage : imageSrc}
                      imageInput={imageInput}
                      uploadHandler={imageChangeHandler}
                      avatarClickHandler={imageUploadHandler}
                    ></ImageForm>
                  }
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{ mt: 1 }}
                type="submit"
                variant="contained"
                color="primary"
              >
                Save
              </Button>
              <Button
                sx={{ ml: 2, mt: 1 }}
                onClick={onClose}
                variant="contained"
                color="secondary"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
  );
};

export default UpdateProduct;
