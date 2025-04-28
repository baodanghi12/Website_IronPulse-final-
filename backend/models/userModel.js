import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    cartData: { type: Object, default: {} },

    // Phân quyền: user hoặc admin
    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },

    // Trạng thái tài khoản
    isBlocked: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: {
      type: Date,
    },
    verifyOtp: { type: String, default: '' },
    verifyOtpExprieAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExprieAt: { type: Number, default: 0 },
  },
  {
    minimize: false,
    timestamps: true, // Ghi lại createdAt và updatedAt
  }
);

// Đảm bảo không tạo trùng model khi hot reload
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
