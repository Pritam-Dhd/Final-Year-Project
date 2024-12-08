import express from "express";
import {
  Signup,
  Login,
  getProfile,
  editProfile,
  changePassword,
  addUser,
  getAllUsers,
  editUser,
  deleteUser,
  getTotalUser,
  passwordToken,
  verifyToken,
  resetPassword,
} from "../Controller/UsersController.js";
import { checkAuth } from "../Middleware/CheckAuth.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.resolve(__dirname, "..", "Pictures");
    console.log(destinationPath);
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/signup", async (req, res) => {
  const data = req.body;
  try {
    const message = await Signup({ data });
    res.cookie("jwt", message.token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    res.send(message);
  } catch (error) {
    res.send("Error signing up" + error.message);
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  const data = req.body;
  try {
    const message = await Login({ data });
    res.cookie("jwt", message.token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    res.send(message);
  } catch (error) {
    res.send("Error logging in " + error.message);
    console.log(error);
  }
});

router.post("/logout", async (req, res) => {
  try {
    // Clear the JWT cookie to sign the user out
    res.clearCookie("jwt");
    res.send({ message: "User logged out successfully" });
  } catch (error) {
    res.send("Error logging out " + error.message);
    console.log(error);
  }
});

router.get("/get-profile", checkAuth, async (req, res) => {
  const token = req.cookies.jwt;
  try {
    const message = await getProfile({ token });
    res.clearCookie("jwt");
    res.cookie("jwt", message.token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    res.send(message);
  } catch (error) {
    res.send(error.message);
  }
});

router.post(
  "/edit-profile",
  upload.single("image"),
  checkAuth,
  async (req, res) => {
    const token = req.cookies.jwt;
    const data = req.body;
    const file = req.file; // Retrieve the uploaded file
    try {
      const message = await editProfile({ token, data, file });
      res.send(message);
    } catch (error) {
      res.send(error.message);
    }
  }
);

router.post("/change-password", checkAuth, async (req, res) => {
  const token = req.cookies.jwt;
  const data = req.body;
  try {
    const message = await changePassword({ token, data });
    res.send(message);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/add-user", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await addUser({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error adding user" + error.message);
    console.log(error);
  }
});

router.get("/get-all-users", checkAuth, async (req, res) => {
  try {
    const message = await getAllUsers({ userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error getting all users" + error.message);
    console.log(error);
  }
});

router.post("/edit-user", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await editUser({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error editing user" + error.message);
    console.log(error);
  }
});

router.post("/delete-user", checkAuth, async (req, res) => {
  const data = req.body;
  const userId = data._id;
  try {
    const message = await deleteUser({ userId, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error deleting user" + error.message);
    console.log(error);
  }
});

router.get("/get-total-users", checkAuth, async (req, res) => {
  try {
    const message = await getTotalUser({ userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error deleting user" + error.message);
    console.log(error);
  }
});

router.post("/password-token", async (req, res) => {
  try {
    const data = req.body;
    const message = await passwordToken({ data });
    res.send(message);
  } catch (error) {
    res.send("Error generating token" + error.message);
    console.log(error);
  }
});

router.post("/verify-token", async (req, res) => {
  try {
    const data = req.body;
    const message = await verifyToken({ data });
    res.send(message);
  } catch (error) {
    res.send("Error veryfing" + error.message);
    console.log(error);
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const data = req.body;
    const message = await resetPassword({ data });
    res.send(message);
  } catch (error) {
    res.send("Error reseting password" + error.message);
    console.log(error);
  }
});

export default router;
