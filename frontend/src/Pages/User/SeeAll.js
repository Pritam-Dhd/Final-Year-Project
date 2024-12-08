import React, { useState, useEffect } from "react";
import axiosClient from "../../Components/AxiosClient.js";
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
  Breadcrumbs,
  Dialog,
  Button,
  LinearProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SnackBar from "../../Components/SnackBar";
import DeleteConfirmationDialog from "../../Components/DeleteDialog";
import AddUser from "./AddUser.js";
import TableToolbar from "../../Components/TableToolbar";
import { useUserRole } from "../../Components/UserContext";

const SeeAll = ({ userData }) => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [role, setRole] = useState("");
  const [editingUserDetails, setEditingUserDetails] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const { userRole } = useUserRole();
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log(editingUserId);

  const handleAddUser = (newUser) => {
    newUser.imageLink = "Windows_10_Default_Profile_Picture.png";
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenEditDialog = (id) => {
    setEditDialogOpen(true);
    handleEditClick(id);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 120,
      renderCell: (params) => (
        <Avatar
          alt={params.row.name}
          src={`http://localhost:5000/api/images/${params.row.imageLink}`}
        />
      ),
    },
    { field: "name", headerName: "Name", width: 300 },
    { field: "email", headerName: "Email", width: 400 },
    { field: "phone_no", headerName: "Phone Number", width: 200 },
    { field: "role", headerName: "Role", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleOpenEditDialog(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          {params.row.email !== "admin@admin.com" &&
            params.row.email !== userData.email && (
              <IconButton
                sx={{ color: "red" }}
                onClick={() => handleDelete(params.row.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
        </div>
      ),
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    imageLink: user.image,
    name: user.name,
    phone_no: user.phone_no || "No Number",
    role: user.role.name,
  }));

  const handleDelete = (userId) => {
    setDeletingUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    // Perform the delete operation
    const response = await axiosClient.post(
      "/delete-user",
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
    setEditDialogOpen(false);
  };

  const handleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axiosClient.post(
      "/edit-user",
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
      setEditDialogOpen(false);
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    axiosClient
      .get("/get-all-users", { withCredentials: true })
      .then(function (response) {
        const data = response.data.users;
        setUsers(data);
        setLoading(false);
      })
      .catch(function (error) {
        alert(error);
      });
  }, []);

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Breadcrumbs aria-label="breadcrumb" ml={2} mt={2}>
        <Typography color="text.primary">User</Typography>
      </Breadcrumbs>
      {userRole === "Librarian" && (
        <Button
          sx={{ marginTop: "15px", marginLeft: "15px", marginBottom: "15px" }}
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
        >
          Add User
        </Button>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <AddUser onSuccess={handleAddUser} />
      </Dialog>
      <Box
        sx={{
          overflow: "auto",
          height: "460px",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pagination={{ pageSize: 10 }}
          loading={loading} // Use the loading state
          // getRowHeight={() => "auto"}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            // sorting: {
            //   sortModel: [{ field: "dueDate", sort: "desc" }],
            // },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          slots={{
            toolbar: () => <TableToolbar filename="Issued Books" />,
            loadingOverlay: LinearProgress,
          }}
        />
      </Box>

      {/* <MuiTable rows={rows} columns={columns} onAddUser={handleAddUser}/> */}

      {/* Show Messages */}
      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <Container maxWidth="xs">
          <Paper
            elevation={3}
            style={{ padding: 16, textAlign: "center", margin: "20px" }}
          >
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
                  <FormControl sx={{ width: "100%" }}>
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
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        id={deletingUserId}
        message="Are you sure the you want to delete the user?"
      />
    </Paper>
  );
};

export default SeeAll;
