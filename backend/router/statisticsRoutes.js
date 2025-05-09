// routes/statisticsRoutes.js
import express from 'express';
import { getOrderStatistics, getFlashSaleReport  } from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/orders', getOrderStatistics);
router.get('/flashsale-report', getFlashSaleReport); // ✅ thêm dòng này
export default router;
