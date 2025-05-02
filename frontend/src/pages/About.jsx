import React, { useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {

   // Scroll to top on mount
   useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div>
      
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Chào mừng bạn đến với IronPulse – nơi thời trang gặp gỡ phong cách và cá tính!
          Tại IronPulse, chúng tôi tin rằng thời trang không chỉ đơn thuần là quần áo, mà còn là cách bạn thể hiện bản thân, tự tin bước đi và chinh phục mọi thử thách. Lấy cảm hứng từ sự mạnh mẽ và năng động, chúng tôi mang đến những thiết kế hiện đại, chất lượng cao, phù hợp với mọi phong cách – từ streetwear cá tính đến trang phục thanh lịch.</p>
          <p>Chúng tôi tin rằng thời trang không chỉ là trang phục, mà còn là tiếng nói của bản thân. IronPulse mang đến những thiết kế hiện đại, chất lượng cao, giúp bạn tự tin thể hiện phong cách – từ năng động, cá tính đến thanh lịch, tinh tế.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Tại IronPulse, sứ mệnh của chúng tôi là truyền cảm hứng cho bạn thông qua thời trang – giúp bạn tự tin thể hiện cá tính, vượt qua giới hạn và chinh phục mọi thử thách. Chúng tôi không chỉ tạo ra những bộ trang phục đẹp mà còn mang đến phong cách sống mạnh mẽ, năng động và đầy bản lĩnh.
          Với cam kết về chất lượng, xu hướng và sự sáng tạo, IronPulse luôn đồng hành cùng bạn trên hành trình khẳng định bản thân!</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Qualuty Assurance</b>
          <p className='text-gray-600' >Tại IronPulse, chất lượng luôn là ưu tiên hàng đầu. Chúng tôi cam kết mang đến những sản phẩm không chỉ đẹp mắt mà còn bền bỉ, thoải mái và phù hợp với mọi hoạt động hàng ngày.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Tại IronPulse, chúng tôi mang đến trải nghiệm mua sắm dễ dàng và tiện lợi nhất. Với giao diện website trực quan, bạn có thể nhanh chóng tìm kiếm, chọn mua và thanh toán chỉ trong vài bước đơn giản.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service</b>
          <p className='text-gray-600'  >Tại IronPulse, khách hàng luôn là trọng tâm trong mọi hoạt động của chúng tôi. Đội ngũ chăm sóc khách hàng tận tâm luôn sẵn sàng hỗ trợ, giải đáp mọi thắc mắc và đảm bảo bạn có trải nghiệm mua sắm tốt nhất.</p>
        </div>
      </div>

      <NewsletterBox/>

    </div>
  )
}

export default About
