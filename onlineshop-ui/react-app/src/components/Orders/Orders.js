import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../contexts/auth-context";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  getAllOrders,
  getCustomerDeliveredOrders,
  getCustomerInProgressOrders,
  getSalesmanDeliveredOrders,
  getSalesmanInProgressOrders,
} from "../../services/OrderService";
import NavBar from "../NavBar/NavBar";
import { denyOrder, approveOrder } from "../../services/OrderService";

function Row({ row, onDenyOrder, onApproveOrder }) {
  const [open, setOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime(row.deliveryTime)
  );
  const authCtx = useContext(AuthContext);
  const role = authCtx.role;
  const exceptionRead = (value) => value.split(":")[1].split("at")[0];

  const isCustomer = role === "CUSTOMER";

  const isSalesman = role === "SALESMAN";
  console.log('eve ga', remainingTime);

  function calculateRemainingTime(deliveryTime) {
    const deliveryDate = new Date(deliveryTime);
    const startDate = new Date();
    const remainingTime = deliveryDate.getTime() - startDate.getTime();

    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    const formattedTime = `${hours}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return formattedTime;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemainingTime = calculateRemainingTime(row.deliveryTime);
      setRemainingTime(newRemainingTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [row.deliveryTime]);

  const handleApproveOrder = () => {
    onApproveOrder(row.id);
  };

  const handleDenyOrder = () => {
    onDenyOrder(row.id);
  };



  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: "white" }}>
          {row.id}
        </TableCell>
        <TableCell align="center" sx={{ color: "white" }}>{row.comment}</TableCell>
        <TableCell align="center" sx={{ color: "white" }}>{row.address}</TableCell>
        <TableCell align="center" sx={{ color: "white" }}>{row.price}</TableCell>
        <TableCell align="center" sx={{ color: "white" }}>{row.orderTime.split(".")[0]}</TableCell>
        <TableCell align="center" sx={{ color: "white" }}>{row.approved && row.status !== 'DENIED' && remainingTime}</TableCell>
        <TableCell align="center" sx={{ color: "white" }}>{row.status}</TableCell>
        {isCustomer && row.status === 'INPROGRESS' &&
          <TableCell align="center" sx={{ color: "white" }}><Button sx={{ ml: 2, mt: 1 }}
            onClick={handleDenyOrder}
            variant="contained"
            color="error">Deny</Button></TableCell>
        }

        {isSalesman && row.approved === false &&
          <TableCell align="center" sx={{ color: "white" }}><Button sx={{ ml: 2, mt: 1 }}
            onClick={handleApproveOrder}
            variant="contained"
            color="success">Approve</Button></TableCell>
        }
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ color: "white" }}>
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Name
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      {" "}
                      Description
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Price
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      Amount
                    </TableCell>
                    <TableCell align="right" sx={{ color: "white" }}>
                      Total price ($)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orderProducts.map((orderProduct) => (
                    <TableRow key={orderProduct.id}>
                      <TableCell align="center" sx={{ color: "white" }}>
                        {orderProduct.product.name}
                      </TableCell>
                      <TableCell align="center" sx={{ color: "white" }}>
                        {orderProduct.product.description}
                      </TableCell>
                      <TableCell align="center" sx={{ color: "white" }}>
                        {orderProduct.product.price} $
                      </TableCell>
                      <TableCell align="center" sx={{ color: "white" }}>
                        x{orderProduct.amount}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "white" }}>
                        {orderProduct.amount * orderProduct.product.price} $
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    comment: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    orderTime: PropTypes.string.isRequired,
    deliveryTime: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    orderProducts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        amount: PropTypes.number.isRequired,
        product: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired,
          amount: PropTypes.number.isRequired,
          description: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
    userId: PropTypes.number.isRequired,
    deliveryPrice: PropTypes.number.isRequired,
  }).isRequired,
};

const Orders = () => {
  const exceptionRead = (value) => value.split(":")[1].split("at")[0];
  const [data, setData] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [change, setChange] = useState(false);
  const authCtx = useContext(AuthContext);
  const role = authCtx.role;
  const navigate = useNavigate();

  const isAdmin = role === "ADMINISTRATOR";
  const isCustomer = role === "CUSTOMER";
  const isSalesman = role === "SALESMAN";

  const handleDenyOrder = async (orderId) => {
    try {
      // Implement your logic to deny the order
      const response = await denyOrder(orderId);
      setChange(!change);
      alert("You deny order succesfully!");
    } catch (error) {
      if (error) alert(exceptionRead(error.response.data));
    }
  };



  const handleApproveOrder = async (orderId) => {
    try {
      // Implement your logic to approve the order
      const response = await approveOrder(orderId);
      setChange(!change);
      alert("You approve order succesfully!");
    } catch (error) {
      if (error) alert(exceptionRead(error.response.data));
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      if (isAdmin) {
        try {
          const response = await getAllOrders();
          console.log("ovaj ispis", response.data);
          setData(response.data);
        } catch (error) {
          if (error) alert(exceptionRead(error.response.data));
          return;
        }
      }
    };
    fetchData();
  }, [change]);

  useEffect(() => {
    const fetchData = async () => {
      if (isSalesman) {
        try {
          const responseInProgress = await getSalesmanInProgressOrders();
          console.log("ovaj ispis", responseInProgress.data);
          setData(responseInProgress.data);
          const responseDelivered = await getSalesmanDeliveredOrders();
          setDelivered(responseDelivered);
        } catch (error) {
          if (error) alert(exceptionRead(error.response.data));
          return;
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isCustomer) {
        try {
          const responseInProgress = await getCustomerInProgressOrders();
          console.log("ovaj ispis", responseInProgress.data);
          setData(responseInProgress.data);
          const responseDelivered = await getCustomerDeliveredOrders();
          // setData((data) => ({
          //   ...data,
          //   ...responseDelivered.data,
          // }));
          setDelivered(responseDelivered);
        } catch (error) {
          if (error) alert(exceptionRead(error.response.data));
          return;
        }
      }
    };
    fetchData();
  }, [change]);

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
        <div
          style={{
            position: "fixed",
            top: 65,
            width: "100%",
            backgroundColor: "blue",
          }}
        >
          <TableContainer component={Paper} style={{ background: "#8B008B" }}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell sx={{ color: "white" }}>Id</TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Comment
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Address
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Price
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Order Time
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Delivery Time
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white" }}>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 &&
                  data.map((row) => <Row
                    key={row.id}
                    row={row}
                    onDenyOrder={handleDenyOrder}
                    onApproveOrder={handleApproveOrder}
                  />)}
                {delivered.length > 0 &&
                  delivered.map((row) => <Row key={row.id} row={row} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </>
  );
};

Orders.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Orders;
