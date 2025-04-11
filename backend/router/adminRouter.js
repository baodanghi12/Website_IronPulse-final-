import { Router } from "express";
import { getOrderAndPurchase, getTotalProfit } from '../controllers/adminController.js';

const router = Router();
router.get('/order-purchase', getOrderAndPurchase);
router.get('/total-profit', getTotalProfit);
export default router;