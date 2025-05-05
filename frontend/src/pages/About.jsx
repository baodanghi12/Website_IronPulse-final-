import React, { useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useTranslation } from 'react-i18next'

const About = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={t('aboutTitle1')} text2={t('aboutTitle2')} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>{t('aboutParagraph1')}</p>
          <p>{t('aboutParagraph2')}</p>
          <b className='text-gray-800'>{t('missionTitle')}</b>
          <p>{t('aboutParagraph3')}</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={t('whyChooseTitle1')} text2={t('whyChooseTitle2')} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>{t('qualityTitle')}</b>
          <p className='text-gray-600'>{t('qualityText')}</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>{t('convenienceTitle')}</b>
          <p className='text-gray-600'>{t('convenienceText')}</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>{t('serviceTitle')}</b>
          <p className='text-gray-600'>{t('serviceText')}</p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About
