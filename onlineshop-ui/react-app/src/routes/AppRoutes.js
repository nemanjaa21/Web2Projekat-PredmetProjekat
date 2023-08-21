import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "../contexts/auth-context.js";
import Login from "../components/Login/Login.js";
import Register from "../components/Register/Register.js";
import Dashboard from "../components/Dashboard/Dashboard.js";
import Profile from "../components/Profile/Profile.js";
import Verification from "../components/Verification/Verification.js";
import Orders from "../components/Orders/Orders.js";
import Product from '../components/Product/Product.js';
import Shop from "../components/Shop/Shop.js";

const AppRoutes = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Dashboard /> : <Login />} />
      <Route
        path="/register"
        element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Login />}
      />
      <Route path="/profile" element={isLoggedIn ? <Profile /> : <Login />} />
      <Route
        path="/verification"
        element={isLoggedIn ? <Verification /> : <Login />}
      />
      <Route 
        path="/orders" 
        element={isLoggedIn ? <Orders /> : <Login />} 
      />
      <Route 
        path="/product" 
        element={isLoggedIn ? <Product /> : <Login />} 
      />
      <Route 
        path="/shop" 
        element={isLoggedIn ? <Shop /> : <Login />} 
      />
    </Routes>
  );
};

export default AppRoutes;
