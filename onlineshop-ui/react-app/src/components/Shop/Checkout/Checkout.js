import React, { useState, useContext } from "react";
import { Modal, Button, TextField, Box, Typography } from "@mui/material";
import { createOrder } from "../../../services/OrderService";
import CartContext from "../../../contexts/cart-context";

const Checkout = ({ open, onClose }) => {
  const exceptionRead = (value) => value.split(":")[1].split("at")[0];
  const cartCtx = useContext(CartContext);
  const [data, setData] = useState({
    OrderProducts: cartCtx.items.map((item) => ({
      ProductId: item.id,
      Amount: item.amount,
    })),
    Address: "",
    Comment: "",
  });

  const handleSubmit = async () => {
    try {
      const response = await createOrder(data);
    } catch (error) {
      if (error) alert(exceptionRead(error.response.data));
      return;
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: "#243b55",
          display: "flex",
          marginLeft: "65%",
          width: 450,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: "2%",
        }}
      >
        <Typography sx={{ color: "white", fontSize: 30 }}>Checkout</Typography>

        <Box
          display="flex"
          flexDirection="column"
          sx={{
            justifyContent: "flex-end",
            alignItems: "center",
            mt: -2,
            marginTop: "10%",
          }}
        >
          <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
            autoComplete="address"
            name="address"
            required
            fullWidth
            id="address"
            label="Address"
            autoFocus
            onChange={(e) => setData({ ...data, Address: e.target.value })}
          />
          <TextField
            inputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "white" } }}
            fullWidth
            id="comment"
            label="Comment"
            name="comment"
            autoComplete="comment"
            onChange={(e) => setData({ ...data, Comment: e.target.value })}
          />
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
              Order
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
    </Modal>
  );
};

export default Checkout;
