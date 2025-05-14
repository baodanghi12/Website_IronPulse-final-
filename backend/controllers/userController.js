import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import productModel from '../models/productModel.js';
// import { createNotification } from '../utils/createNotification.js';
import { OAuth2Client } from "google-auth-library";
import transporter from '../config/nodemailer.js'
import dotenv from 'dotenv';
dotenv.config();

const token = jwt.sign({ id: process.env.ADMIN_ID }, process.env.JWT_SECRET);


const client = new OAuth2Client(process.env.GG_CLIENT_ID);

// Hàm tạo token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


// GOOGLE LOGIN HANDLER
// GOOGLE LOGIN HANDLER
const googleLogin = async (req, res) => {
  try {
    const { id_token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GG_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await userModel.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(sub, 10);
      user = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });
    }

    const token = createToken(user._id);

    res.cookie('token', token, {
      httpOnly: true, // 🛡️ Cookie chỉ server đọc được
      secure: process.env.NODE_ENV === 'production', // 🛡️ Local thì false, production thì true
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 🛡️ Localhost thì lax
      maxAge: 7 * 24 * 60 * 60 * 1000, // 🕒 7 ngày
    });

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
    console.log('Google login error:', error);
    res.json({ success: false, message: 'Google login failed' });
  }
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

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    const token1 = createToken(user._id); // chuẩn theo expiresIn: '7d'
    
    // 🛠️ Sửa dòng dưới:
    res.cookie('token', token1, { // 💥 Dùng token1
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    

    res.json({ success: true, token, token1, role: user.role });
  } catch (error) {
    console.log(error);
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

    res.cookie('token', token, {
      httpOnly: true, // 🛡️ Cookie chỉ server đọc được
      secure: process.env.NODE_ENV === 'production', // 🛡️ Local thì false, production thì true
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 🛡️ Localhost thì lax
      maxAge: 7 * 24 * 60 * 60 * 1000, // 🕒 7 ngày
    });

    // Gửi email thông báo admin
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: '📩 Có người mới đăng ký!',
      text: `Một người vừa đăng ký tài khoản:
- Tên: ${name}
- Email: ${email}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully to admin");
    } catch (mailErr) {
      console.error("❌ Failed to send email:", mailErr);
    }

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
// STAFF LOGIN
const staffLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(400).json({ success: false, message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Check role for staff
      if (user.role !== 'staff') {
          return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ success: true, token });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
  }
};


  // ADMIN LOGIN
  const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ id: process.env.ADMIN_ID }, process.env.JWT_SECRET);
        res.json({ success: true, token });
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.log(error);
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
    const { name, email, phone, password, role, avatar, isBlocked, dateOfBirth } = req.body;

    // Check if email already exists
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Convert dateOfBirth to Date object
    const dob = dateOfBirth ? new Date(dateOfBirth) : null;

    const newUser = new userModel({
      name,
      email,
      phone,
      password: hashedPassword, // Bcrypt mã hóa nếu cần
      role: role || 'user',
      avatar,
      isBlocked: isBlocked || false,
      dateOfBirth: dob,
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
    // await createNotification({
    //   title: `🗑 Người dùng ${user.name} đã bị xóa khỏi hệ thống`,
    //   link: '/admin/users',
    // });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Cập nhật role người dùng
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin", "staff"].includes(role)) {
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
    const { isBlocked } = req.body;

    await userModel.findByIdAndUpdate(id, { isBlocked });

    res.json({ success: true, message: `User ${isBlocked ? 'blocked' : 'unblocked'}` });
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
    const { name, email, role, avatar, isBlocked, phone, dateOfBirth, shippingAddress } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        name, email, role, avatar, isBlocked, phone,
        dateOfBirth, shippingAddress
      },
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

// Send Otp
const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await userModel.findById(userId)

    if (user.isAccountVerified) {
      return res.json({ success: false, message: 'Account Already verified' })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    user.verifyOtp = otp
    user.verifyOtpExprieAt = Date.now() + 24 * 60 * 60 * 1000

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: '📩 Đã gửi mã OTP',
      text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 24 giờ.`,

    }

    await transporter.sendMail(mailOption)

    res.json({success: true, message: 'Đã gửi mã OTP cho bạn'})

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


// VerifyEmail
const verifyEmail = async (req,res)=> {
  const { userId, otp } = req.body

  if(!userId || !otp){
    return res.json({ success:false, message: 'Missing Details'})
  }
  try {
    const user = await userModel.findById(userId)

    if(!user){
      return res.json({ success:false, message: 'User not found'})
    }

    if (user.verifyOtp !== otp) {
      return res.json({ success:false, message: 'OTP không đúng' })
    }
    

    if(user.verifyOtpExprieAt < Date.now()){
      return res.json({ success:false, message: 'OTP Expried'})
    }

    user.isAccountVerified = true
    user.verifyOtp = ''
    user.verifyOtpExprieAt = 0

    await user.save()
    return res.json({success: true, message: 'Email verified successfully'})

  } catch (error) {
    return res.json({ success:false, message: error.message})
  }
}


//Check if user is authenticated
const isAuthenticated = async (req,res) => {
  try {
    return res.json({success:true})
  } catch (error) {
    res.json({success: false, message:error.message})
  }
}

//Send Password reset Otp
const sendResetOtp = async (req,res)=> {
  const{email} = req.body;

  if(!email){
    return res.json({success:false, message:'Email is required'})
  }

  try {
    const user = await userModel.findOne({email})
    if(!user){
      return res.json({success:false, message:'User not found'})
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    user.resetOtp = otp
    user.resetOtpExprieAt = Date.now() + 15 * 60 * 1000

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: '🔐 Xác Nhận Đặt Lại Mật Khẩu của Bạn',
      html: `
        <div class="bg-gray-100 p-6 max-w-lg mx-auto rounded-xl border border-gray-200">
          <h2 class="text-3xl font-semibold text-center text-blue-600 mb-6">🔒 Đặt Lại Mật Khẩu của Bạn</h2>
          
          <p class="text-lg text-gray-700 mb-4">Chào bạn,</p>
          <p class="text-lg text-gray-700 mb-4">Để đặt lại mật khẩu tài khoản của bạn, vui lòng sử dụng mã OTP dưới đây:</p>

          <div class="bg-teal-500 text-white text-3xl font-bold text-center py-4 rounded-lg mb-6">
            ${otp}
          </div>

          <p class="text-lg text-gray-700 mb-4">Mã OTP có hiệu lực trong 24 giờ. Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>

          <p class="text-lg text-gray-700 mb-4">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>

          <div class="text-center mt-6">
            <a href="http://localhost:5173/" class="bg-blue-500 text-white py-2 px-6 rounded-lg text-lg hover:bg-blue-600 transition duration-300">Truy Cập Website</a>
          </div>

          <p class="text-center text-sm text-gray-500 mt-6">Nếu bạn gặp vấn đề hoặc có thắc mắc, vui lòng liên hệ với chúng tôi.</p>
        </div>
      `
    }

    await transporter.sendMail(mailOption)

    return res.json({success:true, message:'OTP sent to your email'})
  } catch (error) {
    return res.json({success:false, message: error.message})
  }
}


//Reset User Password
const resetPassword = async (req,res)=>{
  const {email, otp, newPassword} = req.body

  if(!email || !otp || !newPassword){
    return res.json({success:false, message:'Email, OTP, and new password are required'})
  }

  try {
    
    const user = await userModel.findOne({email})
    if(!user){
      return res.json({success:false, message:'User not found'})
    }

    if(user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({success:false, message: 'Invalid OTP'})
    }

    if(user.resetOtpExprieAt < Date.now()){
      return res.json({success: false, message:'OTP Expried'})
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    user.resetOtp = ''
    user.resetOtpExprieAt = 0

    await user.save()

    return res.json({success:true, message:'Password has been reset successfully'})

  } catch (error) {
    return res.json({success: false, message: error.message})
  }
}

// Verify Reset Otp
const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.json({ success: false, message: 'Email and OTP are required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (user.resetOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExprieAt < Date.now()) {
      return res.json({ success: false, message: 'OTP Expired' });
    }

    // Nếu OTP hợp lệ, bạn có thể trả về một success message
    // Hoặc bạn có thể tạo một token tạm thời để xác nhận
    // rằng người dùng đã xác thực OTP thành công.
    return res.json({ success: true, message: 'OTP verified successfully' });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
const getUserProfile = async (req, res) => {
  try {
    
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing userId' });
    }

    const user = await userModel.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('❌ getUserProfile error:', error.stack); // in chi tiết lỗi
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
//them san pham yeu thichthich
const addToWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: 'Missing userId or productId' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const alreadyExists = user.wishlist.some((item) => {
      return item && item._id?.toString() === productId;
    });

    if (alreadyExists) {
      return res.status(400).json({ success: false, message: 'Already in wishlist' });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    user.wishlist.push({
      _id: product._id,
      title: product.title || product.name,
      image: product.image?.[0] || '',
      price: product.price,
      category: product.category,
      subCategory: product.subCategory,
    });

    user.markModified('wishlist');
    await user.save();

    res.json({ success: true, message: 'Added to wishlist' });
  } catch (err) {
    console.error('❌ [addToWishlist] Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// líst san pham yeu thichthich
const getWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    console.error("❌ Get wishlist error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//xoa whishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(
      (item) => item && item._id?.toString() !== productId
    );

    user.markModified('wishlist');
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error removing from wishlist:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


const getUserWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const sendDiscountCode = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Khởi tạo transporter (hoặc thay bằng transporter global nếu có)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Iron Pulse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Mã giảm giá dành riêng cho bạn!',
      html: `
        <p>Cảm ơn bạn đã đăng ký. Đây là mã giảm giá đặc biệt dành cho bạn:</p>
        <h2>SALE2025</h2>
        <p>Áp dụng khi mua hàng tại website của chúng tôi.</p>
        <p>Trân trọng,<br/>Iron Pulse Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Discount code sent successfully!' });
  } catch (error) {
    console.error('Send discount error:', error);
    res.status(500).json({ message: 'Failed to send discount code' });
  }
};


export {
  loginUser,
  registerUser,
  staffLogin,
  adminLogin,
  getAllUsers,
  deleteUser,
  updateUserRole,
  blockUser,
  unblockUser,
  updateUser,
  createUser,
  getUserById,
  googleLogin,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
  verifyResetOtp,
  resetPassword,
  isAuthenticated,
  getUserProfile,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getUserWishlist,
  sendDiscountCode
};
