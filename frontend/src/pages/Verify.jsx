import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams, setSearchParams]  = useSearchParams()

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const paymentMethod = searchParams.get('paymentMethod'); // Lấy phương thức thanh toán từ URL

    const verifyPayment = async () => {
        try {
            if (!token) {
                return null
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe', { success, orderId }, {
                headers: { Authorization: `Bearer ${token}` }})

            if (response.data.success) {
                setCartItems({})
                navigate('/orders')
            } else {
                navigate('/cart')
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    }

    const verifyZalopayPayment = async () => {
        try {
          if (!token || !orderId) {
            toast.error('Thiếu token hoặc orderId!');
            return;
          }
      
          const response = await axios.post(
            `${backendUrl}/api/order/mark-paid`,
            { orderId },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
      
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message || 'Không xác nhận được thanh toán!');
            navigate('/cart');
          }
        } catch (error) {
          console.error(error);
          toast.error('Xác nhận thanh toán ZaloPay thất bại!');
          navigate('/cart');
        }
      };
      
      
    useEffect(() => {
        if (paymentMethod === 'zalopay') {
            verifyZalopayPayment();
        } else if (paymentMethod === 'stripe') {
            verifyPayment();
        } else {
            // Xử lý trường hợp không xác định được phương thức thanh toán
            console.warn('Không xác định được phương thức thanh toán.');
            navigate('/cart'); // Hoặc chuyển hướng đến trang lỗi
        }
    }, [token, paymentMethod]);

    return (
        <div>

        </div>
    )
}

export default Verify