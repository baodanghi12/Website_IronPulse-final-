import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Rate } from 'antd';

const Orders = () => {
  const { backendUrl, token, currency, products } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [supportMessage, setSupportMessage] = useState('');

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const allOrdersItems = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            const matchedProduct = products.find((p) => p._id === item.productId);

            const enrichedItem = {
              ...item,
              orderId: order._id,
              image: Array.isArray(matchedProduct?.image)
                ? matchedProduct.image
                : typeof matchedProduct?.image === 'string'
                ? [matchedProduct.image]
                : [],
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.createdAt || order.date,
            };

            allOrdersItems.push(enrichedItem);
          });
        });

        setOrderData(allOrdersItems.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi tải đơn hàng');
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const submitReview = async ({ orderId, productId, rating, comment }) => {
    const base = backendUrl || 'http://localhost:4000';
    try {
      const res = await axios.post(
        `${base}/api/order/${orderId}/review`,
        { productId, rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.data.success) {
        toast.success('Review submitted!');
        loadOrderData();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error('❌ Review API Error:', err);
      toast.error(err.message || 'Gửi đánh giá thất bại');
    }
  };

  const submitSupportRequest = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/support-request`, {
        productId: selectedOrderItem.productId,
        message: supportMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setShowSupportModal(false);
        setSupportMessage('');
        toast.success('Yêu cầu của bạn đã được gửi!');
      } else {
        toast.error('Không thể gửi yêu cầu.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi gửi yêu cầu.');
    }
  };

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img
                className="w-16 sm:w-20"
                src={
                  Array.isArray(item.image)
                    ? item.image[0]
                    : typeof item.image === 'string'
                    ? item.image
                    : ''
                }
                alt=""
              />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>{currency}{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="mt-1 text-gray-400">
                  Date: {new Date(item.date).toDateString()}
                </p>
                <p className="mt-1 text-gray-400">
                  Payment: {item.paymentMethod}
                </p>

                {item.review ? (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>⭐ {item.review.rating} - {item.review.comment}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(item.review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  item.status?.toLowerCase() === 'delivered' && (
                    <div className="flex gap-3 mt-2">
                      <button
                        className="text-blue-600 text-sm underline"
                        onClick={() => {
                          setSelectedReviewItem(item);
                          setShowReviewModal(true);
                        }}
                      >
                        Đánh giá
                      </button>
                      <button
                        className="text-gray-700 text-sm underline"
                        onClick={() => {
                          setSelectedOrderItem(item);
                          setShowSupportModal(true);
                        }}
                      >
                        Yêu cầu hỗ trợ
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button
                onClick={loadOrderData}
                className="border px-4 py-2 text-sm font-medium rounded-sm"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={`Đánh giá sản phẩm: ${selectedReviewItem?.name || ''}`}
        open={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        onOk={() =>
          submitReview({
            orderId: selectedReviewItem?.orderId,
            productId: selectedReviewItem?.productId,
            rating,
            comment
          }).then(() => {
            setShowReviewModal(false);
            setComment('');
            setRating(5);
          })
        }
        okText="Gửi"
        cancelText="Hủy"
      >
        <Rate onChange={setRating} value={rating} />
        <textarea
          className="w-full mt-3 border p-2 rounded"
          rows={4}
          placeholder="Nhận xét của bạn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Modal>

      <Modal
        title="Yêu cầu hỗ trợ"
        open={showSupportModal}
        onCancel={() => setShowSupportModal(false)}
        onOk={submitSupportRequest}
        okText="Gửi"
        cancelText="Hủy"
      >
        <textarea
          className="w-full mt-3 border p-2 rounded"
          rows={4}
          placeholder="Mô tả vấn đề bạn gặp phải..."
          value={supportMessage}
          onChange={(e) => setSupportMessage(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Orders;
