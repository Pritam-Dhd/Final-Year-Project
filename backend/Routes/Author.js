import {
  addAuthor,
  editAuthor,
  deleteAuthor,
  getAllAuthors,
  getTotalAuthor,
} from "../Controller/AuthorController.js";
import { checkAuth } from "../Middleware/CheckAuth.js";
import express from "express";

const router = express.Router();

router.post("/add-author", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await addAuthor({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error adding author" + error.message);
    console.log(error);
  }
});

router.get("/get-all-authors", checkAuth, async (req, res) => {
  try {
    const message = await getAllAuthors({ userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error getting all authors" + error.message);
    console.log(error);
  }
});

router.post("/edit-author", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await editAuthor({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error editing author" + error.message);
    console.log(error);
  }
});

router.post("/delete-author", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await deleteAuthor({data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error deleting author" + error.message);
    console.log(error);
  }
});

router.get("/get-total-authors", checkAuth, async (req, res) => {
  try {
    const message = await getTotalAuthor({ userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error deleting author" + error.message);
    console.log(error);
  }
});

export default router;
