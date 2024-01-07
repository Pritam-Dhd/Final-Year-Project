import express from "express";
import {
  Signup,
  Login,
  getProfile,
  addUser,
  getAllUsers,
  editUser,
  deleteUser,
} from "../Controller/UsersController.js";
import { checkAuth } from "../Middleware/CheckAuth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const data = req.body;
  try {
    const message = await Signup({ data });
    res.cookie("jwt", message.token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
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
    });
    res.send(message);
  } catch (error) {
    res.send("Error logging in " + error.message);
    console.log(error);
  }
});

router.get("/get-profile", async (req, res) => {
  const token = req.cookies.jwt;
  const message = await getProfile({ token });
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
  const userId=data._id
  try {
    const message = await deleteUser({ userId, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error deleting user" + error.message);
    console.log(error);
  }
});

export default router;
