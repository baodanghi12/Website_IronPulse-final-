import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white p-12 border-t-4 border-purple-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Exclusive Section */}
        <div>
          <h3 className="text-xl font-bold">{t('storeSystem')}</h3>
          <p className="mt-3 text-gray-300">{t('storeAddress')}</p>
        </div>

        {/* Product Section */}
        <div>
          <h3 className="text-xl font-bold">{t('products')}</h3>
          <ul className="mt-3 space-y-2 text-gray-400 text-sm">
            <li><Link to="/men" className="hover:text-white">{t('men')}</Link></li>
            <li><Link to="/women" className="hover:text-white">{t('women')}</Link></li>
            <li><Link to="/children" className="hover:text-white">{t('children')}</Link></li>
            <li><Link to="/new-arrivals" className="hover:text-white">{t('newArrivals')}</Link></li>
            <li><Link to="/category/sale" className="hover:text-white">{t('sale')}</Link></li>
          </ul>
        </div>

        {/* Company Info Section */}
        <div>
          <h3 className="text-xl font-bold">{t('companyInfo')}</h3>
          <ul className="mt-3 space-y-2 text-gray-400 text-sm">
            <li><Link to="/about" className="hover:text-white">{t('aboutUs')}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{t('contactUs')}</Link></li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-xl font-bold">{t('policies')}</h3>
          <ul className="mt-3 space-y-2 text-gray-400 text-sm">
            <li><Link to="/PrivacyPolicy" className="hover:text-white">{t('privacyPolicy')}</Link></li>
            <li><Link to="/WarantyPolicy" className="hover:text-white">{t('warrantyPolicy')}</Link></li>
            <li><Link to="/DeliveryPolicy" className="hover:text-white">{t('deliveryPolicy')}</Link></li>
            <li><Link to="/FAQ" className="hover:text-white">{t('faq')}</Link></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-xl font-bold">{t('followUs')}</h3>
          <div className="flex space-x-4 mt-4">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <img 
                src={assets.f_img} 
                alt={t('facebook')} 
                className="w-6 h-6 cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:brightness-125" 
              />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <img 
                src={assets.I_img} 
                alt={t('instagram')} 
                className="w-6 h-6 cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:brightness-125" 
              />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <img 
                src={assets.t_img} 
                alt={t('twitter')} 
                className="w-6 h-6 cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:brightness-125" 
              />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
              <img 
                src={assets.y_img} 
                alt={t('linkedin')} 
                className="w-6 h-6 cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:brightness-125" 
              />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
        {t('copyright')}
      </div>
    </footer>
  );
}
