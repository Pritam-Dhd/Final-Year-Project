import React from "react";
import { Snackbar, Alert as MuiAlert } from "@mui/material";

const SnackBar = ({ open, message, onClose }) => {
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleSnackbarClose}>
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleSnackbarClose}
        severity={message.includes("successfully") ? "success" : "error"}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default SnackBar;
