import orderModel from '../models/orderModel.js';
import moment from 'moment';

export const getOrderStatistics = async (req, res) => {
  const { type } = req.query;

  try {
    const orders = await orderModel.find();
    
  if (orders.length > 0) {
  }

    if (type === 'weekly' || type === 'monthly' || type === 'yearly') {
      let labels = [];
      let salesData = [];
      let ordersData = [];

      if (type === 'weekly') {
        for (let i = 6; i >= 0; i--) {
          const day = moment().subtract(i, 'days');
          const label = day.format('ddd');
          const filteredOrders = orders.filter(order =>
            moment(order.createdAt).isSame(day, 'day')
          );
          const totalSales = filteredOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
          labels.push(label);
          salesData.push(totalSales);
          ordersData.push(filteredOrders.length);
        }
      }

      if (type === 'monthly') {
        for (let i = 5; i >= 0; i--) {
          const month = moment().subtract(i, 'months');
          const label = month.format('MMM');
          const filteredOrders = orders.filter(order =>
            moment(order.createdAt).isSame(month, 'month')
          );
          const totalSales = filteredOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
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
          const totalSales = filteredOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
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

    // Tổng quát
    const sales = orders.length;
    const revenue = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);

    const cost = orders.reduce((sum, order, index) => {
      if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
        
        return sum;
      }
    
      const orderCost = order.items.reduce((itemSum, item) => {
        const itemCost = item.cost
          ? item.cost * item.quantity
          : item.price * 0.7 * item.quantity;
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
