import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Button } from 'antd';
import { VND } from '../utils/handleCurrency';
import { useLocation } from 'react-router-dom';
const useQuery = () => new URLSearchParams(useLocation().search);
const { RangePicker } = DatePicker;

const Bills = ({ token }) => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [filterDateRange, setFilterDateRange] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
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

  const query = useQuery();

useEffect(() => {
  fetchAllBills();
}, [token]);

useEffect(() => {
  const idFromQuery = query.get('id');
  if (idFromQuery && bills.length > 0) {
    const match = bills.find(bill => bill._id === idFromQuery);
    if (match) setSelectedBill(match);
  }
}, [bills]);

  const filteredBills = bills.filter((bill) => {
    if (!filterDateRange) return true;
    return (
      (dayjs(bill.date).isAfter(filterDateRange[0], 'day') || dayjs(bill.date).isSame(filterDateRange[0], 'day')) &&
      (dayjs(bill.date).isBefore(filterDateRange[1], 'day') || dayjs(bill.date).isSame(filterDateRange[1], 'day'))
    );
  });
  const paginatedBills = filteredBills.slice((currentPage - 1) * pageSize, currentPage * pageSize);


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
         <p><strong>Name:</strong> ${bill.shippingAddress?.firstName} ${bill.shippingAddress?.lastName}</p>
<p><strong>Phone:</strong> (+84) ${bill.shippingAddress?.phone}</p>
<p><strong>Address:</strong> ${bill.shippingAddress?.street}, ${bill.shippingAddress?.city}, ${bill.shippingAddress?.state}</p>

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
  useEffect(() => {
  setCurrentPage(1);
}, [filterDateRange]);
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
            {paginatedBills.map((bill) => (
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
                <td className='px-4 py-2'>{bill.address?.firstName || bill.address?.name || 'No name'}</td>

                <td className='px-4 py-2'>{`${bill.address?.street}, ${bill.address?.city}, ${bill.address?.state}`}</td>





<td className="px-4 py-2">
  {bill.createdAt ? new Date(bill.createdAt).toLocaleString() : 'N/A'}
</td>


                <td className="px-4 py-2">{bill.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td className="px-4 py-2">{VND.format(bill.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
          
      )}
    <div className="mt-4 flex justify-center">
  <div className="flex gap-2 items-center">
    <button
      className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-40"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Prev
    </button>
    <span className="text-sm text-gray-700">
      Page {currentPage} of {Math.ceil(filteredBills.length / pageSize)}
    </span>
    <button
      className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-40"
      onClick={() =>
        setCurrentPage((prev) =>
          prev < Math.ceil(filteredBills.length / pageSize) ? prev + 1 : prev
        )
      }
      disabled={currentPage >= Math.ceil(filteredBills.length / pageSize)}
    >
      Next
    </button>
  </div>
</div>
      {/* Popup Bill Detail */}


{/* Popup Bill Detail */}
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
        <img
          src={selectedBill.avatar || '/default-avatar.png'}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
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
              #{selectedBill._id?.slice(-6).toUpperCase()}
            </span>
          </p>
          <p><strong>Name:</strong> {selectedBill.address?.firstName || ''} {selectedBill.address?.lastName || ''}</p>
          <p><strong>Address:</strong> {selectedBill.address?.street || ''}, {selectedBill.address?.city || ''}, {selectedBill.address?.state || ''}, {selectedBill.address?.country || ''}</p>
          <p><strong>Phone:</strong> {selectedBill.address?.phone || 'N/A'}</p>
          <p><strong>Date:</strong> 
            {(selectedBill.date || selectedBill.createdAt)
              ? new Date(selectedBill.date || selectedBill.createdAt).toLocaleString()
              : 'Invalid Date'}
          </p>
          {selectedBill.note && (
            <div className="mt-2">
              <strong>Note:</strong>
              <div className="bg-gray-100 p-2 mt-1 rounded">{selectedBill.note}</div>
            </div>
          )}
          {selectedBill.paymentMethod && (
            <p className="mt-2">
              <strong>Payment Method:</strong>{' '}
              <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${selectedBill.paymentMethod === 'COD' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {selectedBill.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paid Online'}
              </span>
            </p>
          )}
        </div>
      </div>

      <hr className="my-3" />

      {/* Items Table */}
      <table className="w-full table-auto border border-gray-300 mb-4 text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="text-left px-2 py-1">#</th>
            <th className="text-left px-2 py-1">Item Name</th>
            <th className="text-left px-2 py-1">Category</th>
            <th className="text-left px-2 py-1">Quantity</th>
            <th className="text-left px-2 py-1">Price</th>
          </tr>
        </thead>
        <tbody>
          {selectedBill.items?.map((item, idx) => (
            <tr key={idx} className="border-t text-gray-700">
              <td className="px-2 py-1">{idx + 1}</td>
              <td className="px-2 py-1">{item.name}</td>
              <td className="px-2 py-1">{item.category || 'N/A'}</td>
              <td className="px-2 py-1">{item.quantity}</td>
              <td className="px-2 py-1">{VND.format(item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex flex-col items-end space-y-1 text-sm text-gray-800">
        <p><strong>Tạm tính:</strong> {VND.format((selectedBill.amount + (selectedBill.discountAmount || 0) - (selectedBill.shippingFee || 0)))}</p>
        <p><strong>Phí vận chuyển:</strong> {VND.format(selectedBill.shippingFee || 0)}</p>
        <p>
          {selectedBill.promotionCode && (
            <span className="text-gray-500">(Mã: {selectedBill.promotionCode}) </span>
          )}
          <strong>Giảm giá:</strong> -{VND.format(selectedBill.discountAmount || 0)}
        </p>
        <p className="text-gray-500"><strong>Tổng cộng:</strong> {VND.format(selectedBill.amount)}</p>
      </div>
    </div>
  </div>
)}





    </div>
  );
};

export default Bills;
