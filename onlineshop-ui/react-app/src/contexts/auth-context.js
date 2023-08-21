import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "../services/AuthService.js";
import jwtDecode from "jwt-decode";

const exceptionRead = (value) => value.split(":")[1].split("at")[0];
const AuthContext = React.createContext({
  isLoggedIn: false,
  token: "",
  verification: "",
  role: "",
  onLogout: () => {},
  onLogin: (logInData) => {},
  googleLogin: (loginData) => {},
});

const decodeToken = (token) => {
  console.log("token", token);
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.log("Error decoding token:", error);
    return null;
  }
};

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [verification, setVerification] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    const currentToken = sessionStorage.getItem("token");
    const currentRole = sessionStorage.getItem("role");
    const currentVerification = sessionStorage.getItem("verification");

    if (loggedIn === "1") {
      setIsLoggedIn(true);
      setToken(currentToken);
      setRole(currentRole);
      setVerification(currentVerification);
    }
  }, []);

  const logInHandler = async (logInData) => {
    try {
      const response = await login(logInData);
      console.log(response);
      // if (!response.ok) {
      //     throw new Error("Invalid email or password!!!");
      // }
      console.log(response);

      const decodedToken = decodeToken(response.data);
      console.log("decoded token: ", decodeToken);
      let verification = decodedToken.Verification;
      let role =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      setIsLoggedIn(true);
      setToken(response.data);
      setRole(role);
      setVerification(verification);

      sessionStorage.setItem("isLoggedIn", "1");
      sessionStorage.setItem("token", response.data);
      sessionStorage.setItem("verification", verification);
      sessionStorage.setItem("role", role);
      navigate("/dashboard");
    } catch (error) {
      alert(exceptionRead(error.response.data));
    }
  };

  const googleLoginHandler = async (logInData) => {
    try {
      const response = await googleLogin(logInData);
      console.log(response);
      console.log(response);

      const decodedToken = decodeToken(response.data);
      console.log("decoded token: ", decodeToken);
      let verification = decodedToken.Verification;
      let role =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      setIsLoggedIn(true);
      setToken(response.data);
      setRole(role);
      setVerification(verification);

      sessionStorage.setItem("isLoggedIn", "1");
      sessionStorage.setItem("token", response.data);
      sessionStorage.setItem("verification", verification);
      sessionStorage.setItem("role", role);
      navigate("/dashboard");
    } catch (error) {
      if (error.response) alert(exceptionRead(error.response.data));
    }
  };

  const logOutHandler = async () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("verification");
    sessionStorage.removeItem("role");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        token: token,
        verification: verification,
        role: role,
        onLogout: logOutHandler,
        onLogin: logInHandler,
        googleLogin: googleLoginHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
