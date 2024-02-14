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
import axios from "axios";

const AddEdit = ({ onSuccess, data, successMessage }) => {
  const [formData, setFormData] = useState({
    _id: "",
    book: "",
    user: "",
    issueDate: Date.now(),
    dueDate: null,
    returnedDate: null,
    status: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [booksRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/get-all-books", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/get-all-users", {
            withCredentials: true,
          }),
        ]);

        setBooks(booksRes.data.Books);
        setUsers(usersRes.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleChange = (fieldName, value) => {
    if (fieldName === "book") {
      const selectedBook = books.find((book) => book.name === value);
      if (selectedBook) {
        value = selectedBook._id;
      }
    } else if (fieldName === "user") {
      const selectedUser = users.find((user) => user.name === value);
      if (selectedUser) {
        value = selectedUser._id;
      }
    }
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      formData._id === ""
        ? "http://localhost:5000/add-issue"
        : "http://localhost:5000/edit-issue";
    const response = await axios.post(
      url,
      { ...formData },
      { withCredentials: true }
    );

    if (
      response.data.message === "Issue added successfully" ||
      response.data.message === "Issue updated successfully"
    ) {
      const successMsg =
        formData._id === ""
          ? "Book added successfully"
          : "Book updated successfully";
      setSnackbarMessage(successMsg);
      const bookName = books.find((book) => book._id === formData.book)?.name || '';
      const userName = users.find((user) => user._id === formData.user)?.name || '';
      onSuccess({
        _id: formData._id || response.data.id,
        book: { name: bookName },
        user: { name: userName },
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        returnedDate: formData.returnedDate,
        status: formData.status?formData.status:"Not Returned",
      });
      successMessage(response.data.message);
    } else {
      setSnackbarMessage(response.data.message);
    }
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        style={{ padding: 16, textAlign: "center", margin: 16 }}
      >
        <Typography variant="h5">Add/Edit Issue</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {!formData._id && (
              <>
                <Grid item xs={12}>
                  <Autocomplete
                    id="book-autocomplete"
                    options={books.map((book) => book.name)}
                    required
                    onChange={(e, value) => handleChange("book", value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Book" />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    id="user-autocomplete"
                    options={users
                      .filter((user) => user.role.name === "Student")
                      .map((user) => user.name)}
                    required
                    onChange={(e, value) => handleChange("user", value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Student" />
                    )}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Due Date"
                  name="dueDate"
                  value={formData.dueDate ? dayjs(formData.dueDate) : null}
                  onChange={(date) => handleChange("dueDate", date)}
                  fullWidth
                  required
                  minDate={
                    formData.issueDate ? dayjs(formData.issueDate) : null
                  }
                />
              </LocalizationProvider>
            </Grid>

            {formData._id && (
              <Grid item xs={6}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleChange("status", e.target.value)}
                  required
                >
                  <MenuItem value={"Not Returned"}>Not Returned</MenuItem>
                  <MenuItem value={"Returned"}>Returned</MenuItem>
                </Select>
              </Grid>
            )}
            {formData.status === "Returned" && (
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Returned Date"
                    name="returnedDate"
                    value={
                      formData.returnedDate
                        ? dayjs(formData.returnedDate)
                        : null
                    }
                    onChange={(date) => handleChange("returnedDate", date)}
                    fullWidth
                    required
                    minDate={
                      formData.issueDate ? dayjs(formData.issueDate) : null
                    }
                  />
                </LocalizationProvider>
              </Grid>
            )}
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

export default AddEdit;
