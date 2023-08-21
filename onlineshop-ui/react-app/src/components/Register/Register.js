import React, { useState, useRef, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import ImageForm from "../ImageForm/ImageForm";
import { register } from "../../services/UserService";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

const isNotEmpty = (value) => value.trim() !== "";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//const exceptionRead = (value) => value.split(":")[1].split("at")[0];

const Register = () => {
  const navigate = useNavigate();
  const [displayImage, setDisplayImage] = useState(null);
  const defaultImage = process.env.PUBLIC_URL + "/user.jpg";
  const imageInput = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [localDate, setLocalDate] = useState(null);
  const [data, setData] = useState({
    Username: "",
    Email: "",
    Password: "",
    RepeatPassword: "",
    FirstName: "",
    LastName: "",
    BirthDate: "",
    Address: "",
    ImageForm: "",
    Type: "CUSTOMER",
  });

  const [isValid, setIsValid] = useState({
    email: true,
    username: true,
    repeatPassword: true,
    password: true,
    firstname: true,
    lastname: true,
    birthdate: true,
    address: true,
  });

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  useEffect(() => {
    if (selectedDate) {
      const localDateTime = new Date(selectedDate).toLocaleDateString();
      setLocalDate(localDateTime);
    }
  }, [selectedDate, navigate]);

  const firstnameBlurHandler = () => {
    const enteredFirstName = data.FirstName;
    if (isNotEmpty(enteredFirstName)) {
      setIsValid((valid) => ({
        ...valid,
        firstname: true,
      }));
    } else {
      setIsValid((valid) => ({
        ...valid,
        firstname: false,
      }));
    }
  };

  const lastnameBlurHandler = () => {
    const enteredlastName = data.LastName;
    if (isNotEmpty(enteredlastName)) {
      setIsValid((valid) => ({
        ...valid,
        lastname: true,
      }));
    } else {
      setIsValid((valid) => ({
        ...valid,
        lastname: false,
      }));
    }
  };

  const usernameBlurHandler = () => {
    const enteredUsername = data.Username;
    if (isNotEmpty(enteredUsername)) {
      setIsValid((valid) => ({
        ...valid,
        username: true,
      }));
    } else {
      setIsValid((valid) => ({
        ...valid,
        username: false,
      }));
    }
  };

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

  const repeatPasswordBlurHandler = () => {
    const enteredRepeatPassword = data.RepeatPassword;
    if (isNotEmpty(enteredRepeatPassword)) {
      setIsValid((valid) => ({
        ...valid,
        repeatPassword: true,
      }));
    } else {
      setIsValid((valid) => ({
        ...valid,
        repeatPassword: false,
      }));
    }
  };

  const birthdateBlurHandler = () => {
    const enteredDate = data.BirthDate;
    console.log("OVO", enteredDate);
    if (isNotEmpty(enteredDate)) {
      setIsValid((valid) => ({
        ...valid,
        birthdate: true,
      }));
    } else {
      setIsValid((valid) => ({
        ...valid,
        birthdate: false,
      }));
    }
  };

  const addressBlurHandler = () => {
    const enteredAddress = data.Address;
    if (isNotEmpty(enteredAddress)) {
      setIsValid((valid) => ({
        ...valid,
        address: true,
      }));
    } else {
      setIsValid((valid) => ({
        ...valid,
        address: false,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const currentDate = new Date();
    const minAgeDate = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    console.log(isValid);
    const formIsValid = Object.values(isValid).every((value) => value === true);
    console.log(formIsValid);
    if (!formIsValid) {
      alert("You must fill in all fields");
      return;
    } else if (data.Password !== data.RepeatPassword) {
      alert("Password dont match, try again.");
      return;
    } else if (data.BirthDate > minAgeDate) {
      alert("You must have at least 18 years.");
      return;
    }

    // //const dataForm = new FormData(event.currentTarget);

    const date = new Date(localDate.toString()).toISOString();
    console.log(data);
    

    const formData = new FormData();
    formData.append("Username", data.Username);
    formData.append("Email", data.Email);
    formData.append("Password", data.Password);
    formData.append("RepeatPassword", data.RepeatPassword);
    formData.append("FirstName", data.FirstName);
    formData.append("LastName", data.LastName);
    formData.append("BirthDate", date);
    formData.append("Address", data.Address);
    formData.append("Type", data.Type);
    formData.append("ImageForm", data.ImageForm);
    

    const registerFunction = async () => {
      try {
       
        const response = await register(formData);
        
        alert("Success registration!");
        navigate("/");
      } catch (error) {
        if (error.response) alert(error.response.data);
      }
    };
    registerFunction();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "left",
        height: "130vh",
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
              Register
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    inputProps={{ style: { color: "Black" } }}
                    InputLabelProps={{ style: { color: "Black" } }}
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    error={!isValid.firstname}
                    onBlur={firstnameBlurHandler}
                    onChange={(e) =>
                      setData({ ...data, FirstName: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    inputProps={{ style: { color: "Black" } }}
                    InputLabelProps={{ style: { color: "Black" } }}
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    error={!isValid.lastname}
                    onBlur={lastnameBlurHandler}
                    onChange={(e) =>
                      setData({ ...data, LastName: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputProps={{ style: { color: "Black" } }}
                    InputLabelProps={{ style: { color: "Black" } }}
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    error={!isValid.username}
                    onBlur={usernameBlurHandler}
                    onChange={(e) =>
                      setData({ ...data, Username: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputProps={{ style: { color: "Black" } }}
                    InputLabelProps={{ style: { color: "Black" } }}
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={!isValid.email}
                    onBlur={emailBlurHandler}
                    onChange={(e) =>
                      setData({ ...data, Email: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputProps={{ style: { color: "Black" } }}
                    InputLabelProps={{ style: { color: "Black" } }}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    error={!isValid.password}
                    onBlur={passwordBlurHandler}
                    onChange={(e) =>
                      setData({ ...data, Password: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputProps={{ style: { color: "Black" } }}
                    InputLabelProps={{ style: { color: "Black" } }}
                    required
                    fullWidth
                    name="repeatPassword"
                    label="Repeat password"
                    type="password"
                    id="repeatPassword"
                    autoComplete="new-password"
                    error={!isValid.repeatPassword}
                    onBlur={repeatPasswordBlurHandler}
                    onChange={(e) =>
                      setData({ ...data, RepeatPassword: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputProps={{ style: { color: "Black" } }}
                    InputLabelProps={{ style: { color: "Black" } }}
                    required
                    fullWidth
                    id="address"
                    label="Address"
                    name="address"
                    autoComplete="address"
                    error={!isValid.address}
                    onBlur={addressBlurHandler}
                    onChange={(e) =>
                      setData({ ...data, Address: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ backgroundColor: "gray" }}
                      required
                      fullWidth
                      name="birthdate"
                      label="Birth Date"
                      id="birthdate"
                      error={!isValid.birthdate}
                      onBlur={birthdateBlurHandler}
                      onChange={handleDateChange}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      User type
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      defaultValue="CUSTOMER"
                    >
                      <FormControlLabel
                        sx={{ color: "Black" }}
                        value="CUSTOMER"
                        control={<Radio />}
                        label="Customer"
                        onChange={() => setData({ ...data, Type: "CUSTOMER" })}
                      />
                      <FormControlLabel
                        sx={{ color: "Black" }}
                        value="SALESMAN"
                        control={<Radio />}
                        label="Salesman"
                        onChange={() => setData({ ...data, Type: "SALESMAN" })}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <ImageForm
                    required
                    disabled={true}
                    image={displayImage ? displayImage : defaultImage}
                    imageInput={imageInput}
                    uploadHandler={imageChangeHandler}
                    avatarClickHandler={imageUploadHandler}
                  ></ImageForm>
                </Grid>
              </Grid>
              <Button
                type="submit"
                color="success"
                fullWidth
                variant="contained"
                sx={{ mt: 5, mb: 10 }}
              >
                Register
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Already have an account? Login
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

export default Register;