const Bill = require('../models/Bill');
const Order = require('../models/Order');

const getTotalProfit = async (req, res) => {
  try {
    const bills = await Bill.find({});
    const orders = await Order.find({});

    let totalRevenue = 0;
    let totalCost = 0;

    // Tính tổng doanh thu và chi phí
    bills.forEach((bill) => {
      totalRevenue += bill.total;

      bill.products.forEach((product) => {
        const cost = product.cost || 0;
        const quantity = product.quantity || 1;
        totalCost += cost * quantity;
      });
    });

    const profit = totalRevenue - totalCost;

    // Tính lợi nhuận theo tháng (MOM) và năm (YOY)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let profitMonth = 0;
    let profitYear = 0;

    bills.forEach((bill) => {
      const createdAt = new Date(bill.createdAt);
      let revenue = bill.total || 0;
      let cost = 0;

      bill.products.forEach((product) => {
        cost += (product.cost || 0) * (product.quantity || 1);
      });

      const thisProfit = revenue - cost;

      if (createdAt.getFullYear() === currentYear) {
        profitYear += thisProfit;

        if (createdAt.getMonth() === currentMonth) {
          profitMonth += thisProfit;
        }
      }
    });

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
