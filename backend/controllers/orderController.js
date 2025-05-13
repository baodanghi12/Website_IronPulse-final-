import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"
import Order from '../models/orderModel.js';
import BillModel from '../models/BillModel.js'; 
import productModel from "../models/productModel.js";
import promotionModel from "../models/promotionModel.js"
import Notification from '../models/notificationModel.js';
import sendOrderEmail from '../utils/sendOrderEmail.js';
import mongoose from 'mongoose';
import qs from 'qs'
import crypto from 'crypto'
import moment from "moment";
import axios from 'axios';
//Zalo
const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

const placeOrderZalo = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address, phone, promotionCode } = req.body;
    const {
    firstName,
    lastName,
    street,
    city,
    state,
    zipcode,
    country
  } = address || {};
    // ✅ Thêm cost vào từng item
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await productModel.findById(item._id);
        const cost = product?.cost || 0;

        return {
          ...item,
          productId: item._id,
          cost
        };
      })
    );

    const subTotal = enrichedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 30000;

    let discountAmount = 0;
    let promoCode = promotionCode || null;

    if (promoCode) {
      const promo = await promotionModel.findOne({ code: promoCode });
      if (promo && promo.isActive && promo.numOfAvailable > 0) {
        discountAmount = promo.type === 'percent'
          ? Math.round((subTotal * promo.value) / 100)
          : promo.value;
        await promotionModel.updateOne({ _id: promo._id }, { $inc: { numOfAvailable: -1 } });
        console.log(`🔖 Promotion "${promoCode}" used. Discount: ${discountAmount}`);
      } else {
        promoCode = null;
      }
    }

    const amount = subTotal + shippingFee - discountAmount;

    const orderData = {
      userId,
      items: enrichedItems, // ✅ items đã có cost
      address,
      phone,
      amount,
      paymentMethod: "ZaloPay",
      payment: false,
      promotionCode: promoCode,
      discountAmount,
      shippingFee,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    const user = await userModel.findById(userId);
    await sendOrderEmail(user.email, newOrder);
    await Notification.create({
  type: 'info',
  title: `Đơn hàng mới từ ${firstName || 'Khách hàng'} ${lastName || ''}`,
  content: `Thanh toán: ZaloPay - Tổng: ${amount.toLocaleString()} VND`,
  isRead: false,
  link: `/admin/orders`,
});
    const embed_data = {
      redirecturl: `${process.env.CLIENT_URL}/verify?orderId=${newOrder._id}&paymentMethod=zalopay`,
    };

    const items_data = enrichedItems.map((item) => ({
      itemid: item.productId,
      itemname: item.name,
      itemprice: item.price,
      itemquantity: item.quantity,
    }));

    const app_trans_id = `${moment().format('YYMMDD')}_${newOrder._id.toString().slice(-6)}`;

    const order = {
      app_id: config.app_id,
      app_trans_id,
      app_user: userId,
      app_time: Date.now(),
      amount,
      item: JSON.stringify(items_data),
      description: `Thanh toán đơn hàng #${newOrder._id}`,
      embed_data: JSON.stringify(embed_data),
      bank_code: 'zalopayapp',
      callback_url: 'http://localhost:4000/api/order/verifyZalopay',
    };

    const dataString = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = crypto.createHmac('sha256', config.key1).update(dataString).digest('hex');

    console.log("📤 Sending to ZaloPay:", order);
    const zalopayRes = await axios.post(config.endpoint, null, { params: order });
    console.log("📥 ZaloPay response:", zalopayRes.data);

    if (zalopayRes.data.return_code === 1) {
      res.status(200).json({ success: true, zalo_url: zalopayRes.data.order_url });
    } else {
      res.status(500).json({ success: false, message: zalopayRes.data.return_message });
    }

  } catch (error) {
    console.error("❌ placeOrderZalo error:", error);
    res.status(500).json({ success: false, message: "ZaloPay order creation failed" });
  }
};


