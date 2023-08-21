import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./contexts/auth-context";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import CartProvider from "./contexts/CartProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_ID || ""}>
      <AuthContextProvider>
        <CartProvider>
          <App />
        </CartProvider>
        <ToastContainer />
      </AuthContextProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
