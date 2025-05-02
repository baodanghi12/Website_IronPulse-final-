import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"
import Order from '../models/orderModel.js';
import BillModel from '../models/BillModel.js'; 
import mongoose from 'mongoose';
// global variables
const currency = "inr" // currency for stripe payment
const deliveryCharges = 10 // delivery charges for stripe payment

// gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  
    try {
      const { items, amount, address,  phone } = req.body;
      const {
        firstName,
        lastName,
        street,
        city,
        state,
        zipcode,
        country
      } = address || {};
      const userId = req.userId;
      
      const enrichedItems = items.map(item => ({
        ...item,
        productId: item._id // 👈 gán ID gốc của sản phẩm
      }));
      
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
        amount,
        paymentMethod: "COD",
        payment: false,
        date: Date.now()
      };
  
      const newOrder = new orderModel(orderData);
      await newOrder.save();
  
      await userModel.findByIdAndUpdate(userId, {
        cartData: {},
        shippingAddress: address, // ✅ lưu địa chỉ
        phone: phone,
      });
      
  
      res.json({ success: true, message: "Order Placed" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
    try {
        
        const { userId, items, amount, address} = req.body;
        const { origin } = req.headers

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

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
              address: `${updatedOrder.address?.street || ''}, ${updatedOrder.address?.city || ''}, ${updatedOrder.address?.state || ''}, ${updatedOrder.address?.country || ''}`,
              _id: updatedOrder.address?._id?.toString() || '',
            },
            paymentStatus: 1,
            paymentMethod: updatedOrder.paymentMethod,
            address: updatedOrder.address, // ⬅ thêm toàn bộ address để dễ truy xuất tên
            date: updatedOrder.date || updatedOrder.createdAt, // ⬅ dùng date để hiển thị ngày tạo
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
  
  
  
  
export { verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, getUserOrders, addReviewToOrder}