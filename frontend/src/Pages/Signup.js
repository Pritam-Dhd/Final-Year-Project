import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmPasswordErrorMessage("");
    setPasswordErrorMessage("");
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
            .post("http://localhost:5000/signup", {
              name: e.target.name.value,
              phone_no: e.target.phoneNo.value,
              email: e.target.email.value,
              password: e.target.password.value,
            })
            .then(
              (response) => {
                if (response.data.message === "User registered successfully") {
                  localStorage.setItem("userRole", response.data.userRole);
                  navigate("/dashboard");
                } else if (response.data.message === "User already exists") {
                  setErrorMessage("User already exits");
                } else {
                  console.log(response.data.message);
                  setErrorMessage("Error during signup");
                }
              },
              (error) => {
                setErrorMessage(error.response.data.message);
              }
            );
        } else {
          setConfirmPasswordErrorMessage("Passwords do not match");
        }
      } else {
        setPasswordErrorMessage(
          "Password must contain at least one digit, one lowercase and one uppercase letter, and one special character."
        );
      }
    } else {
      setErrorMessage("All the fields must be filled");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          backgroundColor: "#E6EAF4",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOpenOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Signup
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
          <Typography color="error">{passwordErrorMessage}</Typography>
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
          <Typography color="error">{confirmPasswordErrorMessage}</Typography>
          <Typography color="error">{errorMessage}</Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
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
      </Box>
    </Container>
  );
};

export default Signup;
