import { dashboardData } from "../Controller/DashboardController.js";
import { checkAuth } from "../Middleware/CheckAuth.js";
import express from "express";

const router = express.Router();

router.get("/dashboard-data", checkAuth, async (req, res) => {
  try {
    const message = await dashboardData({ userRole: req.userRole, userId:req.userId });
    res.send(message);
  } catch (error) {
    res.send("Error getting dashboard data" + error.message);
    console.log(error);
  }
});

export default router;
