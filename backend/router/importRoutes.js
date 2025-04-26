// routes/importRoutes.js
import express from 'express';
import { getAllImports, createImport } from '../controllers/importController.js';

const router = express.Router();
router.get('/', getAllImports);
router.post('/', createImport);


export default router; // <-- Thêm dòng này để dùng "default export"
