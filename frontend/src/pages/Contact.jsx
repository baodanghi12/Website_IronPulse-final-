import React, { useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
   // Scroll to top on mount
     useEffect(() => {
      window.scrollTo(0, 0)
    }, [])
  return (
    <div>
      
      <div className='text-center text-xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>120 Hai Ba Trung <br /> DaKao, Quan 1, VietNam</p>
          <p className='text-gray-500'>Tel: (901) 165-226 <br /> Email: ironpluse@gmail.com</p>
          <p className='font-semibold text-xl text-gray-600'>Carrers at Forever</p>
          <p className='text-gray-500'>Tìm hiểu thêm về đội ngũ của chúng tôi và việc làm đang tuyển dụng.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact
