import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Modal, Rate } from 'antd';
import { ShopContext } from '../context/ShopContext';

const MyOrders = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportOrder, setSupportOrder] = useState(null);
  const [supportMessage, setSupportMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/orders`, {
          headers: { token },
        });
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, [token]);

  const handleReview = (order) => {
    setReviewOrder(order);
    setShowReviewModal(true);
  };

  const handleSupportRequest = (order) => {
    setSupportOrder(order);
    setShowSupportModal(true);
  };

  const submitReview = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/review`, {
        orderId: reviewOrder._id,
        rating,
        comment,
      }, {
        headers: { token },
      });

      if (res.data.success) {
        setShowReviewModal(false);
        setRating(5);
        setComment('');
        alert('Đánh giá của bạn đã được gửi!');
      } else {
        alert('Không thể gửi đánh giá.');
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi gửi đánh giá.');
    }
  };

  const submitSupportRequest = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/support-request`, {
        orderId: supportOrder._id,
        message: supportMessage,
      }, {
        headers: { token },
      });

      if (res.data.success) {
        setShowSupportModal(false);
        setSupportMessage('');
        alert('Yêu cầu của bạn đã được gửi!');
      } else {
        alert('Không thể gửi yêu cầu.');
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi gửi yêu cầu.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">MY ORDERS</h2>

      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        orders.map((order, i) => (
          <div key={i} className="border-b py-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="text-sm mb-1">
                <span className="font-semibold">{item.productName}</span> — {item.size} —
                Quantity: {item.quantity}
              </div>
            ))}

            <p className="text-sm text-gray-600 mt-1">
              Date: {new Date(order.createdAt).toDateString()}
            </p>
            <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>

            <div className="flex justify-between items-center mt-2">
              <span className="text-green-600 font-semibold">
                ● {order.status}
              </span>
              <button className="border px-3 py-1 rounded text-sm">Track Order</button>
            </div>

            {order.status.toLowerCase() === 'delivered' && (
              <div className="flex gap-2 mt-3">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  onClick={() => handleReview(order)}
                >
                  Đánh giá đơn hàng
                </button>
                <button
                  className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900"
                  onClick={() => handleSupportRequest(order)}
                >
                  Gửi yêu cầu hỗ trợ
                </button>
              </div>
            )}
          </div>
        ))
      )}

      <Modal
        title="Đánh giá đơn hàng"
        open={showReviewModal}
        onCancel={() => setShowReviewModal(false)}
        onOk={submitReview}
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
        title="Yêu cầu hỗ trợ đơn hàng"
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

export default MyOrders;