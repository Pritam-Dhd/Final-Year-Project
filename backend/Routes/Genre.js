import {
  addGenre,
  editGenre,
  deleteGenre,
  getAllGenres,
  getTotalGenre,
} from "../Controller/GenreController.js";
import { checkAuth } from "../Middleware/CheckAuth.js";
import express from "express";

const router = express.Router();

router.post("/add-genre", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await addGenre({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error adding genre" + error.message);
    console.log(error);
  }
});

router.get("/get-all-genres", checkAuth, async (req, res) => {
  try {
    const message = await getAllGenres({ userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error getting all genres" + error.message);
    console.log(error);
  }
});

router.post("/edit-genre", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await editGenre({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error editing genre" + error.message);
    console.log(error);
  }
});

router.post("/delete-genre", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await deleteGenre({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error deleting genre" + error.message);
    console.log(error);
  }
});

router.get("/get-total-genres", checkAuth, async (req, res) => {
  try {
    const message = await getTotalGenre({ userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error deleting genre" + error.message);
    console.log(error);
  }
});

export default router;