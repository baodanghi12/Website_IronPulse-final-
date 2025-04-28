import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
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
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ✅ Local dev sẽ là false
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ✅ Local dev sẽ là 'lax'
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    res.json({ success: true, token });
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
        role: user.role, // role: 'admin' | 'staff' | ...
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const token1 = createToken(user._id);

    res.cookie('token', token1, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // đúng là *1000
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
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    const { name, email, role, avatar, isBlocked, phone, dateOfBirth } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        name, email, role, avatar, isBlocked, phone,
        dateOfBirth,
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
      subject: '📩 Password Reset OTP',
      text: `Mã OTP để reset mật khẩu của bạn là: ${otp}. Mã có hiệu lực trong 24 giờ.`,

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
  isAuthenticated
};
