import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Rate } from 'antd';

const Orders = () => {
  const { backendUrl, token, currency, products } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [sortOption, setSortOption] = useState('newest'); // ✅ Thêm sortOption

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [supportMessage, setSupportMessage] = useState('');

  const ORDER_STEPS = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'];

  const loadOrderData = async () => {
    try {
      if (!token) return;
      const res = await axios.post(`${backendUrl}/api/order/userorders`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setOrderData(res.data.orders);
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi tải đơn hàng');
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // ✅ Hàm sắp xếp
  const sortOrders = (orders, option) => {
    const sorted = [...orders];
    switch (option) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'highToLow':
        return sorted.sort((a, b) => b.amount - a.amount);
      case 'lowToHigh':
        return sorted.sort((a, b) => a.amount - b.amount);
      case 'status':
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      default:
        return sorted;
    }
  };

  const submitReview = async ({ orderId, productId, rating, comment }) => {
    try {
      const res = await axios.post(`${backendUrl}/api/order/${orderId}/review`,
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success('Đánh giá đã được gửi!');
        loadOrderData();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Gửi đánh giá thất bại');
    }
  };

  const submitSupportRequest = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/support-request`,
        {
          productId: selectedOrderItem.productId,
          message: supportMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setShowSupportModal(false);
        setSupportMessage('');
        toast.success('Yêu cầu hỗ trợ đã được gửi!');
      } else {
        toast.error('Không thể gửi yêu cầu hỗ trợ.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi gửi yêu cầu hỗ trợ.');
    }
  };

  return (
    <div className="border-t pt-16 px-4 sm:px-8 max-w-5xl mx-auto">
      <div className="text-2xl mb-6">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {/* ✅ Dropdown sắp xếp */}
      <div className="mb-6">
        <label className="mr-2 font-medium text-sm">Sắp xếp theo:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border px-3 py-1 rounded text-sm"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="highToLow">Tổng tiền: cao → thấp</option>
          <option value="lowToHigh">Tổng tiền: thấp → cao</option>
          <option value="status">Trạng thái đơn hàng</option>
        </select>
      </div>

      <div className="space-y-8">
        {sortOrders(orderData, sortOption).map((order, index) => {
          const statusIndex = ORDER_STEPS.findIndex(step => step === order.status);

          return (
            <div key={index} className="bg-white rounded-xl shadow border p-6">
              <div className="mb-6">
                <div className="flex justify-center">
                  <div className="flex items-center w-full max-w-2xl">
                    {ORDER_STEPS.map((step, i) => (
                      <div key={i} className="flex-1 flex items-center">
                        <div className={`w-4 h-4 rounded-full z-10 ${i <= statusIndex ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        {i < ORDER_STEPS.length - 1 && (
                          <div className={`flex-1 h-1 ${i < statusIndex ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center gap-2 text-xs text-gray-600 mt-1">
                  {ORDER_STEPS.map((step, i) => (
                    <span key={i} className={`${i === statusIndex ? 'text-green-700 font-semibold' : ''}`}>{step}</span>
                  ))}
                </div>
              </div>

              <div className="text-right text-sm text-gray-600 mb-2">
                {new Date(order.createdAt).toLocaleString('vi-VN', {
                  hour: '2-digit', minute: '2-digit', second: '2-digit',
                  day: '2-digit', month: '2-digit', year: 'numeric'
                })}
              </div>

              <div className="space-y-4 border-t pt-4">
                {order.items.map((item, idx) => {
                  const matchedProduct = products.find(p => p._id === item.productId);
                  const image = Array.isArray(matchedProduct?.image)
                    ? matchedProduct.image[0]
                    : typeof matchedProduct?.image === 'string'
                      ? matchedProduct.image
                      : null;

                  return (
                    <div key={idx} className="flex items-center gap-4">
                      {image ? (
                        <img
                          src={image}
                          className="w-20 h-20 object-cover rounded border"
                          alt={item.name}
                        />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 border rounded text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                      <div className="flex-1 text-sm text-gray-800">
                        <div className="mb-1">
                          <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                            #{order._id.slice(-6)}
                          </span>
                        </div>
                        <p className="font-medium text-base">{item.name}</p>
                        <p className="text-sm">Quantity: {item.quantity} | Size: {item.size}</p>
                        {item.review ? (
                          <div className="text-gray-500 mt-1 text-sm">
                            <p>⭐ {item.review.rating} - {item.review.comment}</p>
                            <p className="text-xs">{new Date(item.review.createdAt).toLocaleDateString()}</p>
                          </div>
                        ) : order.status.toLowerCase() === 'delivered' && (
                          <div className="flex gap-3 mt-2">
                            <button
                              onClick={() => {
                                setSelectedReviewItem({ ...item, orderId: order._id });
                                setShowReviewModal(true);
                              }}
                              className="text-blue-600 text-sm underline"
                            >Đánh giá</button>
                            <button
                              onClick={() => {
                                setSelectedOrderItem(item);
                                setShowSupportModal(true);
                              }}
                              className="text-gray-600 text-sm underline"
                            >Yêu cầu hỗ trợ</button>
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-700 min-w-[120px]">
                        <p><span className="font-semibold">Total:</span> {currency}{order.amount}</p>
                        <p><span className="font-semibold">Payment:</span> {order.paymentMethod}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
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