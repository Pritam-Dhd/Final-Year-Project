import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SnackBar from "../Components/SnackBar";
import axios from "axios";

const defaultTheme = createTheme();

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeStep, setActiveStep] = useState(0); // Step 0: Enter Email, Step 1: Enter Code, Step 2: Set New Password
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    switch (activeStep) {
      case 0:
        setErrorMessage("");
        if (!email) {
          setErrorMessage("Please enter your email.");
          setLoading(false);
          setOpenSnackbar(true);
        }
        const response = await axios.post(
          `${process.env.REACT_APP_API}/password-token`,
          { email: email },
          { withCredentials: true }
        );
        if (response.data.message === "Code sent successfully in the mail") {
          setErrorMessage(response.data.message);
          setOpenSnackbar(true);
          setLoading(false);
          setActiveStep(1);
        } else {
          console.log(response.data.message);
          setErrorMessage(response.data.message);
          setOpenSnackbar(true);
          setLoading(false);
        }
        break;
      case 1:
        setErrorMessage("");
        if (!code) {
          setErrorMessage("Please enter the verification code.");
          setOpenSnackbar(true);
          setLoading(false);
        }
        const response1 = await axios.post(
          `${process.env.REACT_APP_API}/verify-token`,
          { email: email, code: code },
          { withCredentials: true }
        );
        if (response1.data.message === "Token verified successfully") {
          setErrorMessage(response1.data.message);
          setOpenSnackbar(true);
          setLoading(false);
          setActiveStep(2);
        } else {
          setErrorMessage(response1.data.message);
          setOpenSnackbar(true);
          setLoading(false);
        }
        break;
      case 2:
        setErrorMessage("");
        if (!newPassword || !confirmPassword) {
          setErrorMessage(
            "Please enter both new password and confirm password."
          );
          setLoading(false);
          setOpenSnackbar(true);
        }
        if (newPassword !== confirmPassword) {
          setErrorMessage("Passwords do not match.");
          setOpenSnackbar(true);
          setLoading(false);
        }
        if (passwordRegex.test(newPassword)) {
          setErrorMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character."
          );
          setLoading(false);
          setOpenSnackbar(true);
        }
        const response2 = await axios.post(
          `${process.env.REACT_APP_API}/reset-password`,
          { email: email, code: code, password: newPassword, confirmPassword:confirmPassword },
          { withCredentials: true }
        );
        if (response2.data.message === "Password updated successfully") {
          setLoading(false);
          navigate("/login");
        } else {
          setErrorMessage(response2.data.message);
          setOpenSnackbar(true);
          setLoading(false);
        }
        break;
      default:
        break;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container maxWidth="sm" style={{ marginTop: "50px" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Forget Your Password?
          </Typography>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Enter Email</StepLabel>
            </Step>
            <Step>
              <StepLabel>Enter Code</StepLabel>
            </Step>
            <Step>
              <StepLabel>Set New Password</StepLabel>
            </Step>
          </Stepper>
          <form onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <TextField
                label="Enter Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
              />
            )}
            {activeStep === 1 && (
              <TextField
                label="Enter Code"
                variant="outlined"
                fullWidth
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                margin="normal"
              />
            )}
            {activeStep === 2 && (
              <>
                <TextField
                  label="New Password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {showPassword ? (
                          <VisibilityIcon
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <VisibilityOffIcon
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {showConfirmPassword ? (
                          <VisibilityIcon
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            style={{ cursor: "pointer" }}
                          />
                        ) : (
                          <VisibilityOffIcon
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            style={{ cursor: "pointer" }}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "20px" }}
            >
              {loading ? (
                <CircularProgress sx={{ color: 'white' }} size={24} />
              ) : (
                // Show button text based on active step
                <>
                  {activeStep === 0
                    ? "Send Code"
                    : activeStep === 1
                    ? "Verify Code"
                    : "Update Password"}
                </>
              )}
            </Button>
          </form>
          <SnackBar
            open={openSnackbar}
            message={errorMessage}
            onClose={handleSnackbarClose}
          />
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default ForgetPassword;
