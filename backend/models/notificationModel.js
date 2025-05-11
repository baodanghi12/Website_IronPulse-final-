import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['info', 'warning', 'error', 'success', 'custom', 'flashsale'],  // nếu cần phân loại
      default: 'custom',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Thay vì tạo riêng createdAt
  }
);

// Tùy chọn: Tạo index để sắp xếp nhanh theo thời gian hoặc chưa đọc
notificationSchema.index({ isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
