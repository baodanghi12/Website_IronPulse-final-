import mongoose from "mongoose";

// Định nghĩa schema cho đơn hàng
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID của người dùng đặt đơn hàng
  products: [
    {
      title: { type: String, required: true }, // Tên sản phẩm
      price: { type: Number, required: true }, // Giá của sản phẩm
      cost: { type: Number, required: true }, // Chi phí của sản phẩm
      quantity: { type: Number, required: true }, // Số lượng sản phẩm trong đơn hàng
      productId: { type: String, required: true }, // ID của sản phẩm
    },
  ],
  amount: { type: Number, required: true }, // Tổng số tiền của đơn hàng
  address: { 
    type: Object, 
    required: true, // Địa chỉ giao hàng
    validate: {
      validator: (v) => v && v.street && v.city && v.state && v.zipcode, // Kiểm tra dữ liệu địa chỉ có đầy đủ thông tin
      message: 'Address is incomplete' 
    }
  },
  status: { type: String, required: true, default: 'Order Placed' }, // Trạng thái đơn hàng (mặc định là 'Đặt hàng')
  paymentMethod: { type: String, required: true }, // Phương thức thanh toán
  note: { type: String, default: '' }, // Ghi chú về đơn hàng
  payment: { type: Boolean, required: true, default: false }, // Trạng thái thanh toán (false = chưa thanh toán)
}, { timestamps: true }); // Tự động thêm trường createdAt và updatedAt

// Kiểm tra xem model đã tồn tại trong Mongoose chưa, nếu chưa thì tạo mới
const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;
