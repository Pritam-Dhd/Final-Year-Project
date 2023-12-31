import express from "express";
import {
  Signup,
  Login,
  getProfile,
  addUser,
} from "../Controller/UsersController.js";

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

router.post("/add-user", async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.send("Please login first");
  }
  const data = req.body;
  try {
    const message = await addUser({ data,token });
    res.send(message);
  } catch (error) {
    res.send("Error adding user" + error.message);
    console.log(error);
  }
});

export default router;
