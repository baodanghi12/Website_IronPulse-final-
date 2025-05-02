import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { DatePicker, Select, Button, Space } from 'antd';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('customer');
  const [orderStatus, setOrderStatus] = useState(selectedOrder?.status || '');
  const [paymentStatus, setPaymentStatus] = useState(selectedOrder?.payment ? 'Done' : 'Pending');
  // filters
  const [filterDateRange, setFilterDateRange] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const sortedOrders = response.data.orders.sort((a, b) => {
          const orderStatusPriority = {
            'Order Placed': 1,
            'Packing': 2,
            'Shipped': 3,
            'Out for delivery': 4,
            'Delivered': 5,
          };
  
          return orderStatusPriority[a.status] - orderStatusPriority[b.status];
        });
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
  const handlePrintOrder = (order) => {
    const currency = '₫'; // hoặc VND.format() nếu bạn muốn dùng định dạng
    const logoUrl = 'https://yourdomain.com/logo.png'; // đổi thành URL logo thật
    const storeName = 'IRON PULSE - Fashion Store'; // tên cửa hàng
  
    const subTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = order.shipping || 0;
    const discount = order.discount || 0;
    const total = subTotal + shippingFee - discount;
  
    const content = `
      <html>
        <head>
          <title>Order #${order._id.slice(-6).toUpperCase()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1, h2, h3 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            .summary { margin-top: 20px; }
            .summary p { margin: 4px 0; text-align: right; }
            .logo { width: 80px; height: auto; display: block; margin: 0 auto; }
          </style>
        </head>
        <body>
          <img src="${logoUrl}" alt="Logo" class="logo" />
          <h1>${storeName}</h1>
          <h2>Order Details</h2>
  
          <p><strong>Order ID:</strong> #${order._id.slice(-6).toUpperCase()}</p>
          <p><strong>Name:</strong> ${order.address?.fristName} ${order.address?.lastName}</p>
          <p><strong>Phone:</strong> (+84) ${order.address?.phone}</p>
          <p><strong>Address:</strong> ${order.address?.street}, ${order.address?.city}, ${order.address?.state}, ${order.address?.country}, ${order.address?.zipcode}</p>
          <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Payment:</strong> ${order.payment ? 'Done' : 'Pending'}</p>
          <p><strong>Note:</strong> ${order.note || 'Không có ghi chú.'}</p>
  
          <h3>Items:</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${currency} ${item.price.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
  
          <div class="summary">
            <p><strong>Subtotal:</strong> ${currency} ${subTotal.toLocaleString()}</p>
            <p><strong>Discount:</strong> ${currency} ${discount.toLocaleString()}</p>
            <p><strong>Shipping Fee:</strong> ${currency} ${shippingFee.toLocaleString()}</p>
            <p><strong>Total:</strong> <strong>${currency} ${total.toLocaleString()}</strong></p>
          </div>
        </body>
      </html>
    `;
  
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
  
  
  // ✅ Hàm lọc đơn hàng
  const filteredOrders = orders.filter((order) => {
    const inStatus = filterStatus === 'All' || order.status === filterStatus;
  
    const inDateRange =
      !filterDateRange ||
      (dayjs(order.date).isAfter(filterDateRange[0], 'day') || dayjs(order.date).isSame(filterDateRange[0], 'day')) &&
      (dayjs(order.date).isBefore(filterDateRange[1], 'day') || dayjs(order.date).isSame(filterDateRange[1], 'day'));
  
    return inStatus && inDateRange;
  });
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Order Page</h3>
      
      {/* ✅ Bộ lọc trạng thái và ngày */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="mr-2 font-medium">Filter by Status:</label>
          <Select
            defaultValue="All"
            style={{ width: 180 }}
            onChange={(value) => setFilterStatus(value)}
            options={[
              { value: 'All', label: 'All' },
              { value: 'Order Placed', label: 'Order Placed' },
              { value: 'Packing', label: 'Packing' },
              { value: 'Shipped', label: 'Shipped' },
              { value: 'Out for delivery', label: 'Out for delivery' },
              { value: 'Delivered', label: 'Delivered' },
            ]}
          />
        </div>
        <div>
          <label className="mr-2 font-medium">Filter by Date:</label>
          <RangePicker
            onChange={(dates) => setFilterDateRange(dates)}
            allowClear
          />
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 ? (
        <p className='text-gray-500 italic'>No orders found.</p>
      ) : (
        <table className='min-w-full table-auto'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-2 text-left'>ID</th>
              <th className='px-4 py-2 text-left'>Name</th>
              <th className='px-4 py-2 text-left'>Address</th>
              <th className='px-4 py-2 text-left'>Create At</th>
              <th className='px-4 py-2 text-left'>Quantity</th>
              <th className='px-4 py-2 text-left'>Total Price</th>
              <th className='px-4 py-2 text-left'>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className='border-t cursor-pointer hover:bg-gray-50'
                onClick={() => setSelectedOrder(order)}
              >
                <td className='px-4 py-2'>
                  <span
                    style={{
                      border: '1px solid #339AF0',
                      borderRadius: '4px',
                      padding: '1px 3px',
                      color: '#339AF0',
                      display: 'inline-block',
                      fontWeight: 'bold',
                    }}
                  >
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                </td>
                <td className='px-4 py-2'>{`${order.address?.firstName || order.address?.name || 'No name'}`}</td>
                <td className='px-4 py-2'>
                  {`${order.address?.street}, ${order.address?.city}, ${order.address?.state}`}
                </td>
                <td className='px-4 py-2'>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</td>
                <td className='px-4 py-2'>{order.items?.reduce((total, item) => total + item.quantity, 0)}</td>
                <td className='px-4 py-2'>{currency} {order.amount}</td>
                <td className='px-4 py-2'>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.status === 'Delivered'
                        ? 'bg-green-500'
                        : order.status === 'Shipped'
                        ? 'bg-blue-500'
                        : order.status === 'Packing'
                        ? 'bg-yellow-500'
                        : order.status === 'Out for delivery'
                        ? 'bg-orange-500' 
                        : 'bg-gray-500'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                <p>
                  <strong>Order ID:</strong>{' '}
                  <span style={{
                    border: '1px solid #339AF0',
                    borderRadius: '4px',
                    padding: '1px 3px',
                    color: '#339AF0',
                    display: 'inline-block',
                    fontWeight: 'bold'
                  }}>
                     #{selectedOrder._id.slice(-6).toUpperCase()}
                  </span>
                </p>
                <p><strong>Name:</strong> {selectedOrder.address?.firstName || ''} {selectedOrder.address?.lastName || ''}</p>
                  <p><strong>Phone:</strong> {selectedOrder.address?.phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.address?.street}, {selectedOrder.address?.city}, {selectedOrder.address?.state}, {selectedOrder.address?.country}, {selectedOrder.address?.zipcode}</p>
                  <p><strong>Date:</strong> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}</p>
                  




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
            {/* Noting by UserUser */}
<div style={{ marginTop: '1rem' }}>
  <label><strong>Note:</strong></label>
  <div
    style={{
      marginTop: '0.5rem',
      width: '100%',
      minHeight: '100px',
      padding: '0.75rem',
      border: '1px solid #ccc',
      borderRadius: '6px',
      backgroundColor: '#f5f5f5',
      whiteSpace: 'pre-wrap',
      fontSize: '1rem',
    }}
  >
    {selectedOrder.note || 'none'}
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
  {selectedOrder.note && (
  <div>
    <label className='font-medium mr-2'>Customer Note:</label>
    <span className='italic text-gray-700'>
      {selectedOrder.note}
    </span>
  </div>
)}
</p>


              <hr className='my-3' />

              {/* Items Table */}
<table className='w-full table-auto border border-gray-300'>
  <thead className='bg-gray-100'>
    <tr>
      <th className='text-left px-2 py-1'>#</th> {/* Cột STT */}
      <th className='text-left px-2 py-1'>Item Name</th>
      <th className='text-left px-2 py-1'>Category</th>
      <th className='text-left px-2 py-1'>Quantity</th>
      <th className='text-left px-2 py-1'>Price</th>
    </tr>
  </thead>
  <tbody>
  {selectedOrder.items.map((item, idx) => (
    <tr key={idx} className='border-t'>
      <td className='px-2 py-1'>{idx + 1}</td>
      <td className='px-2 py-1'>{item.name}</td>
      <td className='px-2 py-1'>{item.category || 'N/A'}</td>
      <td className='px-2 py-1'>{item.quantity}</td>
      <td className='px-2 py-1'>{currency} {item.price}</td>
    </tr>
  ))}
</tbody>

</table>
              
              <hr className='my-3' />

              {/* Summary */}
              <div className='flex flex-col text-right space-y-1'>
              
              <p><strong>Subtotal:</strong> {currency} {selectedOrder.subtotal ?? 0}</p>
<p><strong>Discount:</strong> {currency} {selectedOrder.discount ?? 0}</p>
<p><strong>Shipping Fee:</strong> {currency} {selectedOrder.shippingFee ?? 0}</p>
<p><strong>Total Amount:</strong> {currency} {selectedOrder.amount ?? 0}</p>
                


              </div>
              <div className='text-left'>
  <Button type='primary' onClick={() => handlePrintOrder(selectedOrder)}>
    🖨 In Order Detail
  </Button>
</div>
            </div>
            
          </div>
        </div>
      )}
      
    </div>
  );
  
};

export default Orders;
