// routes/statisticsRoutes.js
import express from 'express';
import { getOrderStatistics } from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/orders', getOrderStatistics);

export default router;
