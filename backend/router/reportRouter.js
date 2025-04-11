import express from 'express';
import BillModel from '../models/billModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const bills = await BillModel.find({});
    console.log('Bills:', bills);
    const revenue = bills.reduce((acc, bill) => acc + bill.total, 0);
    const cost = bills.reduce((acc, bill) => {
      const productCost = bill.products.reduce((sum, p) => sum + (p.cost * p.qty), 0);
      return acc + productCost;
    }, 0);

    const profitMonth = revenue - cost;
    const profitYear = profitMonth;

    res.json({
      bills,
      orders: bills,
      revenue,
      profitMonth,
      profitYear,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});
  

export default router;
