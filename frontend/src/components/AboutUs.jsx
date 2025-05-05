import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
  const { t } = useTranslation();
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
    alert(t('thankYouMessage'));
    setShowPopup(false);
    setFormData({ name: '', email: '' });
  };

  return (
    <div className="bg-black text-white py-10 px-5 relative">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          {t('aboutUsTitle')}
        </h1>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-6">
          {t('since2025')}
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-6">
          {t('aboutUsDescription1')}
        </p>
        <p className="text-base sm:text-lg md:text-xl mb-6">
          {t('aboutUsDescription2')}
        </p>
        <p className="text-base sm:text-lg md:text-xl mb-6">
          {t('aboutUsDescription3')}
        </p>
      </div>

      {/* Banner Section */}
      <div className="bg-yellow-500 text-center py-4 flex justify-center items-center">
        <h2 className="text-xl font-bold text-black mr-4">
          {t('membershipTitle')}
        </h2>
        <button
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition duration-300"
          onClick={() => setShowPopup(true)}
        >
          {t('popupButton')}
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
              {t('popupCloseButton')}
            </button>
            <h2 className="text-2xl font-bold mb-4">{t('popupTitle')}</h2>
            <p className="mb-4 text-sm text-gray-600">{t('popupDescription')}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder={t('popupNamePlaceholder')}
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded outline-none"
                required
              />
              <input
                type="email"
                name="email"
                placeholder={t('popupEmailPlaceholder')}
                value={formData.email}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded outline-none"
                required
              />
              <button
                type="submit"
                className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
              >
                {t('popupButton')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
