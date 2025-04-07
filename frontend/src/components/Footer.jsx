import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <img src={assets.logo11} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>Từ năm 2025, Iron Pulse đã định nghĩa lại phong cách thời trang đường phố bằng cách kết hợp năng lượng thô sơ của văn hóa đô thị với những thiết kế táo bạo và sáng tạo. Mỗi sản phẩm chúng tôi tạo ra đều kể một câu chuyện - câu chuyện về sức bền, sự sáng tạo và cá tính. Hành trình của chúng tôi bắt đầu với tầm nhìn tôn vinh tinh thần đường phố, tạo ra những bộ sưu tập vượt ra ngoài thời trang để thể hiện bản chất của sự thể hiện bản thân.
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+84-901-165-226</li>
                <li>ironpulse2025@gmail.com</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Coyyright 2025@ironpulse.com - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
