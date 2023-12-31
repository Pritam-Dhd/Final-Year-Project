import React from "react";
import { Link } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Avatar1 = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    
    navigate("/login");
  };
  return (
    <>
      <Avatar
        alt="Remy Sharp"
        src="/static/images/avatar/1.jpg"
        onClick={handleAvatarClick}
        sx={{ cursor: "pointer" }}
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
        <MenuItem>
          <Link to="/dashboard/profile">Profile</Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Avatar1;
