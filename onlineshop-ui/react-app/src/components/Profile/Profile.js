import React, { useState, useRef, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import ImageForm from "../ImageForm/ImageForm";
import { getMyProfile, update } from "../../services/UserService";
import NavBar from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const isNotEmpty = (value) => value.trim() !== "";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//const exceptionRead = (value) => value.split(":")[1].split("at")[0];
const defaultTheme = createTheme();

const Profile = () => {
  const navigate = useNavigate();
  const [displayImage, setDisplayImage] = useState(null);
  const [userImage, setUserImage] = useState("");
  const imageInput = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [localDate, setLocalDate] = useState(null);
  const [data, setData] = useState({
    Username: "",
    Email: "",
    OldPassword: "",
    Password: "",
    FirstName: "",
    LastName: "",
    BirthDate: "",
    Address: "",
    ImageForm: "",
  });

  const [isValid, setIsValid] = useState({
    email: true,
    username: true,
    password: true,
    oldPassword: true,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyProfile();
        console.log("OVO", response.data.birthDate);
        let initialDateString = response.data.birthDate;
        let initialDatePart = initialDateString.split("T");
        let initialDateParts = initialDatePart[0].split("-");
        console.log(initialDateParts);
        let initialDate = new Date(initialDatePart[0]);
        //let initialDate = new Date(initialDateParts[0], initialDateParts[1], initialDateParts[2]);
        setSelectedDate(initialDate);
        const imageSrc = `data:image/*;base64,` + response.data.image;
        setUserImage(imageSrc);
        setData({
          ...data,
          FirstName: response.data.firstName,
          LastName: response.data.lastName,
          Username: response.data.username,
          Email: response.data.email,
          BirthDate: initialDate,
          Address: response.data.address,
        });
      } catch (error) {
        if (error.response) alert(error.response.data);
        return;
      }
    };

    fetchData();
  }, []);

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

  const birthdateBlurHandler = () => {
    const enteredDate = data.BirthDate;
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

  const submitHandler = async (event) => {
    event.preventDefault();

    if (isNotEmpty(data.FirstName))
      setIsValid({
        ...isValid,
        firstName: true,
      });
    else
      setIsValid({
        ...isValid,
        firstName: false,
      });
    if (isNotEmpty(data.LastName))
      setIsValid({
        ...isValid,
        lastName: true,
      });
    else
      setIsValid({
        ...isValid,
        lastName: false,
      });
    if (isNotEmpty(data.Address)) {
      setIsValid({
        ...isValid,
        address: true,
      });
    } else
      setIsValid({
        ...isValid,
        address: false,
      });
    if (isNotEmpty(data.Username))
      setIsValid({
        ...isValid,
        username: true,
      });
    else
      setIsValid({
        ...isValid,
        username: false,
      });
    if (isNotEmpty(data.Email) && emailRegex.test(data.Email))
      setIsValid({
        ...isValid,
        email: true,
      });
    else
      setIsValid({
        ...isValid,
        email: false,
      });

    const formIsValid = Object.values(isValid).every((value) => value === true);
    if (!formIsValid) {
      alert("You must fill in all fields");
      return;
    }

    const date = new Date(localDate.toString());
    

    const formData = new FormData();
    formData.append("Username", data.Username);
    formData.append("Email", data.Email);
    formData.append("OldPasswordUpdate", data.OldPassword);
    formData.append("PasswordUpdate", data.Password);
    formData.append("FirstName", data.FirstName);
    formData.append("LastName", data.LastName);
    formData.append("BirthDate", date.toISOString());
    formData.append("Address", data.Address);
    formData.append("ImageForm", data.ImageForm);
    console.log("Profile", formData);

    try {
      const response = await update(formData);
    
      alert("You updated yours profile settings!");
    } catch (error) {
      if (error) alert(error.response.data);
    }
  };

  return (
    <>
      <NavBar />
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
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ color: "Black" }}>
                Update profile
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={submitHandler}
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
                      value={data.FirstName}
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
                      value={data.LastName}
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
                      value={data.Username}
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
                      value={data.Email}
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
                      fullWidth
                      name="oldPassword"
                      label="Old password"
                      type="password"
                      id="oldPassword"
                      autoComplete="new-password"
                      value={data.OldPassword}
                      error={!isValid.oldPassword}
                      onChange={(e) =>
                        setData({ ...data, OldPassword: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      inputProps={{ style: { color: "Black" } }}
                      InputLabelProps={{ style: { color: "Black" } }}
                      fullWidth
                      name="password"
                      label="New password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      value={data.Password}
                      error={!isValid.password}
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
                      id="address"
                      label="Address"
                      name="address"
                      autoComplete="address"
                      value={data.Address}
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
                        value={dayjs(data.BirthDate)}
                        error={!isValid.birthdate}
                        onBlur={birthdateBlurHandler}
                        onChange={handleDateChange}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <ImageForm
                      disabled={true}
                      image={displayImage ? displayImage : userImage}
                      imageInput={imageInput}
                      uploadHandler={imageChangeHandler}
                      avatarClickHandler={imageUploadHandler}
                    ></ImageForm>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  color="success"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </Box>
    </>
  );
};

export default Profile;
