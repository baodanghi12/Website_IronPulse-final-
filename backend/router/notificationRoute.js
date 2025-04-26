import express from 'express';
import { getAllNotifications, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getAllNotifications);
router.put('/:id/read', markAsRead);

export default router;
