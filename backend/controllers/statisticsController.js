// controllers/statisticsController.js
import orderModel from '../models/orderModel.js';

export const getOrderStatistics = async (req, res) => {
  try {
    const orders = await orderModel.find();

    const sales = orders.length;
    const revenue = orders.reduce((sum, order) => sum + order.amount, 0);

    const cost = orders.reduce((sum, order) => {
      const orderCost = order.items.reduce((itemSum, item) => {
        const itemCost = item.cost ? item.cost * item.quantity : item.price * 0.7 * item.quantity;
        return itemSum + itemCost;
      }, 0);
      return sum + orderCost;
    }, 0);

    const profit = revenue - cost;
    const deliveringOrders = await orderModel.countDocuments({ status: 'delivering' });

    res.status(200).json({ sales, revenue, cost, profit, deliveringOrders });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
