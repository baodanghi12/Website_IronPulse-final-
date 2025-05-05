const Bill = require('../models/Bill');
const Order = require('../models/Order');
const Product = require('../models/Product'); // Thêm dòng này

const getTotalProfit = async (req, res) => {
  try {
    const bills = await Bill.find({});
    const orders = await Order.find({});

    let totalRevenue = 0;
    let totalCost = 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let profitMonth = 0;
    let profitYear = 0;

    for (const bill of bills) {
      const billRevenue = bill.amount || 0;
      totalRevenue += billRevenue;

      let billCost = 0;

      for (const item of bill.items) {
        if (!item.productId) continue;

        const product = await Product.findById(item.productId);
        const cost = product?.cost || 0;
        billCost += cost * item.quantity;
      }

      totalCost += billCost;
      const billProfit = billRevenue - billCost;

      const createdAt = new Date(bill.createdAt);
      if (createdAt.getFullYear() === currentYear) {
        profitYear += billProfit;
        if (createdAt.getMonth() === currentMonth) {
          profitMonth += billProfit;
        }
      }
    }

    const profit = totalRevenue - totalCost;

    res.json({
      bills,
      orders,
      revenue: totalRevenue,
      profit,
      profitMonth,
      profitYear,
    });
  } catch (err) {
    console.error('Lỗi khi tính toán lợi nhuận:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTotalProfit,
};
