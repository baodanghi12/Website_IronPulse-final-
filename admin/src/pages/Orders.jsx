import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('customer');
  const [orderStatus, setOrderStatus] = useState(selectedOrder?.status || '');
  const [paymentStatus, setPaymentStatus] = useState(selectedOrder?.payment ? 'Done' : 'Pending');

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  useEffect(() => {
    if (selectedOrder) {
      setOrderStatus(selectedOrder.status || '');
      setPaymentStatus(selectedOrder.payment ? 'Done' : 'Pending');
    }
  }, [selectedOrder]);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Order Page</h3>

      {orders.length === 0 ? (
        <p className='text-gray-500 italic'>No orders found.</p>
      ) : (
        
        orders.map((order, index) => (
          <div
            key={index}
            className='cursor-pointer grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition'
            onClick={() => setSelectedOrder(order)}
          >
            <img className='w-12' src={assets.parcel_icon} alt='Parcel Icon' />

            <div>
              <div>
                {order.items?.map((item, idx) => (
                  <p className='py-0.5' key={idx}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                  </p>
                ))}
              </div>
              <p className='mt-3 mb-2 font-medium'>
                {order.address?.fristName} {order.address?.lastName}
              </p>
              <div>
                <p>{order.address?.street},</p>
                <p>
                  {order.address?.city}, {order.address?.state},{' '}
                  {order.address?.country}, {order.address?.zipcode}
                </p>
              </div>
              <p>{order.address?.phone}</p>
            </div>

            <div>
              <p className='text-sm sm:text-[15px]'>Items: {order.items?.length}</p>
              <p className='mt-3'>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>

            <p className='text-sm sm:text-[15px]'>
              {currency} {order.amount}
            </p>

            <select
              className='p-2 font-semibold bg-gray-100'
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              onClick={(e) => e.stopPropagation()}
            >
              <option value='Order Placed'>Order Placed</option>
              <option value='Packing'>Packing</option>
              <option value='Shipped'>Shipped</option>
              <option value='Out for delivery'>Out for delivery</option>
              <option value='Delivered'>Delivered</option>
            </select>
          </div>
        ))
      )}

      {/* Popup Order Detail */}
      {selectedOrder && (
        <div
          className='fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-transparent'
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className='w-full max-w-3xl p-6 rounded-xl shadow-xl border border-gray-300 overflow-y-auto max-h-[80vh] bg-white bg-opacity-90 transition-all transform scale-95 opacity-100 animate-pop'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className='absolute top-3 right-3 text-gray-500 hover:text-black text-xl'
              onClick={() => setSelectedOrder(null)}
            >
              ✖
            </button>

            <h3 className='text-xl font-semibold mb-4 text-center text-gray-800'>
              Order Details
            </h3>

            {/* Info + Status Side-by-Side */}
            <div className='flex justify-between items-center mb-6'>
              {/* Avatar + Info */}
              <div className='flex items-center space-x-4'>
                <img
                  src={selectedOrder.avatar || 'default-avatar.png'}
                  alt='Avatar'
                  className='w-16 h-16 rounded-full object-cover'
                />
                <div>
                  <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                  <p><strong>Name:</strong> {selectedOrder.address?.fristName} {selectedOrder.address?.lastName}</p>
                  <p><strong>Phone:</strong> {selectedOrder.address?.phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.address?.street}, {selectedOrder.address?.city}, {selectedOrder.address?.state}, {selectedOrder.address?.country}, {selectedOrder.address?.zipcode}</p>
                </div>
              </div>

              {/* Order Status & Payment Status */}
              <div className='text-sm text-right space-y-2'>
              <div>
  <label className='font-medium mr-2'>Order Status:</label>
  <select
    className={`p-1 border rounded-md bg-white
      ${
        orderStatus === 'Order Placed'
          ? 'bg-yellow-100 text-yellow-800'
          : orderStatus === 'Packing'
          ? 'bg-purple-100 text-purple-700'
          : orderStatus === 'Shipped'
          ? 'bg-blue-100 text-blue-700'
          : orderStatus === 'Out for delivery'
          ? 'bg-orange-100 text-orange-700'
          : orderStatus === 'Delivered'
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-700'
      }
    `}
    value={orderStatus}
    onChange={(e) => setOrderStatus(e.target.value)}
    disabled={selectedOrder.status === 'Delivered' && selectedOrder.payment}
  >
    <option value='Order Placed'>Order Placed</option>
    <option value='Packing'>Packing</option>
    <option value='Shipped'>Shipped</option>
    <option value='Out for delivery'>Out for delivery</option>
    <option value='Delivered'>Delivered</option>
  </select>
</div>


{/* Payment Status Dropdown with color */}
<div>
  <label className='font-medium mr-2'>Payment:</label>
  <select
    className={`p-1 border rounded-md bg-white ${
      paymentStatus === 'Done'
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-800'
    }`}
    value={paymentStatus}
    onChange={(e) => setPaymentStatus(e.target.value)}
    disabled={selectedOrder.status === 'Delivered' && selectedOrder.payment}
  >
    <option value='Done'>Done</option>
    <option value='Pending'>Pending</option>
  </select>
</div>


                {/* Update Button */}
                <button
  className={`mt-2 px-4 py-1 text-white rounded transition ${
    selectedOrder.status === 'Delivered' && selectedOrder.payment
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-500 hover:bg-blue-600'
  }`}
  disabled={selectedOrder.status === 'Delivered' && selectedOrder.payment}
  onClick={async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        {
          orderId: selectedOrder._id,
          status: orderStatus,
          payment: paymentStatus === 'Done',
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Status updated successfully');
        fetchAllOrders(); // Refresh order list
        setSelectedOrder(null); // Close popup
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }}
>
  Update Status
</button>

              </div>
            </div>

            {/* Details */}
            <div className='text-sm text-gray-800 space-y-2'>
              
              <hr className='my-3' />

              <p className='flex items-center gap-2'>
  <strong>Payment Method:</strong>
  {selectedOrder.paymentMethod === 'COD' ? (
    <span className='bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1'>
      <img src={assets.cod_icon} alt='cod' className='w-4 h-4' />
      Cash on Delivery
    </span>
  ) : (
    <span className='bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium'>
      Paid Online
    </span>
  )}
</p>


              <hr className='my-3' />

              {/* Items Table */}
<table className='w-full table-auto border border-gray-300'>
  <thead className='bg-gray-100'>
    <tr>
      <th className='text-left px-2 py-1'>#</th> {/* Cột STT */}
      <th className='text-left px-2 py-1'>Item Name</th>
      <th className='text-left px-2 py-1'>Quantity</th>
      <th className='text-left px-2 py-1'>Price</th>
    </tr>
  </thead>
  <tbody>
    {selectedOrder.items.map((item, idx) => (
      <tr key={idx} className='border-t'>
        <td className='px-2 py-1'>{idx + 1}</td> {/* Hiển thị STT */}
        <td className='px-2 py-1'>{item.name}</td>
        <td className='px-2 py-1'>{item.quantity}</td>
        <td className='px-2 py-1'>{currency} {item.price}</td>
      </tr>
    ))}
  </tbody>
</table>

              <hr className='my-3' />

              {/* Summary */}
              <div className='flex flex-col text-right space-y-1'>
                <p><strong>Subtotal:</strong> {currency} {selectedOrder.subtotal}</p>
                <p><strong>Discount:</strong> {currency} {selectedOrder.discount}</p>
                <p><strong>Shipping Fee:</strong> {currency} {selectedOrder.shippingFee ?? 10}</p>
                <p><strong>Total Amount:</strong> {currency} {selectedOrder.amount}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
