import React, { useState, useEffect } from "react";
import axiosClient from "../../Components/AxiosClient.js";
import {
  IconButton,
  Container,
  Paper,
  Box,
  Grid,
  MenuItem,
  Typography,
  TextField,
  Button,
  Dialog,
  CircularProgress,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import SnackBar from "../../Components/SnackBar";
import BookCard from "../../Components/Book/BookCard";
import { useUserRole } from "../../Components/UserContext";

const FilterBook = () => {
  const [books, setBooks] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { userRole } = useUserRole();
  const queryParams = new URLSearchParams(window.location.search);
  const filterType = queryParams.get("filterType");
  const filterValue1 = queryParams.get("filterValue");
  const filterValue = decodeURI(filterValue1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get(
        `/filter-books?filterType=${filterType}&filterValue=${filterValue}`,
        { withCredentials: true }
      )
      .then(function (response) {
        const data = response.data.Books;
        setBooks(data);
        setLoading(false);
      })
      .catch(function (error) {
        alert(error);
        setLoading(false);
      });
  }, []);

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={6} lg={6} marginBottom={3}>
          <TextField
            label="Search"
            variant="outlined"
            onChange={handleSearch}
            value={searchTerm}
          />
        </Grid>
      {loading ? (
          <CircularProgress />
      ) : (
      <>
      {currentItems.length > 0 ? (
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
      ) : (
        <Typography variant="h5" align="center" mt={4}>
          No Books of this {filterType}
        </Typography>
      )}
      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
      </>)}
    </Grid>
  );
};

export default FilterBook;
