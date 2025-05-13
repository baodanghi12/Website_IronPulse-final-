import express from 'express';
import { 
  placeOrder, 
  placeOrderStripe, 
  placeOrderRazorpay, 
  allOrders, 
  userOrders, 
  updateStatus, 
  verifyStripe, 
  getUserOrders,
  addReviewToOrder,
  placeOrderZalo,
 
  markZaloOrderAsPaid,
} from '../controllers/orderController.js';  // Import các controller trực tiếp từ file

import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';


const orderRouter = express.Router();

// Admin Features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment Features
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);
orderRouter.post('/zalopay', authUser, placeOrderZalo)

//

// User Features
orderRouter.post('/userorders', authUser, userOrders);
orderRouter.get('/user/:userId',  getUserOrders); // Trực tiếp sử dụng `getUserOrders` từ controller
orderRouter.post('/:orderId/review', authUser, addReviewToOrder);
// Verify Payment
orderRouter.post('/verifyStripe', authUser, verifyStripe);

orderRouter.post('/mark-paid', authUser, markZaloOrderAsPaid);

export default orderRouter;
