import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const backendUrl = "http://localhost:4000";
  const otpInputRefs = useRef([]);
  const navigate = useNavigate();

  // Hàm kiểm tra email hợp lệ
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Hàm kiểm tra mật khẩu hợp lệ
  const isValidPassword = (password) => {
    // Kiểm tra mật khẩu có ít nhất 1 chữ cái, 1 chữ số và 1 ký tự đặc biệt
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,20}$/;
    return regex.test(password);
  };

  useEffect(() => {
    if (step === 2) otpInputRefs.current[0]?.focus();
  }, [step]);

  const handleChangeOtp = (index, event) => {
    const value = event.target.value;
    if (isNaN(value)) return;
    const newOtp = otp.split('');
    newOtp[index] = value;
    setOtp(newOtp.join(''));
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDownOtp = (index, event) => {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error('Email không hợp lệ!');
      return;
    }
    try {
      const response = await axios.post(backendUrl + '/api/user/send-reset-otp', { email });
      response.data.success ? (toast.success('OTP đã gửi vào email'), setStep(2)) : toast.error(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi từ máy chủ');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Mã OTP phải có 6 chữ số');
      return;
    }
    try {
      const response = await axios.post(backendUrl + '/api/user/verify-reset-otp', { email, otp });
      if (response.data.success) {
        setIsOtpVerified(true);
        setStep(3);
        toast.success('OTP xác thực thành công');
      } else {
        toast.error('OTP không chính xác hoặc đã hết hạn');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi từ máy chủ');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isOtpVerified) return toast.error('OTP không hợp lệ');
    if (newPassword !== confirmPassword) {
      return toast.error('Mật khẩu và xác nhận mật khẩu không khớp');
    }
    if (!isValidPassword(newPassword)) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự và chứa chữ cái và số');
      return;
    }
    try {
      const response = await axios.post(backendUrl + '/api/user/reset-password', { email, otp, newPassword });
      if (response.data.success) {
        toast.success('Mật khẩu đã được thay đổi');
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi từ máy chủ');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-800 bg-opacity-50 backdrop-blur-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={cardVariants}
          initial="hidden"
          animate="enter"
          exit="exit"
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6"
        >
          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <h2 className="text-3xl font-semibold text-center text-indigo-700">Quên mật khẩu</h2>
              <p className="text-center text-gray-600 mb-4">Nhập email của bạn để nhận mã OTP</p>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                Gửi mã OTP
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <h2 className="text-3xl font-semibold text-center text-indigo-700">Xác thực OTP</h2>
              <p className="text-center text-gray-600 mb-4">Nhập mã 6 số từ email của bạn</p>
              <div className="flex justify-center space-x-2">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    value={otp[i] || ''}
                    onChange={(e) => handleChangeOtp(i, e)}
                    onKeyDown={(e) => handleKeyDownOtp(i, e)}
                    ref={(el) => (otpInputRefs.current[i] = el)}
                    className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                disabled={otp.length !== 6}
              >
                Xác thực OTP
              </button>
            </form>
          )}

          {step === 3 && isOtpVerified && (
            <form onSubmit={handleResetPassword}>
              <h2 className="text-3xl font-semibold text-center text-indigo-700">Đặt lại mật khẩu</h2>
              <p className="text-center text-gray-600 mb-4">Nhập mật khẩu mới của bạn</p>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none mt-4"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                Đặt lại mật khẩu
              </button>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ForgetPassword;
