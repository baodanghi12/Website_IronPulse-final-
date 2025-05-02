import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

export default function Footer() {
  return (
    <footer className="bg-black text-white p-12 border-t-4 border-purple-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Exclusive Section */}
        <div>
          <h3 className="text-xl font-bold">Store System</h3>
          <p className="mt-3 text-gray-300">Phường Đa Kao, Quận 1, Thành phố Hồ Chí Minh.</p>
        </div>

        {/* Product Section */}
        <div>
          <h3 className="text-xl font-bold">Sản phẩm</h3>
          <ul className="mt-3 space-y-2 text-gray-400 text-sm">
            <li><Link to="/men" className="hover:text-white">Đồ Nam</Link></li>
            <li><Link to="/women" className="hover:text-white">Đồ Nữ</Link></li>
            <li><Link to="/children" className="hover:text-white">Trẻ em</Link></li>
            <li><Link to="/new-arrivals" className="hover:text-white">Hàng mới về</Link></li>
            <li><Link to="/category/sale" className="hover:text-white">Sale Off</Link></li>
          </ul>
        </div>

        {/* Company Info Section */}
        <div>
          <h3 className="text-xl font-bold">Thông tin về công ty</h3>
          <ul className="mt-3 space-y-2 text-gray-400 text-sm">
            <li><Link to="/about" className="hover:text-white">Giới thiệu</Link></li>
            <li><Link to="/contact" className="hover:text-white">Liên hệ với chúng tôi</Link></li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-xl font-bold">Chính sách</h3>
          <ul className="mt-3 space-y-2 text-gray-400 text-sm">
            <li><Link to="/PrivacyPolicy" className="hover:text-white">Chính sách bảo mật</Link></li>
            <li><Link to="/WarantyPolicy" className="hover:text-white">Chính sách Bảo hành & Đổi trả</Link></li>
            <li><Link to="/DeliveryPolicy" className="hover:text-white">Chính sách giao hàng hỏa tốc</Link></li>
            <li><Link to="/FAQ" className="hover:text-white">FAQ-Câu hỏi thường gặp</Link></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-xl font-bold">Theo dõi chúng tôi</h3>
          <div className="flex space-x-4 mt-4">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <img 
                src={assets.f_img} 
                alt="Facebook" 
                className="w-6 h-6 cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:brightness-125" 
              />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <img 
                src={assets.I_img} 
                alt="Instagram" 
                className="w-6 h-6 cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:brightness-125" 
              />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <img 
                src={assets.t_img} 
                alt="Twitter" 
                className="w-6 h-6 cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:brightness-125" 
              />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
              <img 
                src={assets.y_img} 
                alt="LinkedIn" 
                className="w-6 h-6 cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:brightness-125" 
              />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
        © Copyright Rimel 2025. All Rights Reserved
      </div>
    </footer>
  );
}
