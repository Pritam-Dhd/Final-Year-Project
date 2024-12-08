import { React, useState } from "react";
import { useUserRole } from "../Components/UserContext";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  InputAdornment,
  CssBaseline,
  Paper,
} from "@mui/material";
import axios from "axios";
import LockOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SnackBar from "../Components/SnackBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { updateUserRole } = useUserRole();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setConfirmPasswordErrorMessage("");
    // setPasswordErrorMessage("");
    setErrorMessage("");
    const isValidPassword = passwordRegex.test(e.target.password.value);
    if (
      e.target.name.value !== null &&
      e.target.phoneNo.value != null &&
      e.target.email.value != null
    ) {
      if (isValidPassword) {
        if (e.target.password.value === e.target.confirmPassword.value) {
          axios
            .post(
              `${process.env.REACT_APP_API}/signup`,
              {
                name: e.target.name.value,
                phone_no: e.target.phoneNo.value,
                email: e.target.email.value,
                password: e.target.password.value,
              },
              { withCredentials: true }
            )
            .then(
              (response) => {
                if (response.data.message === "User registered successfully") {
                  updateUserRole(response.data.userRole);
                  localStorage.setItem("userRole", response.data.userRole);
                  navigate("/dashboard");
                } else if (response.data.message === "User already exists") {
                  setErrorMessage("User already exits");
                  setOpenSnackbar(true);
                } else {
                  console.log(response.data.message);
                  setErrorMessage(response.data.message);
                  setOpenSnackbar(true);
                }
              },
              (error) => {
                setErrorMessage(error.response.data.message);
                setOpenSnackbar(true);
              }
            );
        } else {
          setErrorMessage("Passwords do not match");
          setOpenSnackbar(true);
        }
      } else {
        setErrorMessage(
          "Password must contain at least one digit, one lowercase and one uppercase letter, and one special character."
        );
        setOpenSnackbar(true);
      }
    } else {
      setErrorMessage("All the fields must be filled");
      setOpenSnackbar(true);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://wordsrated.com/wp-content/uploads/2022/02/Number-of-Books-Published-Per-Year.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h4"mb={1}>
              Library Management System
            </Typography>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Signup
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Enter full name"
                name="name"
                autoComplete="name"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phoneNo"
                type="number"
                label="Enter Phone No"
                name="phoneNo"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Enter Email"
                name="email"
                autoComplete="email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Enter Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {showPassword ? (
                        <VisibilityIcon
                          onClick={() => setShowPassword(false)}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          onClick={() => setShowPassword(true)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {showConfirmPassword ? (
                        <VisibilityIcon
                          onClick={() => setConfirmShowPassword(false)}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          onClick={() => setConfirmShowPassword(true)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 1 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Typography variant="span" color="initial">
                    Already have an account?{" "}
                  </Typography>
                  <Link
                    href="/login"
                    variant="body2"
                    color="#002575"
                    sx={{ fontWeight: "bold" }}
                    underline="hover"
                  >
                    Login
                  </Link>
                </Grid>
              </Grid>
            </Box>
            <SnackBar
              open={openSnackbar}
              message={errorMessage}
              onClose={handleSnackbarClose}
            />
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default Signup;
