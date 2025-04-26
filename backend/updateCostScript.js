import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productModel from './models/productModel.js';

dotenv.config(); // Load biến môi trường

const updateDefaultCost = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // Dùng đúng tên biến
    console.log('✅ Kết nối MongoDB thành công');

    const result = await productModel.updateMany(
      { cost: { $exists: false } }, // Nếu chưa có cost
      { $set: { cost: 0 } }          // Thêm cost mặc định là 0
    );

    console.log(`✅ Đã cập nhật cost mặc định cho ${result.modifiedCount} sản phẩm.`);
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật cost:', err);
  }
};

updateDefaultCost();
