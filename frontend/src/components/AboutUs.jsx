import React, { useState } from 'react';
import { useEffect } from 'react';
const AboutUs = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
   useEffect(() => {
     window.scrollTo({ top: 0, behavior: 'smooth' });
   }, []);
  
  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    console.log('Đăng ký:', formData);
    alert('Cảm ơn bạn đã đăng ký!');
    setShowPopup(false);
    setFormData({ name: '', email: '' });
  };

  return (
    <div className="bg-black text-white py-10 px-5 relative">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          STORIES, STYLES AND STREETWEAR AT IRON PULSE,
        </h1>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6">
          SINCE 2025
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-6">
          Since 2025, Iron Pulse has been redefining streetwear by weaving together the raw energy of urban culture with bold, innovative designs. Our journey began with a vision to create unique, artistic collections that embody fashion’s ability to serve as a self-expression.
        </p>
        <p className="text-base sm:text-lg md:text-xl mb-6">
          From oversized hoodies to graphic tees, each piece tells a story, reflecting the spirit of the streets and the individuality of those who wear them. We believe that fashion is not just about clothing; it's an art form, a way to express who you are.
        </p>
        <p className="text-base sm:text-lg md:text-xl mb-6">
          Iron Pulse is a brand that's more than just apparel; it's a movement, an attitude, and a lifestyle. With Iron Pulse, you’re not just wearing streetwear; you’re living it, shaping it and telling your story with every step.
        </p>
      </div>

      {/* Banner Section */}
      <div className="bg-yellow-500 text-center py-4 flex justify-center items-center">
        <h2 className="text-xl font-bold text-black mr-4">
          TRỞ THÀNH HỘI VIÊN & HƯỞNG ƯU ĐÃI 20%
        </h2>
        <button
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition duration-300"
          onClick={() => setShowPopup(true)}
        >
          ĐĂNG KÝ MIỄN PHÍ →
        </button>
      </div>

      {/* Popup đăng ký */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white text-black p-8 rounded-lg shadow-lg w-11/12 max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Đăng ký thành viên</h2>
            <p className="mb-4 text-sm text-gray-600">Nhận ưu đãi 20% cho đơn hàng đầu tiên của bạn!</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email của bạn"
                value={formData.email}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded outline-none"
                required
              />
              <button
                type="submit"
                className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
              >
                Đăng ký ngay
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
