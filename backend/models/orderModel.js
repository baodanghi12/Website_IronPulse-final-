import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      title: String,
      price: Number,
      cost: Number,
      quantity: Number,
      productId: String,
    },
  ],
  amount: { type: Number, required: true }, // Tổng tiền đơn hàng
  address: { type: Object, required: true },
  status: { type: String, required: true, default: 'Order Placed' },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false }, // true khi đã thanh toán
}, { timestamps: true }); // createdAt, updatedAt dùng để lọc theo tháng/năm

const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default OrderModel;
