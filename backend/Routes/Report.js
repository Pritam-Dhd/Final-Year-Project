import { checkAuth } from "../Middleware/CheckAuth.js";
import express from "express";
import { getReport } from "../Controller/ReportController.js";

const router = express.Router();

router.get("/get-report", checkAuth, async (req, res) => {
  try {
    const { reportName, from, to } = req.query;
    if (req.userRole !== "Librarian") {
      return res.send("You are not authorized to access this route");
    }
    const message = await getReport({
      userRole: req.userRole,
      userId: req.userId,
      reportName,
      from,
      to,
    });
    res.send(message);
  } catch (error) {
    res.send("Error getting report data" + error.message);
    console.log(error);
  }
});

export default router;
