import React from 'react';
import { useTranslation } from 'react-i18next';

const NewsletterBox = () => {
  const { t } = useTranslation();

  const onSubmitHandler = (event) => {
    event.preventDefault();
  }

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>{t('subscribeTitle')}</p>
      <p className='text-gray-400 mt-3'>
        {t('subscribeDescription')}
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input className='w-full sm:flex-1 outline-none' type="email" placeholder={t('emailPlaceholder')} required/>
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>{t('subscribeButton')}</button>
      </form>
    </div>
  )
}

export default NewsletterBox;
