import orderModel from '../models/orderModel.js';
import moment from 'moment';
import Import from '../models/importModel.js';
import productModel from '../models/productModel.js';
import flashSaleModel from '../models/flashSaleModel.js';
import BillModel from '../models/BillModel.js'; 
export const getOrderStatistics = async (req, res) => {
  try {
    const { type, range, date } = req.query;
    const orders = await orderModel.find();
    const imports = await Import.find();
    const targetDate = date ? moment(date) : moment();
    const products = await productModel.find();
    const bills = await BillModel.find();

    // === 1. Nếu có type => trả dữ liệu biểu đồ (Chart)
    if (type === 'weekly' || type === 'monthly' || type === 'yearly') {
      const labels = [];
      const salesData = [];
      const profitsData = [];
      const ordersData = [];
      
      const getLabel = (date, formatType) => {
        if (formatType === 'weekly') return moment(date).format('ddd');
        if (formatType === 'monthly') return moment(date).format('D');
        if (formatType === 'yearly') return moment(date).format('MMM');
      };

      const dateRange = [];

      if (type === 'weekly') {
        for (let i = 6; i >= 0; i--) {
          dateRange.push(moment(targetDate).startOf('week').add(i, 'days'));
        }
      }

      if (type === 'monthly') {
        const start = moment(targetDate).startOf('month');
        const daysInMonth = start.daysInMonth();
        for (let i = 0; i < daysInMonth; i++) {
          dateRange.push(start.clone().add(i, 'days'));
        }
      }

      if (type === 'yearly') {
        for (let i = 0; i < 12; i++) {
          dateRange.push(moment(targetDate).month(i).startOf('month'));
        }
      }

      for (const date of dateRange) {
        let filteredOrders = [];
        let filteredImports = [];

        if (type === 'weekly' || type === 'monthly') {
          filteredOrders = orders.filter(order => moment(order.createdAt).isSame(date, 'day'));
          filteredImports = imports.filter(imp => moment(imp.createdAt).isSame(date, 'day'));
        } else if (type === 'yearly') {
          filteredOrders = orders.filter(order => moment(order.createdAt).isSame(date, 'month'));
          filteredImports = imports.filter(imp => moment(imp.createdAt).isSame(date, 'month'));
        }

        const revenue = filteredOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const cost = filteredOrders.reduce((sum, o) =>
          sum + (o.items?.reduce((s, i) => s + (i.cost || 0) * (i.quantity || 0), 0) || 0), 0);

        const profit = revenue - cost;
        const label = getLabel(date, type);

        labels.push(label);
        salesData.push(revenue);
        profitsData.push(profit);
        ordersData.push(filteredOrders.length);
      }

      return res.status(200).json({
        labels,
        sales: salesData,
        orders: ordersData,
        profits: profitsData
      });
    }

    // === 2. Xử lý lọc theo range (dashboard tổng quan)
    let filteredOrders = orders;
    let filteredImports = imports;

    if (range) {
  switch (range) {
    case 'day':
      filteredOrders = orders.filter(o => moment(o.createdAt).isSame(targetDate, 'day'));
      filteredImports = imports.filter(i => moment(i.createdAt).isSame(targetDate, 'day'));
      break;
    case 'week':
      filteredOrders = orders.filter(o => moment(o.createdAt).isSame(targetDate, 'week'));
      filteredImports = imports.filter(i => moment(i.createdAt).isSame(targetDate, 'week'));
      break;
    case 'month':
      filteredOrders = orders.filter(o => moment(o.createdAt).isSame(targetDate, 'month'));
      filteredImports = imports.filter(i => moment(i.createdAt).isSame(targetDate, 'month'));
      break;
    case 'quarter':
      filteredOrders = orders.filter(o =>
        moment(o.createdAt).quarter() === targetDate.quarter() &&
        moment(o.createdAt).year() === targetDate.year()
      );
      filteredImports = imports.filter(i =>
        moment(i.createdAt).quarter() === targetDate.quarter() &&
        moment(i.createdAt).year() === targetDate.year()
      );
      break;
    case 'year':
      filteredOrders = orders.filter(o => moment(o.createdAt).isSame(targetDate, 'year'));
      filteredImports = imports.filter(i => moment(i.createdAt).isSame(targetDate, 'year'));
      break;
  }
}

    // === 3. Dashboard tổng hợp theo dữ liệu đã lọc
    const totalOrders = filteredOrders.length;
    const revenue = filteredOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
    const totalCost = filteredImports.reduce((sum, imp) => sum + (Number(imp.totalCost) || 0), 0);
    const totalBills = filteredOrders.filter(order => order.status === 'Delivered' && order.payment === true).length;
    const profit = revenue - totalCost;

 const thisMonth = targetDate.month();
const thisYear = targetDate.year();
const lastMonth = moment(targetDate).subtract(1, 'month').month();
const lastMonthYear = moment(targetDate).subtract(1, 'month').year();
const lastYear = targetDate.clone().subtract(1, 'year').year();
// Tính profitThisMonth & profitLastMonth từ bills
const billsThisMonth = bills.filter(b =>
  moment(b.createdAt).month() === thisMonth &&
  moment(b.createdAt).year() === thisYear
);

const billsLastMonth = bills.filter(b =>
  moment(b.createdAt).month() === lastMonth &&
  moment(b.createdAt).year() === lastMonthYear
);

const calcProfitFromBills = (billsArr) =>
  billsArr.reduce((sum, bill) => {
    const revenue = bill.total || 0;
    const cost = bill.products?.reduce((c, p) => c + (p.cost || 0) * (p.quantity || 1), 0) || 0;
    return sum + (revenue - cost);
  }, 0);

let profitThisMonth = calcProfitFromBills(billsThisMonth);
let profitLastMonth = calcProfitFromBills(billsLastMonth);

// Tính MOM %
let profitMOM = 0;
if (profitLastMonth === 0 && profitThisMonth > 0) {
  profitMOM = 999;
} else if (profitLastMonth === 0 && profitThisMonth === 0) {
  profitMOM = 0;
} else {
  profitMOM = ((profitThisMonth - profitLastMonth) / Math.abs(profitLastMonth)) * 100;
  profitMOM = Math.max(Math.min(profitMOM, 999), -999);
}

// Tính profitThisYear & profitLastYear
const billsThisYear = bills.filter(b => moment(b.createdAt).year() === thisYear);
const billsLastYear = bills.filter(b => moment(b.createdAt).year() === lastYear);

let profitThisYear = calcProfitFromBills(billsThisYear);
let profitLastYear = calcProfitFromBills(billsLastYear);

// Tính YOY %
let profitYOY = 0;
if (profitLastYear === 0 && profitThisYear > 0) {
  profitYOY = 999;
} else if (profitLastYear === 0 && profitThisYear === 0) {
  profitYOY = 0;
} else {
  profitYOY = ((profitThisYear - profitLastYear) / Math.abs(profitLastYear)) * 100;
  profitYOY = Math.max(Math.min(profitYOY, 999), -999);
}


    // === 4. Best Selling Categories
    const categoryMap = { Men: { category: 'Men', turnOver: 0, count: 0 }, Women: { category: 'Women', turnOver: 0, count: 0 }, Kids: { category: 'Kids', turnOver: 0, count: 0 } };
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        let category = 'Unknown';
        if (item.category) {
          const cat = item.category.toLowerCase();
          if (cat.includes('men')) category = 'Men';
          else if (cat.includes('women')) category = 'Women';
          else if (cat.includes('kids')) category = 'Kids';
        }
        if (categoryMap[category]) {
          const amount = (item.price || 0) * (item.quantity || 0);
          categoryMap[category].turnOver += amount;
          categoryMap[category].count += item.quantity || 0;
        }
      });
    });

    const bestSellingCategories = Object.values(categoryMap)
      .sort((a, b) => b.count - a.count)
      .map(c => ({
        category: c.category,
        turnOver: c.turnOver,
        count: c.count,
        increaseBy: Math.floor(Math.random() * 100),
      }));

    const productMap = {};
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        const key = item.name || 'Unknown';
        if (!productMap[key]) {
          productMap[key] = {
            productName: item.name || 'Unknown',
            productId:
    typeof item.productId === 'object' && item.productId !== null
      ? String(item.productId._id || '')
      : typeof item.productId === 'string'
      ? item.productId
      : '',
            category: item.category || 'Unknown',
            remainingQuantity: 0,
            turnOver: 0,
            count: 0,
            color: item.colors?.[0] || null,
            price: item.price || 0,
          };
        }
        productMap[key].turnOver += (item.price || 0) * (item.quantity || 0);
        productMap[key].count += item.quantity || 0;
      });
    });

    for (const key in productMap) {
      const matched = products.find(p => p.name === productMap[key].productName);
      if (matched) {
        productMap[key].remainingQuantity = matched.sizes.reduce((sum, size) => sum + (size.quantity || 0), 0);
      }
    }

    const bestSellingProducts = Object.values(productMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(p => ({ ...p, increaseBy: Math.floor(Math.random() * 100) }));

    const totalTurnover = bestSellingCategories.reduce((sum, c) => sum + c.turnOver, 0);
    bestSellingCategories.forEach(c => {
      c.percentage = totalTurnover === 0 ? 0 : parseFloat(((c.turnOver / totalTurnover) * 100).toFixed(1));
    });
    const allOrders = await orderModel.find(); // lấy tất cả đơn hàng
    const salesCount = allOrders.length; // hoặc lọc Delivered nếu bạn muốn

    const allProducts = await productModel.find();
    const quantityInHand = allProducts.reduce((sum, p) => {
      return sum + (p.sizes?.reduce((s, sz) => s + (sz.quantity || 0), 0) || 0);
    }, 0);

    const toBeReceivedOrders = allOrders.filter(o => o.status !== 'Delivered').length;

    
 
    res.status(200).json({
      revenue,
      totalCost,
      totalOrders,
      totalBills,
      profit,
      profitMOM,
      profitYOY,
      bestSellingCategories,
      bestSellingProducts,
       // 👉 bổ sung cho Dashboard
        profitThisMonth,
      profitThisYear,
      sales: salesCount,
      quantityInHand,
      toBeReceivedOrders,
      rangeType: range,
  dateRange: {
    start: moment(targetDate).startOf(range || 'month').format('YYYY-MM-DD'),
    end: moment(targetDate).endOf(range || 'month').format('YYYY-MM-DD')
  }
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
// Route: GET /api/statistics/orders?type=monthly|weekly|yearly
export const getStatisticsSummary = async (req, res) => {
  try {
    const type = req.query.type || 'monthly';
    const now = new Date();
    let startDate;

    switch (type) {
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const orders = await orderModel.find({
      createdAt: { $gte: startDate },
    });

    let totalRevenue = 0;
    let totalCost = 0;
    let salesCount = orders.length;

    orders.forEach((order) => {
      totalRevenue += order.amount || 0;
      order.items.forEach((item) => {
        totalCost += (item.cost || 0) * (item.quantity || 0);
      });
    });

    const profit = totalRevenue - totalCost;

    const quantityInHand = await productModel.aggregate([
      { $unwind: "$sizes" },
      {
        $group: {
          _id: null,
          total: { $sum: "$sizes.quantity" },
        },
      },
    ]);
    
    const toBeReceivedOrders = await orderModel.countDocuments({
      status: { $ne: "Delivered" },
    });

    res.json({
      success: true,
      sales: salesCount,
      revenue: totalRevenue,
      totalCost,
      profit,
      quantityInHand: quantityInHand[0]?.total || 0,
      toBeReceivedOrders,
    });
  } catch (err) {
    console.error("❌ Error in statistics summary:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const formatDate = (date, type = 'monthly') => {
  const d = new Date(date);
  if (type === 'yearly') {
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }
  if (type === 'weekly' || type === 'monthly') {
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  }
  return d.toLocaleDateString();
};
export const getSalesAndOrderChart = async (req, res) => {
  try {
    const type = req.query.type || 'monthly';
    const date = req.query.date ? moment(req.query.date) : moment();

    let startDate, endDate;

    switch (type) {
  case 'monthly':
    startDate = date.clone().startOf('month').toDate();
    endDate = date.clone().endOf('month').toDate();
    break;
  case 'weekly':
    startDate = date.clone().startOf('week').toDate();
    endDate = date.clone().endOf('week').toDate();
    break;
  case 'yearly':
    startDate = date.clone().startOf('year').toDate();
    endDate = date.clone().endOf('year').toDate();
    break;
}


    const orders = await orderModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const dateMap = {};

    const formatDate = (date, type) => {
      const d = new Date(date);
      if (type === 'yearly') {
        return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
      }
      if (type === 'weekly') {
        return d.toLocaleString('en-US', { weekday: 'short' }); // Mon, Tue, ...
      }
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    // ✅ Nếu yearly thì tạo sẵn 12 tháng
    if (type === 'yearly') {
      for (let i = 0; i < 12; i++) {
        const label = `${(i + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        dateMap[label] = { revenue: 0, cost: 0, orders: 0 };
      }
    }

    orders.forEach(order => {
      const label = formatDate(order.createdAt, type);
      if (!dateMap[label]) {
        dateMap[label] = { revenue: 0, cost: 0, orders: 0 };
      }
      dateMap[label].revenue += order.amount || 0;
      dateMap[label].orders += 1;
      dateMap[label].cost += order.items?.reduce((sum, item) => {
        return sum + (item.cost || 0) * (item.quantity || 0);
      }, 0) || 0;
    });

    let labels = Object.keys(dateMap);

    // 🔀 Sắp xếp label theo loại
    if (type === 'yearly') {
      labels.sort((a, b) => {
        const [aMonth, aYear] = a.split('/').map(Number);
        const [bMonth, bYear] = b.split('/').map(Number);
        return new Date(aYear, aMonth - 1) - new Date(bYear, bMonth - 1);
      });
    } else if (type === 'monthly') {
      labels.sort((a, b) => {
        const [aDay] = a.split('/').map(Number);
        const [bDay] = b.split('/').map(Number);
        return aDay - bDay;
      });
    } else if (type === 'weekly') {
      const weekDayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      labels.sort((a, b) => weekDayOrder.indexOf(a) - weekDayOrder.indexOf(b));
    }

    const sales = labels.map(label => dateMap[label].revenue);
    const profits = labels.map(label => dateMap[label].revenue - dateMap[label].cost);
    const ordersCount = labels.map(label => dateMap[label].orders);

    res.json({ labels, sales, profits, orders: ordersCount });
  } catch (error) {
    console.error('❌ Chart API error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};








