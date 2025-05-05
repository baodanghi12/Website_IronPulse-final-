import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  colors: { type: [String], default: [] },
  category: { type: String },
  subCategory: { type: String },
  size: { type: String },
});

const addressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  country: String,
  zipcode: String,
});

const billSchema = new mongoose.Schema(
  {
    userId: { type: String },
    items: [itemSchema],
    amount: { type: Number },
    address: addressSchema,
    status: { type: String, default: 'Delivered' },
    payment: { type: Boolean, default: true },
    paymentMethod: { type: String },
    shipping: { type: Number },
    discount: { type: Number },
    note: { type: String },
    promotionCode: { type: String },
  },
  { timestamps: true }
);

const BillModel = mongoose.models.Bill || mongoose.model('Bill', billSchema);
export default BillModel;
