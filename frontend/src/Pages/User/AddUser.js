import React, { useState } from "react";
import {
  Container,
  Paper,
  FormControl,
  Box,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import SnackBar from "../../Components/SnackBar";
import axios from "axios";

const AddUser = () => {
  const [role, setRole] = useState("Student");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:5000/add-user",
      {
        name: e.target.name.value,
        email: e.target.email.value,
        phone_no: e.target.phoneNo.value,
        userRole: role,
      },
      { withCredentials: true }
    );
    if (response.data.message === "User added successfully") {
      setSnackbarMessage("User added successfully!");
      setOpenSnackbar(true);
      e.target.reset();
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: 16, textAlign: "center" }}>
        <Typography variant="h5">Add User</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Enter full name"
                name="name"
                autoComplete="name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="phoneNo"
                type="number"
                label="Enter Phone No"
                name="phoneNo"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Enter Email"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Role
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={role}
                  onChange={handleChange}
                  autoWidth
                  label="Age"
                >
                  <MenuItem value={"Student"}>Student</MenuItem>
                  <MenuItem value={"Librarian"}>Librarian</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
              >
                Add User
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

export default AddUser;
