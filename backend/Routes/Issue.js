import {
  addIssue,
  editIssue,
  deleteIssue,
  getAllIssues,
  getTotalIssue,
  getIssueByUser,
  lostBook,
} from "../Controller/IssueController.js";
import { checkAuth } from "../Middleware/CheckAuth.js";
import express from "express";

const router = express.Router();

router.post("/add-issue", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await addIssue({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error adding issue" + error.message);
    console.log(error);
  }
});

router.post("/edit-issue", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await editIssue({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error editing issue" + error.message);
    console.log(error);
  }
});

router.post("/delete-issue", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await deleteIssue({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error deleting issue" + error.message);
    console.log(error);
  }
});

router.get("/get-all-issues", checkAuth, async (req, res) => {
  try {
    const message = await getAllIssues({ userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error getting all issues" + error.message);
    console.log(error);
  }
});

router.get("/get-total-issues", checkAuth, async (req, res) => {
  try {
    const message = await getTotalIssue({ userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error deleting issue" + error.message);
    console.log(error);
  }
});

router.get("/get-issue-by-user/:userId", checkAuth, async (req, res) => {
  const userId = req.params.userId;
  try {
    const message = await getIssueByUser({ userId, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error getting issue by user" + error.message);
    console.log(error);
  }
});

router.post("/book-lost", checkAuth, async (req, res) => {
  const data = req.body;
  try {
    const message = await lostBook({ data, userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error editing issue" + error.message);
    console.log(error);
  }
});

export default router;
