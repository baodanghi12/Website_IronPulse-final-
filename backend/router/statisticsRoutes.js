// routes/statisticsRoutes.js
import express from 'express';
import { getOrderStatistics, getFlashSaleReport, getStatisticsSummary, getSalesAndOrderChart } from '../controllers/statisticsController.js';

const router = express.Router();
router.get('/chart', getSalesAndOrderChart); // ✅ biểu đồ
router.get('/orders', getOrderStatistics);   // ✅ thống kê đơn hàng chi tiết
router.get('/summary', getStatisticsSummary); // nếu bạn muốn giữ tách riêng

router.get('/flashsale-report', getFlashSaleReport); // ✅ thêm dòng này
export default router;
