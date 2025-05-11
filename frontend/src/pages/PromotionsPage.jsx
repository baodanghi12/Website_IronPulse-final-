import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PromotionsPage = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [promotions, setPromotions] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // Nếu không có token, chuyển hướng về trang đăng nhập
      navigate('/');
      return;
    }

    const fetchPromotions = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/promotions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setPromotions(data);
      } catch (err) {
        console.error("Lỗi khi lấy khuyến mãi:", err);
      }
    };

    fetchPromotions();
  }, [backendUrl, token, navigate]);

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>🎁 {t('promotions') || 'Khuyến mãi'}</h1>
      {promotions.length === 0 ? (
        <p className='text-gray-600'>Hiện chưa có khuyến mãi nào.</p>
      ) : (
        <div className='grid gap-6'>
          {promotions.map(promo => (
            <div key={promo._id} className='p-4 border rounded-lg shadow-sm bg-white'>
              <h2 className='text-lg font-semibold text-gray-800'>{promo.title}</h2>
              <p className='text-sm text-gray-500 mb-1'>{promo.description}</p>
              <p className='text-sm text-gray-600'>
                Mã: <span className='font-mono bg-gray-100 px-1 py-0.5 rounded'>{promo.code}</span>
              </p>
              <p className='text-sm text-gray-600'>
                Giá trị: {promo.type === 'percent' ? `${promo.value}%` : `${promo.value.toLocaleString()}₫`}
              </p>
              <p className='text-sm text-gray-500'>
                Thời gian: {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
              </p>
              <p className={`text-sm mt-1 font-semibold ${promo.isActive ? 'text-green-600' : 'text-red-500'}`}>
                {promo.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;
