// ❌ KHÔNG dùng require nữa
import express from 'express';
import {
	getPromotions,
	createPromotion,
	deletePromotion,
	updatePromotion,
	checkPromotion,
} from '../controllers/promotionController.js'; // nhớ thêm đuôi .js

const router = express.Router();

router.get('/', getPromotions);
router.post('/', createPromotion);
router.delete('/:id', deletePromotion);
router.put('/:id', updatePromotion);
router.post('/check', checkPromotion);
export default router; // ✅ đúng chuẩn ES module
