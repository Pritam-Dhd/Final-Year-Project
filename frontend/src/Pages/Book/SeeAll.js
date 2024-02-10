import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import SnackBar from "../../Components/SnackBar";
import AddEdit from "../../Components/Book/AddEdit";
import BookCard from "../../Components/Book/BookCard";

const SeeAll = ({ userRole }) => {
  const [books, setBooks] = useState([]);
  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-all-books", { withCredentials: true })
      .then(function (response) {
        const data = response.data.Books;
        setBooks(data);
      })
      .catch(function (error) {
        alert(error);
      });
  }, []);

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
    <Container>
      <Grid container spacing={2} alignItems="center" marginBottom={"10px"}>
        {userRole === "Librarian" && (
          <Grid item xs={12} sm={6} md={3} lg={3} sx={{ marginBottom: "8px" }}>
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
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <TextField
            label="Search"
            variant="outlined"
            onChange={handleSearch}
            value={searchTerm}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={3}
        sx={{ display: "flex", justifyContent: "space-evenly" }}
      >
        {currentItems.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <BookCard
              bookDetail={book}
              userRole={userRole}
              onDelete={handleBookDelete}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination
          showFirstButton
          showLastButton
          count={Math.ceil(filteredBooks.length / itemsPerPage)}
          page={currentPage}
          onChange={(event, page) => paginate(page)}
          color="primary"
        />
      </Box>
      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Container>
  );
};

export default SeeAll;
