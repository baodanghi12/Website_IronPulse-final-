const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// Route tính tổng lợi nhuận
router.get('/total-profit', billController.getTotalProfit);

module.exports = router;
