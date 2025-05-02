import React, { useEffect } from 'react'
import Title from '../../components/Title'

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='px-4 md:px-20'>
      <div className='text-2xl font-bold text-center pt-8'>
        FAQ - Câu hỏi thường gặp
      </div>

      <div className='my-10 flex flex-col gap-8 text-gray-700 leading-relaxed'>

        {/* 1. Đơn hàng */}
        <div className='text-xl font-semibold text-gray-800 pt-6'>
          1. Đơn Hàng
        </div>

        <div>
          <p className='font-semibold'>1.1 Làm thế nào để mua hàng trực tiếp tại IronPulse?</p>
          <p>Bạn có thể ghé hệ thống cửa hàng của IronPulse tại TP. Hồ Chí Minh nha!</p>
        </div>

        <div>
          <p className='font-semibold'>1.2 Làm thế nào để đặt hàng Online tại DirtyCoins?</p>
          <p>Bạn có thể vào Website: <span className="font-semibold">IronPulse.vn</span> để đặt hàng nhanh nhất nha!</p>
          <p>Hoặc nhắn tin qua các trang mạng xã hội: Facebook Fanpage, Instagram (IronPulse.vn), TikTok (@IronPulse.official), Shopee, Lazada (IronPulse), Tiki.</p>
        </div>

        <div>
          <p className='font-semibold'>1.3 Làm thế nào để biết đã đặt hàng thành công?</p>
          <p>Bạn sẽ nhận được email hoặc tin nhắn xác nhận từ IronPulse kèm mã đơn hàng nha!</p>
        </div>

        <div>
          <p className='font-semibold'>1.4 Làm thế nào để hủy đơn hàng đã đặt?</p>
          <p>Nhắn tin qua Facebook/Instagram của IronPulse hoặc liên hệ qua email <span className="font-semibold">ipcsteam@gmail.com</span> hoặc gọi Hotline <span className="font-semibold">0933 800 190 - 1900252557</span> để được hỗ trợ.</p>
        </div>

        <div>
          <p className='font-semibold'>1.5 Đặt hàng thành công thì bao lâu mình sẽ nhận được hàng?</p>
          <ul className='list-disc list-inside'>
            <li>Nội thành TP.HCM: 2-4 ngày.</li>
            <li>Tỉnh thành khác: 3-7 ngày tùy vận chuyển.</li>
          </ul>
          <p className='italic text-sm'>* Thời gian có thể lâu hơn vào mùa cao điểm hoặc do lý do bất khả kháng. Chủ nhật có thể không tính.</p>
        </div>

        <div>
          <p className='font-semibold'>1.6 Có thể đổi được thông tin khi đặt không?</p>
          <p>Hãy liên hệ IronPulse trong vòng 12-24h sau khi đặt để cập nhật thông tin nhé!</p>
        </div>

        <div>
          <p className='font-semibold'>1.7 Tôi có thể kiểm hàng khi nhận được hàng không?</p>
          <p>Có thể kiểm hàng trực tiếp với đơn hàng mua từ IronPulse Website/Facebook/Instagram/TikTok. Các đơn từ Shopee, Lazada, Tiki thì theo chính sách từng nền tảng nha.</p>
        </div>

        <div>
          <p className='font-semibold'>1.8 Tôi muốn thanh toán chuyển khoản trước được không?</p>
          <p>Bạn có thể chuyển khoản theo thông tin ngân hàng hiển thị trên Website hoặc nhắn tin page để được hỗ trợ gửi thông tin.</p>
        </div>

        <div>
          <p className='font-semibold'>1.9 Tôi muốn hoàn trả hàng, đổi sản phẩm, hoàn tiền thì làm như thế nào?</p>
          <ul className='list-disc list-inside'>
            <li>Đổi sản phẩm trong 10 ngày (mua tại cửa hàng) hoặc 15 ngày (mua online).</li>
            <li>Chỉ đổi sản phẩm cùng loại hoặc giá cao hơn, không hoàn tiền.</li>
            <li>Sản phẩm phải còn tag, chưa qua sử dụng, đầy đủ hóa đơn.</li>
            <li>Không đổi đồ lót, vớ tất.</li>
          </ul>
        </div>

        <div>
          <p className='font-semibold'>1.10 IronPulse giao thiếu đồ cho mình?</p>
          <p>Liên hệ ngay Facebook/Instagram hoặc Hotline để IronPulse xử lý nhanh nhất nhé! Đừng quên quay clip unbox nha!</p>
        </div>

        <div>
          <p className='font-semibold'>1.11 Phí giao hàng là bao nhiêu?</p>
          <ul className='list-disc list-inside'>
            <li>Hồ Chí Minh: 30.000VND/đơn hàng.</li>
            <li>Tỉnh khác: 35.000VND/đơn hàng.</li>
          </ul>
        </div>

        {/* 2. Chính sách Chăm sóc Khách hàng */}
        <div className='text-xl font-semibold text-gray-800 pt-6'>
          2. Chính sách Chăm sóc Khách hàng
        </div>

        <div>
          <p className='font-semibold'>2.1 Đối với các đơn Online đã từng mua tại IronPulse</p>
          <p>Staff sẽ gọi khảo sát trải nghiệm sản phẩm và thông báo ưu đãi hoặc sự kiện mới nha!</p>
        </div>

        <div>
          <p className='font-semibold'>2.2 Muốn khiếu nại thì làm như thế nào?</p>
          <p>Hãy gọi ngay Hotline <span className="font-semibold">0933 800 190 – 1900252557</span> từ 9h00-21h00, Thứ 2 - Chủ nhật để IronPulse hỗ trợ bạn tốt nhất nhé!</p>
        </div>

      </div>
    </div>
  )
}

export default FAQ
