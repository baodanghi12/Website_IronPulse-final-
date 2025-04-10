import orderModel from '../models/orderModel.js';
import moment from 'moment';

export const getOrderStatistics = async (req, res) => {
  const { type } = req.query;

  try {
    const orders = await orderModel.find();

    // Nếu có query `type` thì xử lý cho biểu đồ
    if (type === 'weekly' || type === 'monthly' || type === 'yearly') {
      let labels = [];
      let salesData = [];
      let ordersData = [];

      if (type === 'weekly') {
        for (let i = 6; i >= 0; i--) {
          const day = moment().subtract(i, 'days');
          const label = day.format('ddd'); // Mon, Tue...

          const filteredOrders = orders.filter(order =>
            moment(order.createdAt).isSame(day, 'day')
          );

          const totalSales = filteredOrders.reduce((sum, order) => sum + order.amount, 0);

          labels.push(label);
          salesData.push(totalSales);
          ordersData.push(filteredOrders.length);
        }
      }

      if (type === 'monthly') {
        for (let i = 5; i >= 0; i--) {
          const month = moment().subtract(i, 'months');
          const label = month.format('MMM'); // Jan, Feb...

          const filteredOrders = orders.filter(order =>
            moment(order.createdAt).isSame(month, 'month')
          );

          const totalSales = filteredOrders.reduce((sum, order) => sum + order.amount, 0);

          labels.push(label);
          salesData.push(totalSales);
          ordersData.push(filteredOrders.length);
        }
      }

      if (type === 'yearly') {
        for (let i = 4; i >= 0; i--) {
          const year = moment().subtract(i, 'years');
          const label = year.format('YYYY');

          const filteredOrders = orders.filter(order =>
            moment(order.createdAt).isSame(year, 'year')
          );

          const totalSales = filteredOrders.reduce((sum, order) => sum + order.amount, 0);

          labels.push(label);
          salesData.push(totalSales);
          ordersData.push(filteredOrders.length);
        }
      }

      return res.status(200).json({
        labels,
        sales: salesData,
        orders: ordersData
      });
    }

    // Nếu không có `type` thì trả về thống kê tổng quát
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

    const deliveringOrders = await orderModel.countDocuments({
      status: { $regex: /^Order Placed$/i }
    });

    const toBeReceivedOrders = await orderModel.countDocuments({
      status: { $regex: /^Delivered$/i }
    });

    res.status(200).json({
      sales,
      revenue,
      cost,
      profit,
      deliveringOrders,
      toBeReceivedOrders
    });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
