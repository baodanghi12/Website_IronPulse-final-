import React, { useEffect } from 'react'
import Title from '../../components/Title'

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='px-4 md:px-20'>
  <div className='text-2xl font-bold text-center pt-8'>
    CHÍNH SÁCH BẢO MẬT THÔNG TIN CÁ NHÂN 
  </div>

      <div className='my-10 flex flex-col gap-8 text-gray-700 leading-relaxed'>

        <p>
          Cám ơn quý khách đã quan tâm và truy cập vào website. Chúng tôi tôn trọng và cam kết sẽ bảo mật những thông tin mang tính riêng tư của Quý khách.
        </p>
        <p>
          Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng và (trong trường hợp nào đó) tiết lộ thông tin cá nhân của Quý khách.
        </p>
        <p>
          Bảo vệ dữ liệu cá nhân và gây dựng được niềm tin cho quý khách là vấn đề rất quan trọng với chúng tôi. Vì vậy, chúng tôi sẽ dùng tên và các thông tin khác liên quan đến quý khách tuân thủ theo nội dung của Chính sách bảo mật. Chúng tôi chỉ thu thập những thông tin cần thiết liên quan đến giao dịch mua bán.
        </p>
        <p>
          Chúng tôi sẽ giữ thông tin của khách hàng trong thời gian luật pháp quy định hoặc cho mục đích nào đó. Quý khách có thể truy cập vào website và trình duyệt mà không cần phải cung cấp chi tiết cá nhân. Lúc đó, Quý khách đang ẩn danh và chúng tôi không thể biết bạn là ai nếu Quý khách không đăng nhập vào tài khoản của mình.
        </p>

        <div className='text-xl font-semibold text-gray-800 pt-6'>
          1. Thu thập thông tin cá nhân
        </div>

        <ul className='list-disc list-inside'>
          <li>
            Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình mua hàng và cho những thông báo sau này liên quan đến đơn hàng, và để cung cấp dịch vụ, bao gồm: danh hiệu, tên, giới tính, ngày sinh, email, địa chỉ, địa chỉ giao hàng, số điện thoại, fax, chi tiết thanh toán, chi tiết thẻ hoặc tài khoản ngân hàng.
          </li>
          <li>
            Chúng tôi sử dụng thông tin quý khách cung cấp để xử lý đơn đặt hàng, cung cấp dịch vụ yêu cầu, quản lý tài khoản, xác minh giao dịch, nhận diện khách hàng, nghiên cứu nhân khẩu học, và gửi thông tin tiếp thị nếu bạn đồng ý.
          </li>
          <li>
            Chúng tôi có thể chuyển tên và địa chỉ của quý khách cho bên thứ ba như đơn vị vận chuyển để giao hàng.
          </li>
          <li>
            Chi tiết đơn hàng được lưu giữ nhưng bảo mật; quý khách có thể truy cập khi đăng nhập tài khoản cá nhân.
          </li>
          <li>
            Quý khách cam kết bảo mật dữ liệu cá nhân và không tiết lộ cho bên thứ ba. Chúng tôi không chịu trách nhiệm nếu mật khẩu bị lộ do lỗi của quý khách.
          </li>
          <li>
            Chúng tôi có thể dùng thông tin cá nhân của quý khách để nghiên cứu thị trường dưới dạng ẩn danh. Quý khách có thể từ chối tham gia bất cứ lúc nào.
          </li>
        </ul>

        <div className='text-xl font-semibold text-gray-800 pt-6'>
          2. Bảo mật
        </div>

        <ul className='list-disc list-inside'>
          <li>
            Chúng tôi áp dụng các biện pháp kỹ thuật và an ninh phù hợp để ngăn chặn truy cập trái phép, mất mát hoặc thiệt hại thông tin.
          </li>
          <li>
            Chúng tôi khuyên quý khách không cung cấp thông tin thanh toán qua email. Chúng tôi không chịu trách nhiệm với các rủi ro khi trao đổi thông tin qua Internet/email.
          </li>
          <li>
            Tuyệt đối không can thiệp hệ thống hoặc làm thay đổi dữ liệu website. Các hành vi vi phạm sẽ bị truy cứu trách nhiệm pháp lý.
          </li>
          <li>
            Trong trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ cung cấp thông tin theo đúng quy định pháp luật Việt Nam.
          </li>
        </ul>

        <p>
          Các điều kiện, điều khoản và nội dung của website này được điều chỉnh bởi luật pháp Việt Nam và tòa án Việt Nam có thẩm quyền giải quyết.
        </p>

        <div className='text-xl font-semibold text-gray-800 pt-6'>
          3. Quyền lợi khách hàng
        </div>

        <ul className='list-disc list-inside'>
          <li>
            Quý khách có quyền yêu cầu truy cập vào dữ liệu cá nhân của mình.
          </li>
          <li>
            Quý khách có quyền yêu cầu chúng tôi chỉnh sửa các thông tin sai sót mà không mất phí.
          </li>
          <li>
            Quý khách có quyền yêu cầu ngưng sử dụng dữ liệu cá nhân cho mục đích tiếp thị bất cứ lúc nào.
          </li>
        </ul>

      </div>
    </div>
  )
}

export default PrivacyPolicy
