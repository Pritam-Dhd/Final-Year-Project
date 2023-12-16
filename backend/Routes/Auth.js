import express from "express";
import { Signup, Login } from "../Controller/UsersController.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const data = req.body;
  try {
    const message = await Signup({ data });
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
    res.send(message);
  } catch (error) {
    res.send("Error logging in " + error.message);
    console.log(error);
  }
});

export default router;
