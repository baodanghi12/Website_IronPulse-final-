import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { DatePicker, Select, Button, Space } from 'antd';
import { VND } from '../utils/handleCurrency';
import dayjs from 'dayjs';
import { FaBoxOpen, FaClipboardList, FaTruck, FaMotorcycle } from 'react-icons/fa'; 
import OrderPopupDetail from '../components/OrderPopupDetail';
const { RangePicker } = DatePicker;
const statusIcons = {
  'Order Placed': <FaClipboardList className="text-lg" />,
  'Packing': <FaBoxOpen className="text-lg" />,
  'Shipped': <FaTruck className="text-lg" />,
  'Out for delivery': <FaMotorcycle className="text-lg" />,
};
const Orders = ({ token }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('customer');
  const [orderStatus, setOrderStatus] = useState(selectedOrder?.status || '');
  const [paymentStatus, setPaymentStatus] = useState(selectedOrder?.payment ? 'Done' : 'Pending');
  // filters
  const [filterDateRange, setFilterDateRange] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const orderCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
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
    const logoUrl = 'https://yourdomain.com/logo.png'; // thay bằng logo thật
    const storeName = 'IRON PULSE - Fashion Store';
  
    const subTotal = order.amount + (order.discountAmount || 0) - (order.shippingFee || 0);
    const shippingFee = order.shippingFee || 0;
    const discount = order.discountAmount || 0;
    const total = order.amount;
  
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
          <h2>Chi tiết đơn hàng</h2>
  
          <p><strong>Mã đơn:</strong> #${order._id.slice(-6).toUpperCase()}</p>
          <p><strong>Tên khách:</strong> ${order.address?.firstName || ''} ${order.address?.lastName || ''}</p>
          <p><strong>Số điện thoại:</strong> (+84) ${order.address?.phone}</p>
          <p><strong>Địa chỉ:</strong> ${order.address?.street}, ${order.address?.city}, ${order.address?.state}, ${order.address?.country}, ${order.address?.zipcode}</p>
          <p><strong>Ngày tạo:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
          <p><strong>Payment Method:</strong> ${
          order.paymentMethod === 'COD'
            ? `<img src="${assets.cod_icon}" alt="cod" style="width:16px;height:16px;vertical-align:middle;margin-right:5px;" /> Cash on Delivery`
            : `<span style="color:green;font-weight:bold;">Paid Online</span>`
        }</p>


          <p><strong>Ghi chú:</strong> ${order.note || 'Không có ghi chú.'}</p>
  
          <h3>Danh sách sản phẩm:</h3>
          <table>
  <thead>
    <tr>
      <th>#</th>
      <th>Item Name</th>
      <th>Category</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    ${order.items.map((item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.name}</td>
        <td>${item.category || 'N/A'}</td>
        <td>${item.quantity}</td>
        <td>${VND.format(item.price)}</td>
      </tr>
    `).join('')}
  </tbody>
</table>

  
          <div class="summary">
            <p><strong>Tạm tính:</strong> ${VND.format(subTotal)}</p>
            <p><strong>Phí vận chuyển:</strong> ${VND.format(shippingFee)}</p>
            <p><strong>Giảm giá:</strong> -${VND.format(discount)}</p>
            <p><strong>Tổng cộng:</strong> <strong>${VND.format(total)}</strong></p>
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
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Order Page</h3>
      
      {/* ✅ Bộ lọc trạng thái và ngày */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
  {/* Cards lọc theo trạng thái */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
  {['Order Placed', 'Packing', 'Shipped', 'Out for delivery'].map((status) => (
    <div
      key={status}
      onClick={() => setFilterStatus(status)}
      className={`min-h-[100px] p-4 rounded-xl cursor-pointer transition-all shadow-md border-2 hover:shadow-lg flex flex-col items-center justify-center text-center gap-1 ${
        filterStatus === status
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700">
        {statusIcons[status]} <span>{status}</span>
      </div>
      <div className="text-2xl font-bold text-blue-600">
        {orderCounts[status] || 0}
      </div>
    </div>
  ))}
</div>

  {/* Lọc theo ngày */}
  <div className="w-full md:w-auto">
    <label className="mr-2 font-medium">📅 Filter by Date:</label>
    <RangePicker
      onChange={(dates) => setFilterDateRange(dates)}
      allowClear
      className="shadow-sm rounded border-gray-300"
    />
  </div>
</div>


      {/* Danh sách đơn hàng */}
{filteredOrders.length === 0 ? (
  <p className='text-gray-500 italic'>No orders found.</p>
) : (
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border border-gray-200 shadow-sm rounded-md">
      <thead className="bg-gray-50 text-gray-700 text-sm">
        <tr>
          <th className="px-4 py-2 text-left">ID</th>
          <th className="px-4 py-2 text-left">Name</th>
          <th className="px-4 py-2 text-left">Address</th>
          <th className="px-4 py-2 text-left">Create At</th>
          <th className="px-4 py-2 text-left">Quantity</th>
          <th className="px-4 py-2 text-left">Total Price</th>
          <th className="px-4 py-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody className="text-sm text-gray-800">
        {paginatedOrders.map((order) => (
          <tr
            key={order._id}
            className="border-t hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedOrder(order)}
          >
            <td className="px-4 py-2 font-semibold text-blue-600">#{order._id.slice(-6).toUpperCase()}</td>
            <td className="px-4 py-2">{order.address?.firstName || order.address?.name || 'No name'}</td>
            <td className="px-4 py-2">
              {`${order.address?.street}, ${order.address?.city}, ${order.address?.state}`}
            </td>
            <td className="px-4 py-2">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</td>
            <td className="px-4 py-2">
              {order.items?.reduce((total, item) => total + item.quantity, 0)}
            </td>
            <td className="px-4 py-2">{VND.format(order.amount)}</td>
            <td className="px-4 py-2">
  <span
    className={`px-2 py-1 rounded text-white text-sm whitespace-nowrap ${
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
  </div>
)}

      {/* Phân trang */}
<div className="flex justify-between items-center mt-4">
  <div className="text-sm text-gray-600">
  Showing {(currentPage - 1) * pageSize + 1} -{' '}
  {Math.min(currentPage * pageSize, filteredOrders.length)} of{' '}
  {filteredOrders.length} orders
</div>
  <div className="flex gap-2 items-center">
    <Button
  disabled={currentPage === 1}
  onClick={() => setCurrentPage((prev) => prev - 1)}
>
  ⬅ Previous
</Button>
<span>
  Page {currentPage} / {Math.ceil(filteredOrders.length / pageSize)}
</span>
<Button
  disabled={currentPage === Math.ceil(filteredOrders.length / pageSize)}
  onClick={() => setCurrentPage((prev) => prev + 1)}
>
  Next ➡
</Button>
  </div>
</div>

      {/* Popup Order Detail */}
{selectedOrder && (
  <OrderPopupDetail
    order={selectedOrder}
    onClose={() => setSelectedOrder(null)}
    onStatusChange={(value) => setOrderStatus(value)}
    onPaymentChange={(value) => setPaymentStatus(value)}
    onUpdateStatus={async () => {
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
          fetchAllOrders();
          setSelectedOrder(null);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }}
    onPrint={handlePrintOrder}
  />
)}

      
    </div>
  );
  
};

export default Orders;
