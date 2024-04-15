import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../Components/AxiosClient.js";
import {
  Container,
  Grid,
  Typography,
  Skeleton,
  Box,
  Breadcrumbs,
  IconButton,
  Chip,
  Link,
  Dialog,
  Button,
} from "@mui/material";
import { useUserRole } from "../../Components/UserContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationDialog from "../../Components/DeleteDialog";
import AddEdit from "../../Components/Book/AddEdit";
import SnackBar from "../../Components/SnackBar";
import RelatedBooks from "../../Components/Book/RelatedBooks";

const Book = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const bookId = pathname.split("/")[4];
  const bookName = pathname.split("/")[3];
  const decodedBookName = decodeURIComponent(bookName);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userRole } = useUserRole();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState(null);
  const [request, setRequest] = useState([]);
  const [issue, setIssue] = useState([]);
  const [requestMade, setRequestMade] = useState(false);


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [books, requests,issues] = await Promise.all([
          axiosClient.get(`/get-book-by-id/${bookId}`, {
            withCredentials: true,
          }),
          axiosClient.get("/get-pending-request", {
            withCredentials: true,
          }),
          axiosClient.get("/get-not-returned-issues", {
            withCredentials: true,
          }),
        ]);
        setLoading(false);
        setBook(books.data);
        setRelatedBooks(books.data.relatedBooks);
        setRequest(requests.data.requests);
        setIssue(issues.data.Issues)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  const handleSuccessEditClose = (newBook) => {
    setIsEditOpen(false);
    navigate(`/dashboard/book/${encodeURIComponent(newBook.name)}/${newBook._id}`);
    setBook(newBook);
  };

  const handleSuccessMessage = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleDelete = (id) => {
    setDeletingBookId(id);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setDeletingBookId(null);
    setDeleteDialogOpen(false);
  };
  const handleConfirmDelete = async (id) => {
    try {
      const response = await axiosClient.post(
        "/delete-book",
        { _id: id },
        { withCredentials: true }
      );
      if (response.data.message === "Book deleted successfully") {
        navigate("/dashboard/book");
        handleSuccessMessage("Book deleted successfully");
      } else {
        setSnackbarMessage(response.data.message);
        openSnackbar(true);
      }
    } catch (err) {}
  };

  const handleRequest = async (book) => {
    console.log(book);
    try {
      const response = await axiosClient.post(
        "/add-request",
        {book:book._id,requestType:"request issue"},
        { withCredentials: true }
      );
      if (response.data.message === "Request added successfully") {
        handleSuccessMessage("Request added successfully");
        setRequestMade(true);
        setOpenSnackbar(true); 
      } else {
        setSnackbarMessage(response.data.message);
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              color="inherit"
              href="/dashboard/book"
              style={{
                textDecoration: "none",
              }}
            >
              Book
            </Link>

            <Typography color="text.primary">{decodedBookName}</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12} sm={4}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={400} />
          ) : (
            <Box>
              <img
                src={book?.image}
                alt={book?.name}
                style={{ width: "100%", height: "auto" }}
              />
              {userRole === "Student" ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {book.availableBooks > 0 ? (
                  <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleRequest(book)}
                  disabled={requestMade || 
                    (request.length > 0 && request.some(req => req.book._id === book?._id)) ||
                    (issue.length > 0 && issue.some(iss => iss.book._id === book?._id))
                  }
                >
                  {(requestMade || request.length > 0 && request.some(req => req.book._id === book?._id)) ? "Already Requested" : (issue.length > 0 && issue.some(iss => iss.book._id === book?._id)) ? "Already Issued" : "Request Book"}
                </Button>
                
                  
                  ) : (
                    <Typography variant="body1" color="error">
                      Not Available
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6">
                    Total Books : {book.totalBooks}
                  </Typography>
                  <Typography variant="h6">
                    Available Books : {book.availableBooks}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Grid>
        <Grid item xs={12} sm={8}>
          {loading ? (
            <Box>
              <Skeleton variant="text" width="100%" height={40} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
            </Box>
          ) : (
            <Box>
              <Typography gutterBottom variant="h4" component="div">
                {book.name}
                {userRole === "Librarian" && (
                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(book._id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: "red" }}
                      onClick={() => handleDelete(book._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ marginBottom: "4px" }}
              >
                {book.description}
              </Typography>

              <Typography gutterBottom variant="h6" component="div">
                Genres:
              </Typography>
              {book.genres.length > 0 && book.genres.map((genre, index) => (
                <Link
                  href={`/dashboard/book/filter?filterType=genre&filterValue=${genre}`}
                  style={{ textDecoration: "none", color: "#002575" }}
                >
                  <Chip key={index} label={genre} style={{ margin: "4px" }} />
                </Link>
              ))}
              <Typography gutterBottom variant="h6" component="div">
                <span style={{ fontWeight: "bold" }}>Authors: </span>
              </Typography>
              {book.authors.length > 0 && book.authors.map((author) => (
                <Link
                  href={`/dashboard/book/filter?filterType=genre&filterValue=${author}`}
                  underline="none"
                  color="inherit"
                >
                  <Typography gutterBottom variant="h6" component="div">
                    {author}
                  </Typography>
                </Link>
              ))}
              <Typography gutterBottom variant="h6" component="div">
                <span style={{ fontWeight: "bold" }}>Publishers: </span>
              </Typography>
              {book.publishers.length > 0 && book.publishers.map((publisher) => (
                <Link
                  href={`/dashboard/book/filter?filterType=genre&filterValue=${publisher}`}
                  underline="none"
                  color="inherit"
                >
                  <Typography gutterBottom variant="h6" component="div">
                    {publisher}
                  </Typography>
                </Link>
              ))}
            </Box>
          )}
        </Grid>
        {loading ? (
          <Grid item xs={12} sm={12}>
            <Skeleton variant="rectangular" width="100%" height={100} />
          </Grid>
        ) : (
          <Grid item xs={12} sm={12}>
            <RelatedBooks relatedBooks={relatedBooks} />
          </Grid>
        )}
      </Grid>

      {isEditOpen && (
        <Dialog open={isEditOpen} onClose={handleEditClose}>
          <AddEdit
            data={book}
            onSuccess={handleSuccessEditClose}
            successMessage={handleSuccessMessage}
          />
        </Dialog>
      )}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        id={deletingBookId}
        message="Are you sure the you want to delete the book?"
      />
      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Grid>
  );
};

export default Book;
