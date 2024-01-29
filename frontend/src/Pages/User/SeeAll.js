import React, { useState, useEffect } from "react";
import MuiTable from "../../Components/Table";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  IconButton,
  Container,
  Paper,
  FormControl,
  Box,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import SnackBar from "../../Components/SnackBar";
import DeleteConfirmationDialog  from "../../Components/DeleteDialog";

const SeeAll = ({userData}) => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [role, setRole] = useState("");
  const [editingUserDetails, setEditingUserDetails] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const columns = [
    { id: "image", label: "Image", minWidth: 40 },
    { id: "name", label: "Name", minWidth: 90 },
    { id: "email", label: "Email", minWidth: 170 },
    { id: "phone_no", label: "Phone Number", minWidth: 100 },
    { id: "role", label: "Role", minWidth: 50 },
    { id: "action", label: "Action", minWidth: 50 },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    image: <Avatar alt={user.name} src={`http://localhost:5000/api/images/${user.image}`} />,
    name: user.name,
    phone_no: user.phone_no || "No Number",
    role: user.role.name,
    action: (
      <div>
        <IconButton color="primary" onClick={() => handleEditClick(user._id)}>
          <EditIcon />
        </IconButton>
        {user.email !== "admin@admin.com" && user.email!==userData.email && (
          <IconButton
            sx={{ color: "red" }}
            onClick={() => handleDelete(user._id)}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </div>
    ),
  }));

  const handleDelete = (userId) => {
    setDeletingUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Perform the delete operation
    const response = await axios.post(
      "http://localhost:5000/delete-user",
      {
        _id: deletingUserId,
      },
      { withCredentials: true }
    );

    if (response.data.message === "User deleted successfully") {
      setSnackbarMessage("User deleted successfully");
      setOpenSnackbar(true);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== deletingUserId)
      );
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }

    setDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setDeletingUserId(null);
    setDeleteDialogOpen(false);
  };

  const handleEditClick = (userId) => {
    // Find the user details based on the userId
    const userToEdit = users.find((user) => user._id === userId);
    setRole(userToEdit.role.name);
    // Set the editingUserId and editingUserDetails
    setEditingUserId(userId);
    setEditingUserDetails(userToEdit);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:5000/edit-user",
      {
        _id: editingUserDetails._id,
        name: editingUserDetails.name,
        email: editingUserDetails.email,
        phone_no: editingUserDetails.phone_no,
        userRole: role,
      },
      { withCredentials: true }
    );
    if (response.data.message === "Data is updated") {
      setSnackbarMessage("User updated successfully");
      setOpenSnackbar(true);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editingUserDetails._id
            ? {
                ...user,
                name: editingUserDetails.name,
                email: editingUserDetails.email,
                phone_no: editingUserDetails.phone_no,
                role: { name: role },
              }
            : user
        )
      );
      setEditingUserId(null);
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-all-users", { withCredentials: true })
      .then(function (response) {
        const data = response.data.users;
        setUsers(data);
        console.log(data);
      })
      .catch(function (error) {
        alert(error);
      });
  }, []);

  return (
    <>
      <MuiTable rows={rows} columns={columns} onAddUser={handleAddUser}/>

      {/* Show Messages */}
      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />

      {/* Form to edit user */}
      {editingUserId && (
        <Container maxWidth="xs">
          <Paper elevation={3} style={{ padding: 16, textAlign: "center" }}>
            <Typography variant="h5">Edit User</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Enter full name"
                    name="name"
                    autoComplete="name"
                    value={editingUserDetails.name || ""}
                    onChange={(e) =>
                      setEditingUserDetails((prevDetails) => ({
                        ...prevDetails,
                        name: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="phoneNo"
                    type="number"
                    label="Enter Phone No"
                    name="phoneNo"
                    value={editingUserDetails.phone_no || ""}
                    onChange={(e) =>
                      setEditingUserDetails((prevDetails) => ({
                        ...prevDetails,
                        phone_no: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Enter Email"
                    name="email"
                    autoComplete="email"
                    value={editingUserDetails.email || ""}
                    onChange={(e) =>
                      setEditingUserDetails((prevDetails) => ({
                        ...prevDetails,
                        email: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ width: "100%"}}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Role
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={role}
                      onChange={handleChange}
                      fullWidth
                      label="Age"
                    >
                      <MenuItem value={"Student"}>Student</MenuItem>
                      <MenuItem value={"Librarian"}>Librarian</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                  >
                    Edit User
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    sx={{ color: "white", backgroundColor: "red" }}
                    fullWidth
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      )}
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userId={deletingUserId}
      />
    </>
  );
};

export default SeeAll;
