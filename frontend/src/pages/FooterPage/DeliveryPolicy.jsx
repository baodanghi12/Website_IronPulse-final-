import React, { useEffect } from 'react'
import Title from '../../components/Title'

const DeliveryPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='px-4 md:px-20'>
      <div className='text-2xl font-bold text-center pt-8'>
        CHÍNH SÁCH GIAO HÀNG HỎA TỐC
      </div>

      <div className='my-10 flex flex-col gap-8 text-gray-700 leading-relaxed'>

        <p>
          Bạn đã đặt hàng tại IRONPULSE nhưng lại không thể chờ quá lâu để nhận được sản phẩm theo cách thức giao hàng thông thường? Hãy chọn phương thức “GIAO HÀNG HOẢ TỐC" ngay!!!
        </p>

        <div className='text-xl font-semibold text-gray-800 pt-6'>
          Điều kiện của “GIAO HÀNG HOẢ TỐC” tại IRONPULSE
        </div>

        <ul className='list-disc list-inside'>
          <li>Từ 1/2025, chương trình “GIAO HÀNG HOẢ TỐC” được triển khai áp dụng khu vực nội thành, với mức phí từ 20,000 cho mỗi đơn hàng. Mức phí chính xác phụ thuộc vào địa điểm giao hàng và được báo bởi nhân viên tư vấn khi đơn hàng được xác nhận.</li>
          <li>Thời gian áp dụng: Các đơn hàng đặt từ 9h00 - 21h00 tất cả các ngày trong tuần, trừ trường hợp đơn vị vận chuyển ngưng hoạt động.</li>
          <li>Dịch vụ “GIAO HÀNG HOẢ TỐC” áp dụng cho đơn đặt hàng thành công sử dụng bất kỳ hình thức thanh toán nào.</li>
          <li>Các sản phẩm áp dụng “GIAO HÀNG HOẢ TỐC” sẽ được vận chuyển từ các cửa hàng của IRONPULSE.</li>
          <li>Áp dụng cho tất cả các quận nội thành có cửa hàng của IRONPULSE bao gồm: TP.HCM, TP. Biên Hoà – Đồng Nai, TP. Cần Thơ, TP. Bình Dương, TP. Hà Nội.</li>
        </ul>

        <div className='text-xl font-semibold text-gray-800 pt-6'>
          Một số lưu ý của “SHIP HOẢ TỐC” tại IRONPULSE
        </div>

        <p>Các trường hợp dưới đây sẽ không được tính là lỗi từ phía IRONPULSE và nằm ngoài phạm vi cam kết:</p>

        <ul className='list-disc list-inside'>
          <li>Khách hàng không cung cấp chính xác địa chỉ giao hàng và thông tin liên lạc ("Thông tin Giao hàng").</li>
          <li>Thời gian giao hàng đến địa chỉ đã được ấn định trước với khách hàng nhưng khách hàng không sẵn sàng để nhận hàng.</li>
          <li>IRONPULSE đã giao hàng đúng hẹn theo "Thông tin Giao hàng" nhưng khách hàng để nhân viên giao hàng chờ quá 10 phút và mọi nỗ lực liên lạc đều không thành công.</li>
          <li>Những trường hợp bất khả kháng như thiên tai, gián đoạn mạng lưới giao thông diện rộng và những trục trặc bất khả kháng từ phía đối tác vận chuyển.</li>
        </ul>

        <div className='text-xl font-semibold text-gray-800 pt-6'>
          Thông tin liên hệ
        </div>

        <p>
          Đối với mọi thông tin liên hệ và hỗ trợ về chương trình, vui lòng liên hệ theo HOTLINE <span className="font-semibold">0933800190</span>.
        </p>

      </div>
    </div>
  )
}

export default DeliveryPolicy
