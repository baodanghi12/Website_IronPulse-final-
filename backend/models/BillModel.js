// billModel.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: String,
  createdBy: String,
  count: Number,
  cost: Number,
  subProductId: String,
  image: String,
  color: String,
  price: Number,
  qty: Number,
  productId: String,
  title: String,
  __v: Number,
});


const shippingAddressSchema = new mongoose.Schema({
  address: String,
  _id: String,
});

const billSchema = new mongoose.Schema(
  {
    products: [productSchema],
    total: Number,
    status: String,
    customer_id: String,
    shippingAddress: shippingAddressSchema,
    paymentStatus: Number,
    paymentMethod: String,
  },
  { timestamps: true } // tự động thêm createdAt và updatedAt
);

const BillModel = mongoose.models.Bill || mongoose.model('Bill', billSchema);
export default BillModel;
