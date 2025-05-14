import React from 'react';
import { Button } from 'antd';
import { VND } from '../utils/handleCurrency';
import { assets } from '../assets/assets';

const OrderPopupDetail = ({ order, onClose, onStatusChange, onPaymentChange, onUpdateStatus, onPrint }) => {
  if (!order || !order._id) return null;

  const subTotal = order.amount + (order.discountAmount || 0) - (order.shippingFee || 0);

  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-transparent' onClick={onClose}>
      <div
        className='w-full max-w-3xl p-6 rounded-xl shadow-xl border border-gray-300 overflow-y-auto max-h-[80vh] bg-white bg-opacity-90 transition-all transform scale-95 opacity-100 animate-pop'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='absolute top-3 right-3 text-gray-500 hover:text-black text-xl'
          onClick={onClose}
        >
          ✖
        </button>

        <h3 className='text-xl font-semibold mb-4 text-center text-gray-800'>Order Details</h3>

        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center space-x-4'>
            <img
              src={order.avatar || 'default-avatar.png'}
              alt='Avatar'
              className='w-16 h-16 rounded-full object-cover'
            />
            <div>
              <p><strong>Order ID:</strong> <span style={{ border: '1px solid #339AF0', borderRadius: '4px', padding: '1px 3px', color: '#339AF0', display: 'inline-block', fontWeight: 'bold' }}>#{order._id.slice(-6).toUpperCase()}</span></p>
              <p><strong>Name:</strong> {order.address?.firstName || ''} {order.address?.lastName || ''}</p>
              <p><strong>Phone:</strong> {order.address?.phone}</p>
              <p><strong>Address:</strong> {order.address?.street}, {order.address?.city}, {order.address?.state}, {order.address?.country}, {order.address?.zipcode}</p>
              <p><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>

          <div className='text-sm text-right space-y-2'>
            <div>
              <label className='font-medium mr-2'>Order Status:</label>
              <select
                className='p-1 border rounded-md bg-white'
                value={order.status}
                onChange={(e) => onStatusChange(e.target.value)}
                disabled={order.status === 'Delivered' && order.payment}
              >
                <option value='Order Placed'>Order Placed</option>
                <option value='Packing'>Packing</option>
                <option value='Shipped'>Shipped</option>
                <option value='Out for delivery'>Out for delivery</option>
                <option value='Delivered'>Delivered</option>
              </select>
            </div>

            <div>
              <label className='font-medium mr-2'>Payment:</label>
              <select
                className='p-1 border rounded-md bg-white'
                value={order.payment ? 'Done' : 'Pending'}
                onChange={(e) => onPaymentChange(e.target.value)}
                disabled={order.status === 'Delivered' && order.payment || order.paymentMethod === 'Online'}
              >
                <option value='Done'>Done</option>
                <option value='Pending'>Pending</option>
              </select>
            </div>

            <button
              className={`mt-2 px-4 py-1 text-white rounded transition ${order.status === 'Delivered' && order.payment ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              disabled={order.status === 'Delivered' && order.payment || order.paymentMethod === 'Online'}
              onClick={onUpdateStatus}
            >
              Update Status
            </button>
          </div>
        </div>

        <div className='mb-4'>
          <label><strong>Note:</strong></label>
          <div className='mt-2 w-full min-h-[100px] p-3 border border-gray-300 rounded bg-gray-50 whitespace-pre-wrap text-base'>
            {order.note || 'none'}
          </div>
        </div>

        <p className='flex items-center gap-2'>
          <strong>Payment Method:</strong>
          {order.paymentMethod === 'COD' ? (
            <span className='bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1'>
              <img src={assets.cod_icon} alt='cod' className='w-4 h-4' />
              Cash on Delivery
            </span>
          ) : (
            <span className='bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium'>Paid Online</span>
          )}
        </p>

        <hr className='my-3' />

        <table className='w-full table-auto border border-gray-300'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='text-left px-2 py-1'>#</th>
              <th className='text-left px-2 py-1'>Item Name</th>
              <th className='text-left px-2 py-1'>Category</th>
              <th className='text-left px-2 py-1'>Quantity</th>
              <th className='text-left px-2 py-1'>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className='border-t'>
                <td className='px-2 py-1'>{idx + 1}</td>
                <td className='px-2 py-1'>{item.name}</td>
                <td className='px-2 py-1'>{item.category || 'N/A'}</td>
                <td className='px-2 py-1'>{item.quantity}</td>
                <td className='px-2 py-1'>{VND.format(item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className='my-3' />

        <div className='flex flex-col text-right space-y-1'>
          <p><strong>Tạm tính:</strong> {VND.format(subTotal)}</p>
          <p><strong>Phí vận chuyển:</strong> {VND.format(order.shippingFee || 0)}</p>
          <p><strong>Giảm giá:</strong> {order.promotionCode && <span className="text-gray-500">(Mã: {order.promotionCode})</span>} -{VND.format(order.discountAmount || 0)}</p>
          <p><strong>Tổng cộng:</strong> <strong>{VND.format(order.amount)}</strong></p>
        </div>

        <div className='text-left mt-3'>
          <Button type='primary' onClick={() => onPrint(order)}>
            🖨 In Order Detail
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPopupDetail;