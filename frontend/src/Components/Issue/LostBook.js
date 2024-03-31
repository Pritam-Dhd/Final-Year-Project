import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  FormControl,
  Box,
  Grid,
  Chip,
  Select,
  Autocomplete,
  InputLabel,
  MenuItem,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SnackBar from "../../Components/SnackBar";
import axiosClient from "../AxiosClient";

const LostBook = ({ onSuccess, data, successMessage }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.post(
        "/book-lost",
        {
          _id: data._id,
          amount,
        },
        { withCredentials: true }
      );
      if (response.data.message) {
        setSnackbarMessage(response.data.message);
        setOpenSnackbar(true);
        setLoading(false);
        onSuccess({
          _id: data._id,
          amount: amount,
        });
        successMessage("Added Fine for lost book successfully");
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: 26, margin: 26 }}>
        <Typography variant="h5">Add fine for the lost book</Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1 }}
          padding={2}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {/* Show Messages */}
      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Container>
  );
};

export default LostBook;
