import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  CardActions,
  IconButton,
  Dialog,
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationDialog from "../../Components/DeleteDialog";
import AddEdit from "./AddEdit";
import SnackBar from "../../Components/SnackBar";
import axiosClient from "../AxiosClient.js";

const BookCard = ({ bookDetail, userRole, onDelete }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentBookDetail, setCurrentBookDetail] = useState(bookDetail);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [encodedBookName, setEncodedBookName] = useState("");

  useEffect(() => {
    setCurrentBookDetail(bookDetail);
    setEncodedBookName(encodeURIComponent(bookDetail.name));
  }, [bookDetail]);

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSuccessEditClose = (newBook) => {
    setIsEditOpen(false);
    setCurrentBookDetail(newBook);
  };

  const handleSuccessMessage = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
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
        onDelete(id);
        handleSuccessMessage("Book deleted successfully");
      } else {
        setSnackbarMessage(response.data.message);
        setOpenSnackbar(true);
      }
    } catch (err) {}
  };

  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Link
          to={`/dashboard/book/${encodedBookName}/${currentBookDetail._id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="250"
              image={currentBookDetail.image}
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="body1" component="div">
                {currentBookDetail.name}
              </Typography>
              {userRole === "Student" ? (
                <Typography gutterBottom variant="subtitle2" component="div">
                  {currentBookDetail.availableBooks > 0
                    ? "Available"
                    : "Not Available"}
                </Typography>
              ) : (
                <Typography gutterBottom variant="subtitle2" component="div">
                  Available Books: {currentBookDetail.availableBooks}
                </Typography>
              )}
            </CardContent>
          </CardActionArea>
        </Link>
        <Box sx={{ marginTop: "auto" }}>
          {userRole === "Librarian" && (
            <CardActions>
              <IconButton
                color="primary"
                onClick={() => handleEditClick(currentBookDetail._id)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                sx={{ color: "red" }}
                onClick={() => handleDelete(currentBookDetail._id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          )}
        </Box>
      </Card>
      <Dialog open={isEditOpen} onClose={handleEditClose}>
        <AddEdit
          data={currentBookDetail}
          onSuccess={handleSuccessEditClose}
          successMessage={handleSuccessMessage}
        />
      </Dialog>
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
    </>
  );
};

export default BookCard;
