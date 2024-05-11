import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Container,
  Grid,
  Breadcrumbs,
  Typography,
  IconButton,
} from "@mui/material";
import axiosClient from "../../Components/AxiosClient.js";
import SnackBar from "../../Components/SnackBar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Profile = ({ userData, updateUserData }) => {
  const [displayedForm, setDisplayedForm] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [editedImage, setEditedImage] = useState("");
  const [Image, setImage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (editMode) {
      setEditedData(userData);
    }
  }, [editMode, userData]);

  useEffect(() => {
    setEditedImage(`http://localhost:5000/api/images/${userData.image}`);
  }, [userData.image]);

  const handleEditClick = () => {
    setDisplayedForm("profile");
    setEditMode(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCancelClick = () => {
    setDisplayedForm(null);
    setEditMode(false);
    setEditedData(userData);
    setEditedImage(`http://localhost:5000/api/images/${userData.image}`);
    setImage(null);
  };

  const handleSaveClick = async () => {
    try {
      let formData = new FormData();

      // Append editedData fields to the formData
      Object.keys(editedData).forEach((key) => {
        formData.append(key, editedData[key]);
      });

      // Append editedImage to the formData
      if (Image) {
        formData.append("image", Image);
      }

      const response = await axiosClient.post("/edit-profile", formData, {
        withCredentials: true,
      });

      if (response.data.message === "Profile edited successfully!") {
        updateUserData({
          ...userData, // Copy existing data
          ...editedData,
          image: response.data.imageUrl, // Update with edited data
        });
        setSnackbarMessage("Profile edited successfully!");
        setDisplayedForm(null);
        setEditMode(false);
        setEditedImage(`http://localhost:5000/api/images/${editedData.image}`);
        setImage(null);
      } else {
        setSnackbarMessage(response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      // Display an error message or prevent further processing
      setSnackbarMessage("Please select an image file.");
      setOpenSnackbar(true);
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedImage(reader.result);
        setImage(file);
        setEditedData((prevData) => ({
          ...prevData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTogglePasswordVisibility = (field) => {
    switch (field) {
      case "password":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmPassword":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleChangePasswordClick = () => {
    setDisplayedForm("password");
  };

  const handleCancelPasswordClick = () => {
    setDisplayedForm(null);
    setPasswordData({
      password: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSavePasswordClick = async () => {
    if (
      !passwordData.password ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setSnackbarMessage("Please fill in all password fields.");
      setOpenSnackbar(true);
      return;
    }
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setSnackbarMessage(
        "Password must be at least 8 characters long and contain uppercase, lowrcase, symbol and number."
      );
      setOpenSnackbar(true);
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbarMessage("New password and confirm password do not match.");
      setOpenSnackbar(true);
      return;
    }
    try {
      const response = await axiosClient.post(
        "/change-password",
        passwordData,
        {
          withCredentials: true,
        }
      );

      if (response.data.message === "Changed password successfully") {
        setSnackbarMessage("Password changed successfully");
        setOpenSnackbar(true);
        setDisplayedForm(null);
        setPasswordData({
          password: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setSnackbarMessage(response.data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    // <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}textAlign="start">
          <Breadcrumbs aria-label="breadcrumb" ml={2} mt={2}>
            <Typography color="text.primary">Profile</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12} md={4} textAlign="center">
          <Avatar
            alt={editMode ? editedData.name : userData.name}
            src={
              editMode
                ? editedImage
                : `http://localhost:5000/api/images/${userData.image}`
            }
            sx={{
              width: { xs: 180, md: 300, lg: 320 },
              height: { xs: 180, md: 300, lg: 320 },
              border: "1px solid black",
              backgroundColor: "#BDBDC0",
            }}
          />
        </Grid>
        <Grid item xs={12} md={8} textAlign="left">
          <Box mt={2}>
            <div style={{ marginBottom: "10px" }}>
              <strong>Name:</strong> {userData.name}
            </div>
            <div style={{ marginBottom: "10px" }}>
              <strong>Email:</strong> {userData.email}
            </div>
            <div>
              <strong>Phone No:</strong> {userData.phone_no}
            </div>
          </Box>
          {displayedForm === "profile" && (
            <form>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="upload-image"
                onChange={handleImageChange}
              />
              <label htmlFor="upload-image">
                <Button variant="contained" component="span" sx={{ mt: 2 }}>
                  Change Picture
                </Button>
              </label>
              <TextField
                label="Name"
                name="name"
                value={editedData.name || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: Boolean(editedData.name),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="phoneNo"
                type="number"
                value={editedData.phone_no || ""}
                onChange={handleInputChange}
                label="Enter Phone No"
                name="phone_no"
                InputLabelProps={{
                  shrink: Boolean(editedData.phone_no),
                }}
              />

              {/* <TextField
                label="Email"
                name="email"
                value={editedData.email || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: Boolean(editedData.email),
                }}
              /> */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveClick}
                sx={{ mt: 2 }}
              >
                Save
              </Button>
              <Button
                color="secondary"
                onClick={handleCancelClick}
                sx={{ mt: 2, ml: 2 }}
              >
                Cancel
              </Button>
            </form>
          )}
          {displayedForm === "password" && (
            <form>
              {/* Add input fields for current password, new password, and confirm password */}
              <TextField
                label="Current Password"
                name="password"
                type={showCurrentPassword ? "text" : "password"}
                onChange={handlePasswordInputChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => handleTogglePasswordVisibility("password")}
                      edge="end"
                    >
                      {showCurrentPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                label="New Password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                onChange={handlePasswordInputChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        handleTogglePasswordVisibility("newPassword")
                      }
                      edge="end"
                    >
                      {showNewPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                onChange={handlePasswordInputChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        handleTogglePasswordVisibility("confirmPassword")
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSavePasswordClick}
                sx={{ mt: 2 }}
              >
                Save Password
              </Button>
              <Button
                color="secondary"
                onClick={handleCancelPasswordClick}
                sx={{ mt: 2, ml: 2 }}
              >
                Cancel
              </Button>
            </form>
          )}
          {!displayedForm && (
            <>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleEditClick}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
              </div>
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleChangePasswordClick}
                  sx={{ mt: 2 }}
                >
                  Change Password
                </Button>
              </div>
            </>
          )}
        </Grid>
        <SnackBar
        open={openSnackbar}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
      </Grid>

      
    // </Container>
  );
};

export default Profile;
