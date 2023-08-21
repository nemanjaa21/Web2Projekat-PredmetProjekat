import React, { useState, useRef } from "react";
import {
  Modal,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";
import ImageForm from "../../ImageForm/ImageForm";
import { createNewProduct } from "../../../services/ProductService";

const NewProduct = ({ open, onClose }) => {
  const exceptionRead = (value) => value.split(":")[1].split("at")[0];
  const [alert, setAlert] = useState({
    message: "",
    severity: "success",
  });
  const [data, setData] = useState({
    Name: "",
    Description: "",
    Amount: 0,
    Price: 0,
    ImageForm: "",
  });

  const [displayImage, setDisplayImage] = useState(null);
  const defaultImage = process.env.PUBLIC_URL + "/product.jpg";
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
    console.log(file);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("Name", data.Name);
    formData.append("Description", data.Description);
    formData.append("Amount", data.Amount);
    formData.append("Price", data.Price);
    formData.append("ImageForm", data.ImageForm);

    const addProduct = async () => {
      try {
        const response = await createNewProduct(formData).then(() => {onClose();});
      } catch (error) {
        if (error) alert(exceptionRead(error.response.data));
        return;
      }
    };
    addProduct();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <>
        <Typography component="h1" variant="h5">
          Create product
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Box
            noValidate
            sx={{
              backgroundColor: "#8B008B",
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
                      image={displayImage ? displayImage : defaultImage}
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
                color="success"
              >
                Add
              </Button>
              <Button
                sx={{ ml: 2, mt: 1 }}
                onClick={onClose}
                variant="contained"
                color="error"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </>
    </Modal>
  );
};

export default NewProduct;
