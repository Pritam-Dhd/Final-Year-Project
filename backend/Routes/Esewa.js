import {handleEsewaSuccess,handleEsewaFailure} from "../Controller/EsewaController.js";
import {paidOnline} from "../Controller/FineController.js";
import { checkAuth } from "../Middleware/CheckAuth.js";
import express from "express";

const router = express.Router();

router.get("/esewa-success",handleEsewaSuccess,paidOnline)

router.get("/esewa-failure",handleEsewaFailure)

export default router;
