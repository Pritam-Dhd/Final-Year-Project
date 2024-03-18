import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

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
    navigate(`/dashboard/book/filter?filterType=publisher&filterValue=${name}`);
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
    const response = await axiosClient.post(
      "/delete-publisher",
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
    axiosClient
      .get("/get-all-publishers", {
        withCredentials: true,
      })
      .then(function (response) {
        const data = response.data.Publishers;
        setPublishers(data);
        console.log(data);
        setLoading(false);
      })
      .catch(function (error) {
        alert(error);
        setLoading(false);
      });
  }, []);

  const addPublisher = async (publisherName) => {
    const response = await axiosClient.post(
      "/add-publisher",
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
    const response = await axiosClient.post(
      "/edit-publisher",
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
      {loading ? (
        <CircularProgress />
      ) : (
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
                onClick={() => handleClick(publisher)}
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
      )}
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
