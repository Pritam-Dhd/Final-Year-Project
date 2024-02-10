import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  CardActionArea,
  CardActions,
  IconButton,
  Dialog,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationDialog from "../../Components/DeleteDialog";
import AddEdit from "./AddEdit";
import SnackBar from "../../Components/SnackBar";
import axios from "axios";

const BookCard = ({ bookDetail, userRole, onDelete }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentBookDetail, setCurrentBookDetail] = useState(bookDetail);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState(null);

  useEffect(() => {
    setCurrentBookDetail(bookDetail);
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
    try{
      const response= await axios.post(
        "http://localhost:5000/delete-book",
        { _id:id },
        { withCredentials: true }
      );
      if(response.data.message==="Book deleted successfully"){
        onDelete(id);
        handleSuccessMessage("Book deleted successfully");
      }
      else{
        setSnackbarMessage(response.data.message);
        openSnackbar(true);
      }
    }
    catch(err){

    }
  };

  return (
    <>
    <Card sx={{ maxWidth: 400 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="340"
          image={currentBookDetail.image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {currentBookDetail.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: "4px" }}
          >
            {currentBookDetail.description.slice(0, 100)}
            {/* Shortened description */}
            {currentBookDetail.description.length > 100 ? (
              <span>
                ...{" "}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ fontWeight: "bold" }}
                >
                  <a href="/">See more</a>
                </Typography>
              </span>
            ) : (
              ""
            )}
          </Typography>
          {currentBookDetail.genres && currentBookDetail.genres.length > 0 && (
            <div>
              <Typography gutterBottom variant="h6" component="div">
                Genres:
              </Typography>
              {currentBookDetail.genres.map((genre, index) => (
                <Chip key={index} label={genre} style={{ margin: "4px" }} />
              ))}
            </div>
          )}
          {currentBookDetail.authors && currentBookDetail.authors.length > 0 && (
            <div>
              <Typography gutterBottom variant="h6" component="div">
                <span style={{ fontWeight: "bold" }}>Authors: </span>
              </Typography>
              {currentBookDetail.authors.map((author, index) => (
                <Typography gutterBottom variant="h6" component="div">
                  {author}
                </Typography>
              ))}
            </div>
          )}
          {currentBookDetail.publishers && currentBookDetail.publishers.length > 0 && (
            <div>
              <Typography gutterBottom variant="h6" component="div">
                <span style={{ fontWeight: "bold" }}>Publishers: </span>{" "}
              </Typography>
              {currentBookDetail.publishers.map((publisher, index) => (
                <Typography gutterBottom variant="h6" component="div">
                  {publisher}
                </Typography>
              ))}
            </div>
          )}
        </CardContent>
      </CardActionArea>
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
      {isEditOpen && (
        <Dialog open={isEditOpen} onClose={handleEditClose}>
          <AddEdit data={currentBookDetail} onSuccess={handleSuccessEditClose} successMessage={handleSuccessMessage}/>
      </Dialog>
      )}
    </Card>
    <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userId={deletingBookId}
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
