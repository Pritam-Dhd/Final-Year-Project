import React, { useState, useEffect } from "react";
import axiosClient from "../../Components/AxiosClient.js";
import {
  Autocomplete,
  Box,
  Grid,
  MenuItem,
  Typography,
  Breadcrumbs,
  TextField,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import SnackBar from "../../Components/SnackBar";
import AddEdit from "../../Components/Book/AddEdit";
import BookCard from "../../Components/Book/BookCard";

const SeeAll = ({ userRole }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    setItemsPerPage(10);
    const fetchData = async () => {
      try {
        const [book, author, genre, publisher] = await Promise.all([
          axiosClient.get("/get-all-books", { withCredentials: true }),
          axiosClient.get("/get-all-authors", { withCredentials: true }),
          axiosClient.get("/get-all-genres", { withCredentials: true }),
          axiosClient.get("/get-all-publishers", { withCredentials: true }),
        ]);
        setBooks(book.data.Books);
        setCategories([
          { name: "Author", types: author.data.Authors },
          { name: "Genre", types: genre.data.Genres },
          { name: "Publisher", types: publisher.data.Publishers },
        ]);
        setLoading(false);
      } catch (error) {
        alert(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    const selectedCategoryTypes =
      categories.find((cat) => cat.name === event.target.value)?.types || [];
    setTypes(selectedCategoryTypes);
  };

  const handleTypeChange = (event, newValue) => {
    setSelectedType(newValue || "");
  };

  const handleSuccessMessage = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleOpenAddEditDialog = () => {
    setOpenAddEditDialog(true);
  };

  const handleCloseAddEditDialog = () => {
    setOpenAddEditDialog(false);
  };

  const handleSuccessCloseAddEditDialog = (newBook) => {
    setOpenAddEditDialog(false);
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const handleBookDelete = (id) => {
    // Remove the deleted book from the list
    const updatedBooks = books.filter((book) => book._id !== id);
    setBooks(updatedBooks);
    setSnackbarMessage("Book deleted successfully");
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleFilter = () => {
    // Filter books based on selected category and type
    let newFilteredBooks = [...books]; // Create a new array to avoid mutation
    if (selectedCategory && selectedType) {
      newFilteredBooks = newFilteredBooks.filter((book) =>
        book[selectedCategory.toLowerCase() + "s"]?.includes(selectedType)
      );
    }
    // Update the state with filtered books
    setFilteredBooks(newFilteredBooks);
    console.log(newFilteredBooks);
  };

  const handleReset = () => {
    // Reset all filters and search term
    setSelectedCategory("");
    setSelectedType("");
    setSearchTerm("");
    setFilteredBooks(books);
  };

  const handleSearchByName = (value) => {
    setSearchTerm(value);
    // Filter books based on search term
    const newFilteredBooks = books.filter((book) =>
      book.name.toLowerCase().includes(value.toLowerCase())
    );
    // Update the state with filtered books
    setFilteredBooks(newFilteredBooks);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Grid container>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Books</Typography>
      </Breadcrumbs>
      <Grid container alignItems="center" spacing={2} marginBottom={3}>
        {userRole === "Librarian" && (
          <Grid
            item
            container
            xs={12}
            sm={6}
            md={2}
            lg={2}
            sx={{ marginBottom: "8px" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenAddEditDialog}
            >
              Add Book
            </Button>
            <Dialog open={openAddEditDialog} onClose={handleCloseAddEditDialog}>
              <AddEdit
                onSuccess={handleSuccessCloseAddEditDialog}
                successMessage={handleSuccessMessage}
              />
            </Dialog>
          </Grid>
        )}
        <Grid item xs={12} sm={3} md={2} lg={2}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3} md={2} lg={2}>
          <FormControl fullWidth variant="outlined">
            <Autocomplete
              fullWidth
              options={types.map((type) => type.name)}
              value={selectedType}
              onChange={handleTypeChange}
              renderInput={(params) => (
                <TextField {...params} label="Type" variant="outlined" />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item container xs={12} sm={3} md={2} lg={2} spacing={2} ml={1}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={handleReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3} md={2} lg={2}>
          <TextField
            label="Search by name"
            variant="outlined"
            onChange={(e) => handleSearchByName(e.target.value)}
            value={searchTerm}
            fullWidth
          />
        </Grid>
      </Grid>
      {loading ? (
        <CircularProgress />
      ) : filteredBooks.length === 0 ? (
        <Typography variant="h6" align="center">
          No books to show.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3} sx={{ display: "flex" }}>
            {currentItems.map((book, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <BookCard
                  bookDetail={book}
                  userRole={userRole}
                  onDelete={handleBookDelete}
                />
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Pagination
              showFirstButton
              showLastButton
              count={Math.ceil(filteredBooks.length / itemsPerPage)}
              page={currentPage}
              onChange={(event, page) => paginate(page)}
              color="primary"
            />
          </Box>
        </>
      )}
      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Grid>
  );
};

export default SeeAll;
