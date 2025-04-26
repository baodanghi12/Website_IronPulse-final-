import orderModel from '../models/orderModel.js';
import moment from 'moment';
import Import from '../models/importModel.js';
import productModel from '../models/productModel.js';

export const getOrderStatistics = async (req, res) => {
  try {
    const { type } = req.query;
    const orders = await orderModel.find();
    const imports = await Import.find();
    const products = await productModel.find();

    // ======== Xử lý cho biểu đồ (nếu có type: weekly / monthly / yearly) ========
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
        orders: ordersData,
      });
    }

    // ======== Xử lý dữ liệu tổng quát cho Dashboard ========
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    const totalCost = imports.reduce((sum, imp) => sum + (imp.totalCost || 0), 0);
    const totalBills = orders.filter(order => order.status === 'Delivered' && order.payment === true).length;
    const profit = revenue - totalCost;

    // Tính Profit MOM
    const thisMonth = moment().month();
    const lastMonth = moment().subtract(1, 'month').month();
    const profitThisMonth = orders.filter(order => moment(order.createdAt).month() === thisMonth)
      .reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    const profitLastMonth = orders.filter(order => moment(order.createdAt).month() === lastMonth)
      .reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    const profitMOM = profitLastMonth === 0 ? profitThisMonth : ((profitThisMonth - profitLastMonth) / profitLastMonth) * 100;

    // Tính Profit YOY
    const thisYear = moment().year();
    const lastYear = moment().subtract(1, 'year').year();
    const profitThisYear = orders.filter(order => moment(order.createdAt).year() === thisYear)
      .reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    const profitLastYear = orders.filter(order => moment(order.createdAt).year() === lastYear)
      .reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    const profitYOY = profitLastYear === 0 ? profitThisYear : ((profitThisYear - profitLastYear) / profitLastYear) * 100;

    // Quantity In Hand
    const quantityInHand = products.reduce((total, product) => {
      const productQuantity = product.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0);
      return total + productQuantity;
    }, 0);

    const toBeReceivedOrders = orders.filter(order => order.status === 'Delivered').length;
    const sales = orders.length;

    // ======== Best Selling Categories (Dùng đúng products) ========
    const productMap = {};

orders.forEach(order => {
  if (order.products && Array.isArray(order.products)) {
    order.products.forEach(product => {
      const title = product.title || 'Unknown';
      const amount = (product.price || 0) * (product.quantity || 0);

      if (!productMap[title]) {
        productMap[title] = {
          title,
          turnOver: 0,
          count: 0,
        };
      }

      productMap[title].turnOver += amount;
      productMap[title].count += product.quantity || 0;
    });
  }
});

const bestSellingCategories = Object.values(productMap)
  .sort((a, b) => b.turnOver - a.turnOver)
  .slice(0, 5)
  .map(p => ({
    title: p.title,
    turnOver: p.turnOver,
    increaseBy: Math.floor(Math.random() * 100), // % tăng trưởng giả lập
  }));

    // Trả kết quả ra
    res.status(200).json({
      revenue,
      totalCost,
      totalOrders,
      totalBills,
      profit,
      profitMOM,
      profitYOY,
      sales,
      quantityInHand,
      toBeReceivedOrders,
      bestSellingCategories,
    });

  } catch (error) {
    console.error('❌ Error getting statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
