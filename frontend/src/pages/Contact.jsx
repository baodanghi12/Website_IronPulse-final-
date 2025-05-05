import React, { useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
   // Scroll to top on mount
     useEffect(() => {
      window.scrollTo(0, 0)
    }, [])
    return (
      <div>
        <div className='text-center text-xl pt-10 border-t'>
          <Title text1={t('contactTitle1')} text2={t('contactTitle2')} />
        </div>
  
        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
          <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
          <div className='flex flex-col justify-center items-start gap-6'>
            <p className='font-semibold text-xl text-gray-600'>{t('storeTitle')}</p>
            <p className='text-gray-500'>{t('storeAddress')}</p>
            <p className='text-gray-500'>{t('storeTel')} <br /> {t('storeEmail')}</p>
            <p className='font-semibold text-xl text-gray-600'>{t('careersTitle')}</p>
            <p className='text-gray-500'>{t('careersDescription')}</p>
            <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>{t('exploreJobsButton')}</button>
          </div>
        </div>
  
        <NewsletterBox />
      </div>
    );
  };

export default Contact
