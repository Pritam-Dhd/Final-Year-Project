import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  TextField,
  Typography,
  Breadcrumbs,
  Link,
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
import { useNavigate } from "react-router-dom";

const SeeAll = ({ userRole }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAuthorId, setDeletingAuthorId] = useState(null);
  const [editingAuthorId, setEditingAuthorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAuthorName, setEditAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    navigate(`/dashboard/book/filter?filterType=author&filterValue=${name}`);
  };

  const handleDelete = (authorId) => {
    setDeletingAuthorId(authorId);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (authorId) => {
    setEditingAuthorId(authorId);
    setEditModalOpen(true); // Open the edit modal when edit button is clicked
    const author = authors.find((author) => author._id === authorId);
    setEditAuthorName(author.name); // Set the name of the author to be edited
  };

  const handleCancelDelete = () => {
    setDeletingAuthorId(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    // Perform the delete operation
    const response = await axiosClient.post(
      "/delete-author",
      {
        _id: deletingAuthorId,
      },
      { withCredentials: true }
    );

    if (response.data.message === "Author deleted successfully") {
      setSnackbarMessage("Author deleted successfully");
      setOpenSnackbar(true);
      setAuthors((prevAuthors) =>
        prevAuthors.filter((author) => author._id !== deletingAuthorId)
      );
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }

    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    axiosClient
      .get("/get-all-authors", { withCredentials: true })
      .then(function (response) {
        const data = response.data.Authors;
        setAuthors(data);
        console.log(data);
        setLoading(false);
      })
      .catch(function (error) {
        alert(error);
        setLoading(false);
      });
  }, []);

  const addAuthor = async (authorName) => {
    const response = await axiosClient.post(
      "/add-author",
      { name: authorName },
      { withCredentials: true }
    );
    if (response.data.message === "Author added successfully") {
      setSnackbarMessage("Author added successfully!");
      setOpenSnackbar(true);
      setAuthors((prevAuthors) => [
        ...prevAuthors,
        { _id: response.data.id, name: authorName },
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

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleSaveEdit = async (authorName) => {
    // Perform the edit operation
    const response = await axiosClient.post(
      "/edit-author",
      {
        _id: editingAuthorId,
        name: authorName,
      },
      { withCredentials: true }
    );

    if (response.data.message === "Author data is updated successfully") {
      setSnackbarMessage("Author updated successfully");
      setOpenSnackbar(true);
      setAuthors((prevAuthors) =>
        prevAuthors.map((author) =>
          author._id === editingAuthorId
            ? { ...author, name: authorName }
            : author
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
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Authors</Typography>
      </Breadcrumbs>
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
              Add Author
            </Button>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <AddNameForm
                name="Add author"
                onAdd={addAuthor}
                onClose={handleCloseDialog}
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
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid
          container
          spacing={2}
          sx={{ display: "flex", marginTop: "10px", justifyContent: "center" }}
        >
          {filteredAuthors.length > 0 ? (
            filteredAuthors.map((author) => (
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
                <Typography
                  sx={{ padding: "5px", color: "black" }}
                  onClick={() => handleClick(author)}
                >
                  {author.name}
                </Typography>
                {userRole === "Librarian" && (
                  <>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(author._id)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(author._id)}
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
              No author
            </Typography>
          )}
        </Grid>
      )}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        id={deletingAuthorId}
        message="Are you sure the you want to delete the author?"
      />
      <Dialog open={editModalOpen} onClose={handleEditModalClose}>
        <AddNameForm
          name="Edit author"
          editName={editAuthorName}
          onAdd={handleSaveEdit}
          onClose={handleCloseDialog}
        />
      </Dialog>
    </Box>
  );
};

export default SeeAll;
