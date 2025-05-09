import orderModel from '../models/orderModel.js';
import moment from 'moment';
import Import from '../models/importModel.js';
import productModel from '../models/productModel.js';
import flashSaleModel from '../models/flashSaleModel.js';
export const getOrderStatistics = async (req, res) => {
  try {
    const { type } = req.query;
    const orders = await orderModel.find();
    const imports = await Import.find();
    const products = await productModel.find();

    // === 1. Nếu có type => trả dữ liệu cho Chart
    if (type === 'weekly' || type === 'monthly' || type === 'yearly') {
      let labels = [];
      let salesData = [];
      let ordersData = [];
      let profitsData = [];

      const calculateProfit = (order) => {
        // Giả sử profit = doanh thu * 0.7 (hoặc bạn có thể tính chính xác hơn dựa vào từng sản phẩm)
        return (order.amount || 0) * 0.7;
      };

      if (type === 'weekly') {
        for (let i = 6; i >= 0; i--) {
          const day = moment().subtract(i, 'days');
          const label = day.format('ddd');

          const filteredOrders = orders.filter(order => moment(order.createdAt).isSame(day, 'day'));
          const totalSales = filteredOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
          const totalProfit = filteredOrders.reduce((sum, order) => sum + calculateProfit(order), 0);

          labels.push(label);
          salesData.push(totalSales);
          ordersData.push(filteredOrders.length);
          profitsData.push(totalProfit);
        }
      }

      if (type === 'monthly') {
        for (let i = 5; i >= 0; i--) {
          const month = moment().subtract(i, 'months');
          const label = month.format('MMM');

          const filteredOrders = orders.filter(order => moment(order.createdAt).isSame(month, 'month'));
          const totalSales = filteredOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
          const totalProfit = filteredOrders.reduce((sum, order) => sum + calculateProfit(order), 0);

          labels.push(label);
          salesData.push(totalSales);
          ordersData.push(filteredOrders.length);
          profitsData.push(totalProfit);
        }
      }

      if (type === 'yearly') {
        for (let i = 4; i >= 0; i--) {
          const year = moment().subtract(i, 'years');
          const label = year.format('YYYY');

          const filteredOrders = orders.filter(order => moment(order.createdAt).isSame(year, 'year'));
          const totalSales = filteredOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
          const totalProfit = filteredOrders.reduce((sum, order) => sum + calculateProfit(order), 0);

          labels.push(label);
          salesData.push(totalSales);
          ordersData.push(filteredOrders.length);
          profitsData.push(totalProfit);
        }
      }

      return res.status(200).json({
        labels,
        sales: salesData,
        orders: ordersData,
        profits: profitsData,
      });
    }

    // === 2. Nếu không có type => trả Dashboard tổng hợp
    const totalOrders = orders.length;
    const revenue = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    const totalCost = imports.reduce((sum, imp) => sum + (Number(imp.totalCost) || 0), 0);
    const totalBills = orders.filter(order => order.status === 'Delivered' && order.payment === true).length;
    const profit = revenue - totalCost;

    const thisMonth = moment().month();
    const lastMonth = moment().subtract(1, 'month').month();
    const ordersThisMonth = orders.filter(order => moment(order.createdAt).month() === thisMonth);
const ordersLastMonth = orders.filter(order => moment(order.createdAt).month() === lastMonth);

const profitThisMonth = ordersThisMonth.reduce((sum, order) => sum + (order.amount || 0), 0)
  - imports.reduce((sum, imp) => moment(imp.createdAt).month() === thisMonth ? sum + (imp.totalCost || 0) : sum, 0);

const profitLastMonth = ordersLastMonth.reduce((sum, order) => sum + (order.amount || 0), 0)
  - imports.reduce((sum, imp) => moment(imp.createdAt).month() === lastMonth ? sum + (imp.totalCost || 0) : sum, 0);

  let profitMOM = 0;
if (profitLastMonth !== 0) {
  profitMOM = ((profitThisMonth - profitLastMonth) / Math.abs(profitLastMonth)) * 100;

  // Giới hạn trong khoảng -999% đến 999%
  profitMOM = Math.max(Math.min(profitMOM, 999), -999);
}



    const thisYear = moment().year();
    const lastYear = moment().subtract(1, 'year').year();
    const profitThisYear = orders.filter(order => moment(order.createdAt).year() === thisYear)
  .reduce((sum, order) => sum + (order.amount || 0), 0)
  - imports.reduce((sum, imp) => moment(imp.createdAt).year() === thisYear ? sum + (imp.totalCost || 0) : sum, 0);

const profitLastYear = orders.filter(order => moment(order.createdAt).year() === lastYear)
  .reduce((sum, order) => sum + (order.amount || 0), 0)
  - imports.reduce((sum, imp) => moment(imp.createdAt).year() === lastYear ? sum + (imp.totalCost || 0) : sum, 0);

const profitYOY = profitLastYear === 0
  ? 0
  : ((profitThisYear - profitLastYear) / Math.abs(profitLastYear)) * 100;

    const quantityInHand = products.reduce((total, product) => {
      const productQuantity = product.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0);
      return total + productQuantity;
    }, 0);

    const toBeReceivedOrders = orders.filter(order => order.status === 'Delivered').length;
    const sales = orders.length;

    // === 3. Best Selling Categories
    const categoryMap = {
      Men: { category: 'Men', turnOver: 0, count: 0 },
      Women: { category: 'Women', turnOver: 0, count: 0 },
      Kids: { category: 'Kids', turnOver: 0, count: 0 },
    };

    orders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          let category = 'Unknown';
          if (item.category) {
            const catLower = item.category.toLowerCase();
            if (catLower.includes('men')) category = 'Men';
            else if (catLower.includes('women')) category = 'Women';
            else if (catLower.includes('kids')) category = 'Kids';
          }

          if (categoryMap[category]) {
            const amount = (item.price || 0) * (item.quantity || 0);
            categoryMap[category].turnOver += amount;
            categoryMap[category].count += item.quantity || 0;
          }
        });
      }
    });

    const bestSellingCategories = Object.values(categoryMap)
      .sort((a, b) => b.count - a.count) // Sắp theo lượng bán
      .map(c => ({
        category: c.category,
        turnOver: c.turnOver,
        count: c.count,
        increaseBy: Math.floor(Math.random() * 100),
      }));

      // === 4. Best Selling Products ===
      const productMap = {};

      orders.forEach(order => {
        if (Array.isArray(order.items)) {
          order.items.forEach(item => {
            const key = item.name || 'Unknown';
      
            if (!productMap[key]) {
              productMap[key] = {
                productName: item.name || 'Unknown',
                productId: item.productId || 'N/A',  // ✅ luôn có productId hoặc 'N/A'
                category: item.category || 'Unknown',
                remainingQuantity: 0,
                turnOver: 0,
                count: 0,
                color: item.colors?.[0] || null,
                price: item.price || 0, // ✅ Thêm dòng này
              };
            }
      
            productMap[key].turnOver += (item.price || 0) * (item.quantity || 0);
            productMap[key].count += item.quantity || 0;
          });
        }
      });
      
      // Merge remaining quantity từ products collection nếu có
      for (const key in productMap) {
        const matchedProduct = products.find(p => p.name === productMap[key].productName);
        if (matchedProduct) {
          productMap[key].remainingQuantity = matchedProduct.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0);
        }
      }
      const totalTurnover = bestSellingCategories.reduce((sum, c) => sum + c.turnOver, 0);
        bestSellingCategories.forEach(c => {
        c.percentage = totalTurnover === 0 ? 0 : parseFloat(((c.turnOver / totalTurnover) * 100).toFixed(1));
      });
      // Trả về top 5 sản phẩm bán chạy
      const bestSellingProducts = Object.values(productMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(product => ({
          ...product,
          increaseBy: Math.floor(Math.random() * 100),
        }));
        
    // === 4. Trả kết quả
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
      bestSellingProducts,
    });

  } catch (error) {
    console.error('❌ Error getting statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getFlashSaleReport = async (req, res) => {
  try {
    const activeFlashSale = await flashSaleModel.findOne({ isActive: true }).populate('products.productId');
    if (!activeFlashSale) return res.status(404).json({ message: 'No active flash sale found' });

    const orders = await orderModel.find({ status: 'Delivered', payment: true });

    const flashSaleData = activeFlashSale.products.map((item) => {
      const product = item.productId;
      const name = product.name || 'Unknown';
      const originalPrice = product.price || 0;
      const salePrice = item.salePrice || 0;
    
      // ✅ Tính số lượng bán từ đơn hàng
      let quantitySold = 0;
      orders.forEach((order) => {
        order.items.forEach((orderedItem) => {
          if (
            orderedItem.productId === product._id.toString() &&
            Math.abs(orderedItem.price - salePrice) < 1
          ) {
            quantitySold += orderedItem.quantity || 0;
          }
        });
      });
    
      return {
        name,
        originalPrice,
        salePrice,
        quantitySold,
        saleRevenue: quantitySold * salePrice,
        timeRange: `${moment(activeFlashSale.startTime).format('DD-MM')} đến ${moment(
          activeFlashSale.endTime
        ).format('DD-MM')}`,
      };
    });
    

    res.json(flashSaleData);
  } catch (err) {
    console.error('❌ Error in getFlashSaleReport:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};



