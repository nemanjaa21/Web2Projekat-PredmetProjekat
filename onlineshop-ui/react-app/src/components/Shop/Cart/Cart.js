import React, { useContext, useState } from "react";
import CartItem from "./CartItem";
import CartContext from "../../../contexts/cart-context";
import {
  Box,
  Button,
  Modal,
  Typography,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import Checkout from "../Checkout/Checkout";

const Cart = ({ open, onClose }) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const cartCtx = useContext(CartContext);
  console.log(cartCtx.items);
  const totalAmount = cartCtx.totalAmount;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const openCheckoutHandler = () => {
    setIsCheckout(true);
  };

  const closeCheckoutHandler = () => {
    setIsCheckout(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        noValidate
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
        <Typography sx={{ color: "white", fontSize: 30 }}>My cart</Typography>
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            justifyContent: "flex-end",
            alignItems: "center",
            mt: -2,
            marginTop: "20%",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Product</TableCell>
                <TableCell sx={{ color: "white" }}>Price</TableCell>
                <TableCell sx={{ color: "white" }}>Amount</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ width: "50" }}>
              {cartCtx.items.map((item) => (
                <CartItem
                  key={item.id}
                  name={item.name}
                  amount={item.amount}
                  price={item.price}
                  onRemove={cartItemRemoveHandler.bind(null, item.id)}
                  onAdd={cartItemAddHandler.bind(null, item)}
                />
              ))}
            </TableBody>
          </Table>
        </Box>

        <Typography sx={{ color: "white" }}>Total amount: {totalAmount} RSD</Typography>
        <Typography sx={{ color: "white" }}>Delivery price: 200 RSD</Typography>

        <Box display="flex" justifyContent="center" alignItems="center">
          {hasItems && (
            <Button
              sx={{ ml: 2, mt: 1 }}
              variant="contained"
              color="success"
              onClick={openCheckoutHandler}
            >
              Order
            </Button>
          )}
          <Button
            sx={{ ml: 2, mt: 1 }}
            variant="contained"
            color="error"
            onClick={onClose}
          >
            Close
          </Button>

          <Checkout open={isCheckout} onClose={closeCheckoutHandler} />
        </Box>
      </Box>
    </Modal>
  );
};

export default Cart;
