import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  FormControl,
  Box,
  Grid,
  Chip,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import SnackBar from "../../Components/SnackBar";
import Autocomplete from "@mui/material/Autocomplete";
import axiosClient from "../AxiosClient.js";

const AddEdit = ({ onSuccess, data, successMessage }) => {
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    ISBN: "",
    description: "",
    authors: [],
    genres: [],
    publishers: [],
    publishedYear: [],
    totalBooks: [],
    image: "",
    price:"",
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [genresRes, authorsRes, publishersRes] = await Promise.all([
          axiosClient.get("/get-all-genres", {
            withCredentials: true,
          }),
          axiosClient.get("/get-all-authors", {
            withCredentials: true,
          }),
          axiosClient.get("/get-all-publishers", {
            withCredentials: true,
          }),
        ]);

        setGenres(genresRes.data.Genres);
        setAuthors(authorsRes.data.Authors);
        setPublishers(publishersRes.data.Publishers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      formData._id === ""
        ? "/add-book"
        : "/edit-book";
    const response = await axiosClient.post(
      url,
      { ...formData },
      { withCredentials: true }
    );

    if (
      response.data.message === "Book added successfully" ||
      response.data.message === "Book data is updated successfully"
    ) {
      const successMsg =
        formData._id === ""
          ? "Book added successfully"
          : "Book updated successfully";
      setSnackbarMessage(successMsg);
      onSuccess({
        _id: formData._id || response.data.id,
        name: formData.name,
        ISBN: formData.ISBN,
        description: formData.description,
        authors: formData.authors,
        genres: formData.genres,
        publishers: formData.publishers,
        publishedYear: formData.publishedYear,
        totalBooks: formData.totalBooks,
        image: formData.image,
        price: formData.price,
      });
      successMessage(response.data.message);
      onSuccess(formData);
    } else {
      setSnackbarMessage(response.data.message);
    }
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: 16, textAlign: "center", margin:16  }}>
        <Typography variant="h5">Add/Edit Book</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="ISBN"
                name="ISBN"
                value={formData.ISBN}
                onChange={(e) => handleChange("ISBN", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Autocomplete
                  freeSolo
                  multiple
                  required
                  options={authors.map((author) => author.name)}
                  value={formData.authors}
                  onChange={(e, value) => handleChange("authors", value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Author" />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={index}
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Autocomplete
                  freeSolo
                  multiple
                  required
                  options={genres.map((genre) => genre.name)}
                  value={formData.genres}
                  onChange={(e, value) => handleChange("genres", value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Genre" />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={index}
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Autocomplete
                  freeSolo
                  multiple
                  required
                  options={publishers.map((publisher) => publisher.name)}
                  value={formData.publishers}
                  onChange={(e, value) => handleChange("publishers", value)}
                  renderInput={(params) => (
                    <TextField {...params} label="Publisher" />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={index}
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Image"
                name="Image"
                value={formData.image}
                onChange={(e) => handleChange("image", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Published Year"
                name="published year"
                value={formData.publishedYear}
                onChange={(e) => handleChange("publishedYear", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Total Books"
                name="totalBooks"
                type="number"
                value={formData.totalBooks}
                onChange={(e) => handleChange("totalBooks", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
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

export default AddEdit;
