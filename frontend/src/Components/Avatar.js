import React from "react";
import { Link } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Avatar1 = ({ userData }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };
  return (
    <>
      <Avatar
        alt={userData.name}
        src={`http://localhost:5000/api/images/${userData.image}`}
        onClick={handleAvatarClick}
        sx={{ cursor: "pointer",border: "1px solid black,", backgroundColor:"#BDBDC0"}}
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
