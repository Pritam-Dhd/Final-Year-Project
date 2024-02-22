import {
  getAllFines,
  // getUserFines,
  paidFine,
  payFine,
} from "../Controller/FineController.js";
import { checkAuth } from "../Middleware/CheckAuth.js";
import express from "express";

const router = express.Router();

router.get("/get-all-fines", checkAuth, async (req, res) => {
  try {
    const message = await getAllFines({ userRole: req.userRole,userId:req.userId });
    res.send(message);
  } catch (error) {
    res.send("Error getting fines" + error.message);
    console.log(error);
  }
});

// router.get("/get-user-fines/:userId", checkAuth, async (req, res) => {
//   try {
//     const message = await getUserFines({
//       userRole: req.userRole,
//       userId: req.params.userId,
//     });
//     res.send(message);
//   } catch (error) {
//     res.send("Error getting fines" + error.message);
//     console.log(error);
//   }
// });

router.post("/paid-fine", checkAuth, async (req, res) => {
  try {
    const data = req.body;
    const message = await paidFine({ userRole: req.userRole, data });
    res.send(message);
  } catch (error) {
    res.send("Error getting fines" + error.message);
    console.log(error);
  }
});

router.post("/pay-fine", checkAuth, async (req, res) => {
  try {
    const data = req.body;
    const message = await payFine({ data,userRole: req.userRole });
    res.send(message);
  } catch (error) {
    res.send("Error paying fines" + error.message);
    console.log(error);
  }
});

export default router;
