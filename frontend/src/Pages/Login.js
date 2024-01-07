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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.email.value != null) {
      const isValidPassword = passwordRegex.test(e.target.password.value);
      if (isValidPassword) {
        axios
          .post(
            "http://localhost:5000/login",
            {
              email: e.target.email.value,
              password: e.target.password.value,
            },
            { withCredentials: true }
          )
          .then(
            (response) => {
              if (response.data.message === "User logged in successfully") {
                localStorage.setItem("userRole", response.data.userRole);
                navigate("/dashboard");
              } else if (response.data.message === "Incorrect password") {
                setErrorMessage("Incorrect password");
              } else {
                console.log(response.data.message);
                setErrorMessage("User not Found/ Incorrect email");
              }
            },
            (error) => {
              setErrorMessage(error.response);
            }
          );
      } else {
        setPasswordErrorMessage(
          "Password must contain at least one digit, one lowercase and one uppercase letter, and one special character."
        );
      }
    } else {
      setErrorMessage("All field must be filled");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 6,
          backgroundColor: "#E6EAF4",
          borderRadius: "8px", // Set border radius
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOpenOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
          <Typography color="error">{errorMessage}</Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                href="forget-password"
                variant="body2"
                color="#002575"
                sx={{ fontWeight: "bold" }}
                underline="hover"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Typography variant="span" color="initial">
                Dont have an account?{" "}
              </Typography>
              <Link
                href="/signup"
                variant="body2"
                color="#002575"
                sx={{ fontWeight: "bold" }}
                underline="hover"
              >
                Signup
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