const markZaloOrderAsPaid = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.body;

    const order = await orderModel.findOneAndUpdate(
      { _id: orderId, userId },
      { payment: true },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    for (const item of order.items) {
      const product = await productModel.findById(item._id);
      if (!product) continue;

      const sizeKey = item.size?.split('-')[0];
      const updatedSizes = product.sizes.map(sizeObj => {
        if (sizeObj.size.trim() === sizeKey) {
          return {
            ...sizeObj,
            quantity: Math.max(0, sizeObj.quantity - item.quantity)
          };
        }
        return sizeObj;
      });

      product.sizes = updatedSizes;
      product.markModified('sizes');
      await product.save();
    }

    return res.json({ success: true, message: "Payment confirmed and stock updated" });
  } catch (error) {
    console.error("❌ markZaloOrderAsPaid error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// global variables
const currency = "inr" // currency for stripe payment
const deliveryCharges = 10 // delivery charges for stripe payment

// gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req, res) => {
  try {
    const { items, address, phone } = req.body;
    const {
      firstName, lastName, street, city, state, zipcode, country
    } = address || {};
    const userId = req.userId;

    const enrichedItems = await Promise.all(
  items.map(async (item) => {
    const product = await productModel.findById(item._id);
    const cost = product?.cost || 0;

    return {
      ...item,
      productId: item._id,
      cost
    };
  })
);

    const subTotal = enrichedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 30000;
    
    // ✅ Kiểm tra mã trước khi tính finalAmount
    let discountAmount = 0;
    let promotionCode = req.body.promotionCode || req.body.couponCode || null;

    if (promotionCode) {
      const promotion = await promotionModel.findOne({ code: promotionCode });

      if (promotion && promotion.isActive && promotion.numOfAvailable > 0) {
        if (promotion.type === 'percent') {
          discountAmount = Math.round((subTotal * promotion.value) / 100);
        } else if (promotion.type === 'fixed') {
          discountAmount = promotion.value;
        }

        // ✅ Trừ số lượt dùng
        await promotionModel.updateOne({ _id: promotion._id }, { $inc: { numOfAvailable: -1 } });
        console.log(`🔖 Promotion "${promotionCode}" used. Discount: ${discountAmount}`);
      } else {
        promotionCode = null; // Không hợp lệ thì không lưu
        console.warn(`⚠️ Promotion "${promotionCode}" not found or expired.`);
      }
    }

    const finalAmount = subTotal + shippingFee - discountAmount;

    const orderData = {
      userId,
      items: enrichedItems,
      address: {
        firstName,
        lastName,
        phone,
        street,
        city,
        state,
        zipcode,
        country
      },
      discountAmount,
      shippingFee,
      amount: finalAmount,
      promotionCode,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await Notification.create({
  type: 'info',
  title: `🧾 Đơn hàng mới từ ${firstName || 'Khách hàng'} ${lastName || ''}`,
  content: `Thanh toán: COD - Tổng: ${finalAmount.toLocaleString()} VND`,
  isRead: false,
  link: `/admin/orders`,
});

    // ✅ Cập nhật tồn kho
    for (const item of enrichedItems) {
      const product = await productModel.findById(item.productId);
      if (!product) continue;

      const extractedSize = item.size?.split('-')[0];
      const updatedSizes = product.sizes.map((sizeObj) => {
        if (sizeObj.size.trim() === extractedSize) {
          return {
            ...sizeObj,
            quantity: Math.max(0, sizeObj.quantity - item.quantity),
          };
        }
        return sizeObj;
      });

      product.sizes = updatedSizes;
      product.markModified('sizes');
      await product.save();
    }

    // ✅ Xóa giỏ hàng
    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
      shippingAddress: address,
      phone
    });
    const user = await userModel.findById(userId);
    await sendOrderEmail(user.email, newOrder);
    res.json({ success: true, message: "Order Placed" });

  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
    try {
        const userId = req.userId;
        const { items, amount, address} = req.body;
        const enrichedItems = await Promise.all(
  items.map(async (item) => {
    const product = await productModel.findById(item._id);
    const cost = product?.cost || 0;

    return {
      ...item,
      productId: item._id,
      cost
    };
  })
);
        const { origin } = req.headers

        const orderData = {
            userId,
            items: enrichedItems,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        const user = await userModel.findById(userId);
        await sendOrderEmail(user.email, newOrder);
        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name:'Delivery Charges',
                },
                unit_amount: deliveryCharges * 100,
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        })

        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Verifying the payment using Stripe Method
const verifyStripe = async (req,res) => {
    
    const {orderId, success, userId} = req.body

    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, {payment:true})
            await userModel.findByIdAndUpdate(userId, {cartData:{}})
            res.json({success:true,message:"Payment Verified"})
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false,message:"Payment Failed"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
    
}

// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}

// User Orders data for Forntend
const userOrders = async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.userId);
  
      const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
  
      res.json({ success: true, orders });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };

  const updateStatus = async (req, res) => {
    try {
      const { orderId, status, payment } = req.body;
  
      const updateFields = {};
      if (status) updateFields.status = status;
      if (typeof payment !== 'undefined') updateFields.payment = payment;
  
      const updatedOrder = await orderModel.findByIdAndUpdate(orderId, updateFields, { new: true });
      if (updatedOrder) {
  const updates = [];

  if (status) updates.push(`Trạng thái: ${updatedOrder.status}`);
  if (typeof payment !== 'undefined') {
    updates.push(`Thanh toán: ${updatedOrder.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}`);
  }

  if (updates.length > 0) {
    await Notification.create({
      type: 'info',
      title: `Đơn hàng #${updatedOrder._id.toString().slice(-6).toUpperCase()} đã được cập nhật`,
      content: updates.join(' | '),
      isRead: false,
      link: `/admin/orders`,
    });
  }
}

      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order không tồn tại" });
      }
  
      // ✅ Nếu đơn đã giao và thanh toán → lưu vào Bill
      if (updatedOrder.status === 'Delivered' && updatedOrder.payment === true) {
        const existingBill = await BillModel.findOne({
          customer_id: updatedOrder.userId,
          total: updatedOrder.amount,
          createdAt: updatedOrder.createdAt
        });
  
        if (!existingBill) {
          const bill = new BillModel({
            products: updatedOrder.items.map(item => ({
              _id: item._id?.toString() || '',
              createdBy: updatedOrder.userId,
              count: item.quantity,
              cost: 0,
              subProductId: '',
              image: '',
              color: item.colors?.[0] || '',
              price: item.price,
              qty: item.quantity,
              productId: item.productId || '',
              title: item.name,
              __v: 0,
            })),
            total: updatedOrder.amount,
            status: updatedOrder.status,
            customer_id: updatedOrder.userId,
            shippingAddress: {
              firstName: updatedOrder.address?.firstName || '',
              lastName: updatedOrder.address?.lastName || '',
              phone: updatedOrder.address?.phone || updatedOrder.phone || '',
              street: updatedOrder.address?.street || '',
              city: updatedOrder.address?.city || '',
              state: updatedOrder.address?.state || '',
              country: updatedOrder.address?.country || '',
              zipcode: updatedOrder.address?.zipcode || '',
            },
            paymentStatus: 1,
            paymentMethod: updatedOrder.paymentMethod,
            address: updatedOrder.address,
            date: updatedOrder.date || updatedOrder.createdAt,
          });
          
  
          await bill.save();
          console.log(`✅ Bill đã lưu từ đơn hàng ${updatedOrder._id}`);
        }
      }
  
      res.json({ success: true, message: "Cập nhật trạng thái và thanh toán thành công", order: updatedOrder });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

const getUserOrders = async (req, res) => {
    const userId = req.params.userId; // Lấy userId từ tham số URL
  
    try {
      // Truy vấn các đơn hàng của người dùng từ cơ sở dữ liệu
      const orders = await Order.find({ userId: userId });
  
      if (!orders) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
  
      // Trả về danh sách đơn hàng nếu tìm thấy
      res.status(200).json({ orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  const addReviewToOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { productId, rating, comment } = req.body;
      const userId = req.userId;
  
      console.log("🧾 orderId:", orderId);
      console.log("👤 userId:", userId);
      console.log("📦 productId:", productId);
  
      const order = await orderModel.findOne({ _id: orderId, userId });
  
      if (!order) {
        console.log("❌ Order not found");
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
  
      const item = order.items.find((item) => item.productId === productId);
  
      if (!item) {
        console.log("❌ Product not found in items:", order.items.map(i => i.productId));
        return res.status(404).json({ success: false, message: 'Product not found in order' });
      }
  
      item.review = { rating, comment, createdAt: new Date() };
      await order.save();
  
      console.log("✅ Review added:", item.review);
      res.json({ success: true, review: item.review });
    } catch (error) {
      console.error('Review error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  export { verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders,
     updateStatus, getUserOrders, addReviewToOrder,placeOrderZalo, markZaloOrderAsPaid }