import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  TextField,
  Typography,
  Grid,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AddNameForm from "../../Components/AddNameForm";
import axiosClient from "../../Components/AxiosClient.js";
import SnackBar from "../../Components/SnackBar";
import DeleteConfirmationDialog from "../../Components/DeleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const SeeAll = ({ userRole }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [genres, setGenres] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingGenreId, setDeletingGenreId] = useState(null);
  const [editingGenreId, setEditingGenreId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal
  const [editGenreName, setEditGenreName] = useState(""); // State to store edited genre name
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleClick = ({ name }) => {
    navigate(`/dashboard/book/filter?filterType=genre&filterValue=${name}`);
  };

  const handleDelete = (genreId) => {
    setDeletingGenreId(genreId);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (genreId) => {
    setEditingGenreId(genreId);
    setEditModalOpen(true); // Open the edit modal when edit button is clicked
    const genre = genres.find((genre) => genre._id === genreId);
    setEditGenreName(genre.name); // Set the name of the genre to be edited
  };

  const handleCancelDelete = () => {
    setDeletingGenreId(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    // Perform the delete operation
    const response = await axiosClient.post(
      "/delete-genre",
      {
        _id: deletingGenreId,
      },
      { withCredentials: true }
    );

    if (response.data.message === "Genre deleted successfully") {
      setSnackbarMessage("Genre deleted successfully");
      setOpenSnackbar(true);
      setGenres((prevGenres) =>
        prevGenres.filter((genre) => genre._id !== deletingGenreId)
      );
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }

    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    axiosClient
      .get("/get-all-genres", { withCredentials: true })
      .then(function (response) {
        const data = response.data.Genres;
        setGenres(data);
        console.log(data);
        setLoading(false);
      })
      .catch(function (error) {
        alert(error);
        setLoading(false)
      });
  }, []);

  const addGenre = async (genreName) => {
    const response = await axiosClient.post(
      "/add-genre",
      { name: genreName },
      { withCredentials: true }
    );
    if (response.data.message === "Genre added successfully") {
      setSnackbarMessage("Genre added successfully!");
      setOpenSnackbar(true);
      setGenres((prevGenres) => [
        ...prevGenres,
        { _id: response.data.id, name: genreName },
      ]);
      handleCloseDialog();
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleSaveEdit = async (genreName) => {
    // Perform the edit operation
    const response = await axiosClient.post(
      "/edit-genre",
      {
        _id: editingGenreId,
        name: genreName,
      },
      { withCredentials: true }
    );

    if (response.data.message === "Genre data is updated successfully") {
      setSnackbarMessage("Genre updated successfully");
      setOpenSnackbar(true);
      setGenres((prevGenres) =>
        prevGenres.map((genre) =>
          genre._id === editingGenreId ? { ...genre, name: genreName } : genre
        )
      );
      setEditModalOpen(false);
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box>
      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
      <Grid container spacing={2} alignItems="center">
        {userRole === "Librarian" && (
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
              fullWidth
              sx={{ marginRight: "10px" }}
            >
              Add Genre
            </Button>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <AddNameForm
                name="Add genre"
                onAdd={addGenre}
                onClose={handleCloseDialog}
              />
            </Dialog>
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={6} lg={6} marginBottom={2}>
          <TextField
            label="Search"
            variant="outlined"
            onChange={handleSearch}
            value={searchTerm}
          />
        </Grid>
      </Grid>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid
          container
          spacing={2}
          sx={{ display: "flex", marginTop: "10px", justifyContent: "center" }}
        >
          {filteredGenres.length > 0 ? (
            filteredGenres.map((genre) => (
              <Button
                sx={{
                  border: "1px solid #ccc",
                  backgroundColor: "#CCCCCD",
                  borderRadius: "8px",
                  padding: "5px",
                  marginBottom: "10px",
                  marginRight: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ padding: "5px", color: "black" }}onClick={() => handleClick(genre)}>
                  {genre.name}
                </Typography>
                {userRole === "Librarian" && (
                  <>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(genre._id)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(genre._id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </Button>
            ))
          ) : (
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              No genre
            </Typography>
          )}
        </Grid>
      )}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        id={deletingGenreId}
        message="Are you sure the you want to delete the genre?"
      />
      <Dialog open={editModalOpen} onClose={handleEditModalClose}>
        <AddNameForm
          name="Edit genre"
          editName={editGenreName}
          onAdd={handleSaveEdit}
          onClose={handleCloseDialog}
        />
      </Dialog>
    </Box>
  );
};

export default SeeAll;
