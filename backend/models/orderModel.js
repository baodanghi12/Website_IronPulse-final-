import mongoose from "mongoose";

// Định nghĩa schema cho đơn hàng
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [ // ✅ đổi products -> items
    {
      productId: { type: String, required: true },
      name: { type: String, required: true }, // ✅ đổi title -> name
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      productId: { type: String }, // optional: nếu có
      colors: { type: [String], default: [] }, // optional
      category: { type: String },
      subCategory: { type: String },
      size: { type: String },
      review: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date }
      },
    }
  ],
  amount: { type: Number, required: true },
  address: { 
    type: Object, 
    required: true,
    validate: {
      validator: (v) => v && v.street && v.city && v.state && v.zipcode,
      message: 'Address is incomplete' 
    }
  },
  status: { type: String, required: true, default: 'Order Placed' },
  paymentMethod: { type: String, required: true },
  note: { type: String, default: '' },
  payment: { type: Boolean, required: true, default: false },
}, { timestamps: true });

const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;
