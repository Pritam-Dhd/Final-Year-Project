import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  TextField,
  Typography,
  Grid,
  Box,
  IconButton,
} from "@mui/material";
import AddNameForm from "../../Components/AddNameForm";
import axios from "axios";
import SnackBar from "../../Components/SnackBar";
import DeleteConfirmationDialog from "../../Components/DeleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const SeeAll = ({ userRole }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [publishers, setPublishers] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPublisherId, setDeletingPublisherId] = useState(null);
  const [editingPublisherId, setEditingPublisherId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal
  const [editPublisherName, setEditPublisherName] = useState(""); // State to store edited publisher name

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  const handleDelete = (publisherId) => {
    setDeletingPublisherId(publisherId);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (publisherId) => {
    setEditingPublisherId(publisherId);
    setEditModalOpen(true); // Open the edit modal when edit button is clicked
    const publisher = publishers.find(
      (publisher) => publisher._id === publisherId
    );
    setEditPublisherName(publisher.name); // Set the name of the publisher to be edited
  };

  const handleCancelDelete = () => {
    setDeletingPublisherId(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    // Perform the delete operation
    const response = await axios.post(
      "http://localhost:5000/delete-publisher",
      {
        _id: deletingPublisherId,
      },
      { withCredentials: true }
    );

    if (response.data.message === "Publisher deleted successfully") {
      setSnackbarMessage("Publisher deleted successfully");
      setOpenSnackbar(true);
      setPublishers((prevPublishers) =>
        prevPublishers.filter(
          (publisher) => publisher._id !== deletingPublisherId
        )
      );
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }

    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-all-publishers", {
        withCredentials: true,
      })
      .then(function (response) {
        const data = response.data.Publishers;
        setPublishers(data);
        console.log(data);
      })
      .catch(function (error) {
        alert(error);
      });
  }, []);

  const addPublisher = async (publisherName) => {
    const response = await axios.post(
      "http://localhost:5000/add-publisher",
      { name: publisherName },
      { withCredentials: true }
    );
    if (response.data.message === "Publisher added successfully") {
      setSnackbarMessage("Publisher added successfully!");
      setOpenSnackbar(true);
      setPublishers((prevPublishers) => [
        ...prevPublishers,
        { _id: response.data.id, name: publisherName },
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

  const filteredPublishers = publishers.filter((publisher) =>
    publisher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleSaveEdit = async (publisherName) => {
    // Perform the edit operation
    const response = await axios.post(
      "http://localhost:5000/edit-publisher",
      {
        _id: editingPublisherId,
        name: publisherName,
      },
      { withCredentials: true }
    );

    if (response.data.message === "Publisher data is updated successfully") {
      setSnackbarMessage("Publisher updated successfully");
      setOpenSnackbar(true);
      setPublishers((prevPublishers) =>
        prevPublishers.map((publisher) =>
          publisher._id === editingPublisherId
            ? { ...publisher, name: publisherName }
            : publisher
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
              Add Publisher
            </Button>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <AddNameForm
                name="Add publisher"
                onAdd={addPublisher}
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
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", marginTop: "10px", justifyContent: "center" }}
      >
        {filteredPublishers.length > 0 ? (
          filteredPublishers.map((publisher) => (
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
              <Typography sx={{ padding: "5px", color: "black" }}>
                {publisher.name}
              </Typography>
              {userRole === "Librarian" && (
                <>
                  <IconButton
                    onClick={() => handleEdit(publisher._id)}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(publisher._id)}
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
            No publisher
          </Typography>
        )}
      </Grid>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userId={deletingPublisherId}
      />
      <Dialog open={editModalOpen} onClose={handleEditModalClose}>
        <AddNameForm
          name="Edit publisher"
          editName={editPublisherName}
          onAdd={handleSaveEdit}
          onClose={handleCloseDialog}
        />
      </Dialog>
    </Box>
  );
};

export default SeeAll;
