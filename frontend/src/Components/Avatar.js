import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SnackBar from "./SnackBar";

const Avatar1 = ({ userData }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleProfileClick = () => {
    handleMenuClose();
  };

  const handleLogout = async () => {
    const response = await axios.post(
      "http://localhost:5000/logout",
      {},
      { withCredentials: true }
    );
    if (response.data.message === "User logged out successfully") {
      localStorage.removeItem("userRole");
      navigate("/login");
    } else {
      setSnackbarMessage(response.data.message);
      setOpenSnackbar(true);
    }
  };
  return (
    <>
      <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
      <Avatar
        alt={userData.name}
        src={`http://localhost:5000/api/images/${userData.image}`}
        onClick={handleAvatarClick}
        sx={{
          cursor: "pointer",
          border: "1px solid black,",
          backgroundColor: "#BDBDC0",
        }}
        endIcon={
          <IconButton
            onClick={handleAvatarClick}
            color="inherit"
            sx={{ cursor: "pointer" }}
          ></IconButton>
        }
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfileClick}>
          <Link
            to="/dashboard/profile"
            style={{ color: "black", textDecoration: "none" }}
          >
            Profile
          </Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default Avatar1;
