import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"
import Order from '../models/orderModel.js';
// global variables
const currency = "inr" // currency for stripe payment
const deliveryCharges = 10 // delivery charges for stripe payment

// gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing orders using COD Method
const placeOrder = async (req,res) => {

    try {
        
        const { userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }

}

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
const userOrders = async (req,res) => {
    try {
        
        const {userId} = req.body

        const orders = await orderModel.find({userId})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// update Orders status from Admin Panel
const updateStatus = async (req, res) => {
    try {
      const { orderId, status, payment } = req.body;
  
      const updateFields = {};
      if (status) updateFields.status = status;
      if (typeof payment !== 'undefined') updateFields.payment = payment;
  
      const result = await orderModel.findByIdAndUpdate(orderId, updateFields, { new: true });
  
      if (!result) {
        return res.status(404).json({ success: false, message: "Order không tồn tại" });
      }
  
      res.json({ success: true, message: "Cập nhật trạng thái và thanh toán thành công", order: result });
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
  
  
  
  
export { verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, getUserOrders,}