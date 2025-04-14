// ❌ KHÔNG dùng require nữa
import express from 'express';
import {
	getPromotions,
	createPromotion,
	deletePromotion,
	updatePromotion,
} from '../controllers/promotionController.js'; // nhớ thêm đuôi .js

const router = express.Router();

router.get('/', getPromotions);
router.post('/', createPromotion);
router.delete('/:id', deletePromotion);
router.put('/:id', updatePromotion);

export default router; // ✅ đúng chuẩn ES module
