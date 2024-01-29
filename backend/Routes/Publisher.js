import {
  addPublisher,
  editPublisher,
  deletePublisher,
  getAllPublishers,
  getTotalPublisher,
} from "../Controller/PublisherController.js";
import { checkAuth } from "../Middleware/CheckAuth.js";
import express from "express";

const router = express.Router();

router.post("/add-publisher", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await addPublisher({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error adding publisher" + error.message);
    console.log(error);
  }
});

router.get("/get-all-publishers", checkAuth, async (req, res) => {
  try {
    const message = await getAllPublishers({ userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error getting all publishers" + error.message);
    console.log(error);
  }
});

router.post("/edit-publisher", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await editPublisher({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error editing publisher" + error.message);
    console.log(error);
  }
});

router.post("/delete-publisher", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await deletePublisher({
      data,
      userRole: req.userRole,
    });
    res.send(message);
  } catch (error) {
    res.send("Error deleting publisher" + error.message);
    console.log(error);
  }
});

router.get("/get-total-publishers", checkAuth, async (req, res) => {
  try {
    const message = await getTotalPublisher({ userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error deleting publisher" + error.message);
    console.log(error);
  }
});

export default router;
