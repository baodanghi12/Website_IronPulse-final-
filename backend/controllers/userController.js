import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// USER LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.json({ success: false, message: "User doesn't exist" });
    if (user.isBlocked) return res.json({ success: false, message: "User is blocked" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// USER REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (await userModel.findOne({ email }))
      return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });

    if (password.length < 8)
      return res.json({ success: false, message: "Password too short" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ADMIN LOGIN
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user || user.role !== "admin")
      return res.json({ success: false, message: "Access denied" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid credentials" });

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//
// ===== ADMIN CONTROL =====
//

// Lấy danh sách tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//thêm người dùng mới
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, avatar, isBlocked } = req.body;

    // Check if email already exists
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new userModel({
      name,
      email,
      phone,
      password, // Nên mã hóa bằng bcrypt trước khi lưu nếu cần bảo mật
      role: role || 'user',
      avatar,
      isBlocked: isBlocked || false,
    });

    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Xoá người dùng
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.findByIdAndDelete(id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Cập nhật role người dùng
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.json({ success: false, message: "Invalid role" });
    }

    const updated = await userModel.findByIdAndUpdate(id, { role }, { new: true });
    res.json({ success: true, updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Khoá người dùng
const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.findByIdAndUpdate(id, { isBlocked: true });
    res.json({ success: true, message: "User blocked" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Mở khoá người dùng
const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.findByIdAndUpdate(id, { isBlocked: false });
    res.json({ success: true, message: "User unblocked" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, avatar, isBlocked, phone } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { name, email, role, avatar, isBlocked, phone },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  getAllUsers,
  deleteUser,
  updateUserRole,
  blockUser,
  unblockUser,
  updateUser,
  createUser,
  getUserById,
};
