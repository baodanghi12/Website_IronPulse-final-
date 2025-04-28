import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Button } from 'antd';

const { RangePicker } = DatePicker;

const Bills = ({ token }) => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [filterDateRange, setFilterDateRange] = useState(null);

  const fetchAllBills = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const paidBills = response.data.orders.filter(order => order.payment === true);
        setBills(paidBills);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllBills();
  }, [token]);

  const filteredBills = bills.filter((bill) => {
    if (!filterDateRange) return true;
    return (
      (dayjs(bill.date).isAfter(filterDateRange[0], 'day') || dayjs(bill.date).isSame(filterDateRange[0], 'day')) &&
      (dayjs(bill.date).isBefore(filterDateRange[1], 'day') || dayjs(bill.date).isSame(filterDateRange[1], 'day'))
    );
  });

  const handlePrintBill = (bill) => {
    const logoUrl = 'https://yourdomain.com/logo.png'; 
    const storeName = 'IRON PULSE - Fashion Store';
  
    const subTotal = bill.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = bill.shipping || 0;
    const discount = bill.discount || 0;
    const total = subTotal + shippingFee - discount;
  
    const content = `
      <html>
        <head>
          <title>Bill #${bill._id.slice(-6).toUpperCase()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2, h3 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            .summary { margin-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          <img src="${logoUrl}" alt="Logo" style="width: 80px; display: block; margin: auto;" />
          <h1>${storeName}</h1>
          <h2>Bill Details</h2>
  
          <p><strong>Bill ID:</strong> #${bill._id.slice(-6).toUpperCase()}</p>
          <p><strong>Name:</strong> ${bill.address?.fristName} ${bill.address?.lastName}</p>
          <p><strong>Phone:</strong> (+84) ${bill.address?.phone}</p>
          <p><strong>Address:</strong> ${bill.address?.street}, ${bill.address?.city}, ${bill.address?.state}</p>
          <p><strong>Date:</strong> ${new Date(bill.date).toLocaleString()}</p>
  
          <h3>Items:</h3>
          <table>
            <thead>
              <tr><th>Product</th><th>Quantity</th><th>Price</th></tr>
            </thead>
            <tbody>
              ${bill.items.map(item => `
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

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Bills Page</h3>

      {/* Filter by Date */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Date:</label>
        <RangePicker onChange={(dates) => setFilterDateRange(dates)} allowClear />
      </div>

      {/* Bills List */}
      {filteredBills.length === 0 ? (
        <p className="text-gray-500 italic">No bills found.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr
                key={bill._id}
                className="border-t cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedBill(bill)}
              >
                <td className="px-4 py-2">
                  <span className="border border-blue-500 text-blue-500 font-bold px-2 py-1 rounded">
                    #{bill._id.slice(-6).toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-2">{bill.address?.fristName} {bill.address?.lastName}</td>
                <td className="px-4 py-2">{bill.address?.street}, {bill.address?.city}, {bill.address?.state}</td>
                <td className="px-4 py-2">{new Date(bill.date).toLocaleString()}</td>
                <td className="px-4 py-2">{bill.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td className="px-4 py-2">{currency} {bill.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Popup Bill Detail */}
      {selectedBill && (
  <div
    className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-transparent"
    onClick={() => setSelectedBill(null)}
  >
    <div
      className="w-full max-w-3xl p-6 rounded-xl shadow-xl border border-gray-300 overflow-y-auto max-h-[80vh] bg-white bg-opacity-90 transition-all transform scale-95 opacity-100 animate-pop"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        onClick={() => setSelectedBill(null)}
      >
        ✖
      </button>

      <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Bill Details
      </h3>

      {/* Info Section */}
      <div className="flex items-center space-x-6 mb-6">
        {/* Avatar Placeholder */}
        <img
          src={selectedBill.avatar || '/default-avatar.png'}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        {/* Basic Info */}
        <div>
          <p>
            <strong>Bill ID:</strong>{' '}
            <span style={{
              border: '1px solid #339AF0',
              borderRadius: '4px',
              padding: '1px 3px',
              color: '#339AF0',
              display: 'inline-block',
              fontWeight: 'bold'
            }}>
              #{selectedBill._id.slice(-6).toUpperCase()}
            </span>
          </p>
          <p><strong>Name:</strong> {selectedBill.address?.fristName} {selectedBill.address?.lastName}</p>
          <p><strong>Phone:</strong> {selectedBill.address?.phone}</p>
          <p><strong>Address:</strong> {selectedBill.address?.street}, {selectedBill.address?.city}, {selectedBill.address?.state}</p>
          <p><strong>Date:</strong> {new Date(selectedBill.date).toLocaleString()}</p>
        </div>
      </div>

      <hr className="my-3" />

      {/* Items Table */}
      <table className="w-full table-auto border border-gray-300 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-2 py-1">#</th>
            <th className="text-left px-2 py-1">Item Name</th>
            <th className="text-left px-2 py-1">Quantity</th>
            <th className="text-left px-2 py-1">Price</th>
          </tr>
        </thead>
        <tbody>
          {selectedBill.items.map((item, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-2 py-1">{idx + 1}</td>
              <td className="px-2 py-1">{item.name}</td>
              <td className="px-2 py-1">{item.quantity}</td>
              <td className="px-2 py-1">{currency} {item.price.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex flex-col text-right space-y-1">
        <p><strong>Total Amount:</strong> {currency} {selectedBill.amount.toLocaleString()}</p>
      </div>

      <div className="text-left mt-4">
        <Button type="primary" onClick={() => handlePrintBill(selectedBill)}>
          🖨 In Bill Detail
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Bills;
