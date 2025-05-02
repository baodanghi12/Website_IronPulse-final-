import express from "express";
import { createFlashSale, getActiveFlashSale, toggleFlashSaleStatus, removeProductFromSale,
    clearAllFlashSale } from "../controllers/flashSaleController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/create", adminAuth, createFlashSale);
router.get("/active", getActiveFlashSale);
router.post("/toggle", adminAuth, toggleFlashSaleStatus);
// DELETE /api/flashsale/remove/:productId
router.delete('/remove/:productId', adminAuth, removeProductFromSale);

// DELETE /api/flashsale/clear
router.delete('/clear', adminAuth, clearAllFlashSale);


export default router;
