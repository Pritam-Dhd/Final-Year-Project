import React, { useState, useEffect } from "react";
import axiosClient from "../../Components/AxiosClient.js";
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
import SnackBar from "../../Components/SnackBar";
import { useUserRole } from "../../Components/UserContext";
import MuiTable from "../../Components/Table";

const StudentRequest = () => {
  const [requestBook, setRequestBook] = useState([]);
  const [requestRenew, setRequestRenew] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    axiosClient
      .get("/get-all-users", { withCredentials: true })
      .then(function (response) {
        const data = response.data.users;
        console.log(data);
      })
      .catch(function (error) {
        alert(error);
      });
  }, []);

  
  return (
    <Grid container spacing={2}>
      <Grid item></Grid>
      <Grid item></Grid>

      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </Grid>
  );
};

export default StudentRequest;
