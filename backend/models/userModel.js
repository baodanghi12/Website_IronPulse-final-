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
      enum: ["user", "admin"],
      default: "user",
    },

    // Trạng thái tài khoản
    isBlocked: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    }
  },
  {
    minimize: false,
    timestamps: true, // Ghi lại createdAt và updatedAt
  }
);

// Đảm bảo không tạo trùng model khi hot reload
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
