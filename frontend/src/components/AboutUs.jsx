import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AboutUs = () => {
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ email: '' });
  const backendUrl = "http://localhost:4000";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + '/api/user/send-discount', { email: formData.email });

      if (response.status === 200) {
        toast.success(t('thankYouMessage'));
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to send discount code');
    }

    setShowPopup(false);
    setFormData({ email: '' });
  };

  return (
    <div className="bg-black text-white py-10 px-5 relative">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

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

      {/* Popup with animation */}
      {showPopup && (
        <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50 backdrop-blur-xl">
          <div className="relative bg-white text-black p-8 rounded-lg shadow-2xl w-11/12 max-w-md transform animate-fade-in-up">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{t('popupTitle')}</h2>
            <p className="mb-4 text-sm text-gray-600">{t('popupDescription')}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                placeholder={t('popupEmailPlaceholder')}
                value={formData.email}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-black"
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
