import React, { useRef, useEffect, useState, useContext } from "react";
import CartContext from "../../contexts/cart-context";
import { createOrder } from "../../services/OrderService";
import { useNavigate } from "react-router-dom";

const PayPal = ({ data }) => {
  const exceptionRead = (value) => value.split(":")[1].split("at")[0];
  const cartCtx = useContext(CartContext);
  const totalPrice = cartCtx.totalPrice;
  const [payPal, setPaypal] = useState(false);
  const paypal = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  value: totalPrice.toFixed(2).toString(),
                  currency_code: "USD",
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);
          setPaypal(true);
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, []);

  useEffect(() => {
    if (payPal) {
      const payPalOrder = async () => {
        try {
          const response = await createOrder(data);
          navigate("/shop");

        } catch (error) {
          if (error) alert(exceptionRead(error.response.data));
          return;
        }
      };
      payPalOrder();
    } else return;
  }, [payPal]);

  return <div ref={paypal}></div>;
};

export default PayPal;