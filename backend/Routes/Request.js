import { addRequest, getRequest, getPendingReqeust  } from "../Controller/RequestController.js";
import { checkAuth } from "../Middleware/CheckAuth.js";
import express from "express";

const router = express.Router();

router.post("/add-request", checkAuth, async (req, res) => {
  try {
    const data = req.body;
    const message = await addRequest({ data, userRole: req.userRole,userId:req.userId });
    res.send(message);
  } catch (error) {
    res.send("Error adding request" + error.message);
    console.log(error);
  }
});

router.get("/get-request", checkAuth, async (req, res) => {
  try {
    const message = await getRequest({ userRole: req.userRole,userId:req.userId });
    res.send(message);
  } catch (error) {
    res.send("Error getting request" + error.message);
    console.log(error);
  }
});

router.get("/get-pending-request", checkAuth, async (req, res) => {
  try {
    const message = await getPendingReqeust({ userRole: req.userRole,userId:req.userId });
    res.send(message);
  } catch (error) {
    res.send("Error getting request" + error.message);
    console.log(error);
  }
});
export default router;
