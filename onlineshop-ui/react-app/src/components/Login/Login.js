import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/auth-context";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const isNotEmpty = (value) => value.trim() !== "";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



const Login = () => {


  const navigate = useNavigate();
  const defaultTheme = createTheme();

  const [data, setData] = useState({
    Email: "",
    Password: "",
  });
  const [isValid, setIsValid] = useState({
    email: true,
    password: true,
  });



  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();




  const emailBlurHandler = () => {
    const enteredEmail = data.Email;
    if (isNotEmpty(enteredEmail) && emailRegex.test(enteredEmail)) {
      setIsValid((valid) => ({
        ...valid,
        email: true,
      }));
    } else {
      setIsValid((valid) => ({
        ...valid,
        email: false,
      }));
    }
  };




  const passwordBlurHandler = () => {
    const enteredPassword = data.Password;
    if (isNotEmpty(enteredPassword)) {
      setIsValid((valid) => ({
        ...valid,
        password: true,
      }));
    } else {
      setIsValid((valid) => ({
        ...valid,
        password: false,
      }));
    }
  };




  const submitHandler = (event) => {
    event.preventDefault();

    const loginData = { email: data.Email, password: data.Password };
    authCtx.onLogin(loginData).then((response) => {
      console.log(response);
    });
  };



  const googleLoginHandler = (response) => {
    let data = new FormData();
    data.append("googleToken", response.credential);
    authCtx.googleLogin(data);
  };



  const googleLoginErrorHandler = () => {
    toast.error("Google login error", {
      position: "top-center",
      autoClose: 2500,
      closeOnClick: true,
      pauseOnHover: false,
    });
  };



  
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#a0a1a1",
      }}
    >
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ color: "Black" }}>
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={submitHandler}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                inputProps={{ style: { color: "Black" } }}
                InputLabelProps={{ style: { color: "Black" } }}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={!isValid.email}
                onBlur={emailBlurHandler}
                onChange={(e) => setData({ ...data, Email: e.target.value })}
              />
              <TextField
                inputProps={{ style: { color: "Black" } }}
                InputLabelProps={{ style: { color: "Black" } }}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!isValid.password}
                onBlur={passwordBlurHandler}
                onChange={(e) => setData({ ...data, Password: e.target.value })}
              />
              <Button
                type="submit"
                fullWidth
                color="success"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container>
                <Grid item sx={{ marginLeft: 10 }}>
                  <GoogleLogin
                    sx={{ mt: 3, mb: 2 }}
                    onSuccess={googleLoginHandler}
                    onError={googleLoginErrorHandler}
                  />
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Register"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Box>
  );
};

export default Login;
