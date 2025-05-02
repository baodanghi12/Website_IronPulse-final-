import React, { useEffect } from 'react'
import Title from '../../components/Title'

const WarantyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='px-4 md:px-20'>
      <div className='text-2xl font-bold text-center pt-8'>
        CHÍNH SÁCH BẢO HÀNH VÀ ĐỔI TRẢ
      </div>

      <div className='my-10 flex flex-col gap-8 text-gray-700 leading-relaxed'>

        <div className='text-xl font-semibold text-gray-800 pt-6'>
          1. Chính sách Bảo hành đối với từng loại sản phẩm
        </div>

        <ul className='list-disc list-inside'>
          <li>Đối với các sản phẩm áo thun (T-shirt, Polo...): 6 tháng</li>
          <li>Đối với các sản phẩm có hình in: 6 tháng</li>
          <li>Đối với các sản phẩm áo khoác như Varsity Jacket, Coach Jacket...: 3 tháng</li>
          <li>Đối với các sản phẩm phụ kiện như Backpack, Crossbody Bag, Slides, Sneakers...: 3 tháng</li>
        </ul>

        <p>
          Chính sách bảo hành áp dụng cho các lỗi từ nhà sản xuất như: sản phẩm bị ra màu, hình in bong tróc, hình in bị loang màu, thiếu hình in, lỗi dây kéo, lỗi dây rút.
        </p>

        <div className='text-xl font-semibold text-gray-800 pt-6'>
          2. Những trường hợp sẽ không được bảo hành
        </div>

        <ul className='list-disc list-inside'>
          <li>Sử dụng chất tẩy mạnh trên sản phẩm</li>
          <li>Ủi, sấy ở nhiệt độ cao</li>
          <li>Giặt chung với các sản phẩm đậm màu khác</li>
          <li>Sản phẩm hư hỏng do tác động bên ngoài: côn trùng, sinh vật, quá trình bảo quản</li>
          <li>Sản phẩm hư hỏng do tác động vật lý: va chạm, cọ xát, chà mạnh...</li>
        </ul>

        <div className='text-xl font-semibold text-gray-800 pt-6'>
          3. Chính sách Đổi trả sản phẩm đã mua
        </div>

        <p>
          DirtyCoins sẽ không hỗ trợ đổi các sản phẩm nằm trong các chương trình SALE hoặc ưu đãi và các sản phẩm cá nhân (ví dụ đồ lót). 
        </p>
        <p>
          Khách hàng có thể yêu cầu đổi sản phẩm trong vòng 10 (mười) ngày đối với các đơn hàng mua trực tiếp tại cửa hàng và 15 (mười lăm) ngày đối với các đơn hàng mua online.
        </p>
        <p>
          Các chi phí liên quan tới việc gửi trả sản phẩm cho DirtyCoins sẽ do khách hàng chi trả.
        </p>
        <p>
          DirtyCoins sẽ chỉ hỗ trợ đổi sản phẩm 01 (một) lần duy nhất; không hỗ trợ trả và hoàn tiền cho sản phẩm. Sản phẩm được đổi là sản phẩm cùng loại, cùng giá hoặc có giá cao hơn (khách hàng sẽ bù thêm phần tiền chênh lệch). Khách hàng sẽ không được hoàn tiền nếu mệnh giá sản phẩm đổi mới thấp hơn so với sản phẩm ban đầu.
        </p>

        <div className='text-xl font-semibold text-gray-800 pt-6'>
          4. Các quy định đối với sản phẩm được đổi
        </div>

        <ul className='list-disc list-inside'>
          <li>Không có dấu hiệu bị bẩn, có mùi lạ hoặc có dấu hiệu đã qua sử dụng</li>
          <li>Có kèm hóa đơn hoặc xác nhận mua hàng</li>
          <li>Có đầy đủ tag giấy và nhãn vải đính kèm sản phẩm</li>
          <li>Do lý do vệ sinh, các sản phẩm vớ (tất) và đồ lót sẽ không hỗ trợ đổi sản phẩm</li>
        </ul>

      </div>
    </div>
  )
}

export default WarantyPolicy
