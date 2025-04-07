import { Router } from "express";
import { getTotalProfit } from "../controllers/adminController";

const router = Router();

router.get('.total-profit', getTotalProfit);