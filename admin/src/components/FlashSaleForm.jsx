import React, { useState } from 'react';
import axios from 'axios';

const FlashSaleForm = ({
  products,
  onClose,
  onSuccess,
  token,
  startTimeDefault,
  endTimeDefault
}) => {
  const [selected, setSelected] = useState([]);
  const [startTime, setStartTime] = useState(startTimeDefault || '');
  const [endTime, setEndTime] = useState(endTimeDefault || '');
  const [salePrices, setSalePrices] = useState({});
  const [discountPercents, setDiscountPercents] = useState({});
  const [searchText, setSearchText] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const pageSize = 6;
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const filteredProducts = products.filter((item) => {
  const totalQty = item.sizes?.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
  const matchStock = totalQty > 0; // ✅ chỉ hiển thị sản phẩm còn hàng
  const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;

   return matchSearch && matchStock && matchCategory;
});

const paginatedProducts = filteredProducts.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);

  const submitFlashSale = async () => {
    const items = selected
      .map((id) => {
        const price = Number(salePrices[id]);
        const percent = Number(discountPercents[id]);
        if (!price || price <= 0 || !percent || percent <= 0) return null;
        return {
          productId: id,
          salePrice: price,
          discountPercent: percent
        };
      })
      .filter(Boolean);

    if (items.length === 0) {
      alert("❌ Vui lòng chọn ít nhất 1 sản phẩm và nhập giá giảm hợp lệ.");
      return;
    }

    if (!startTime || !endTime) {
      alert("❌ Vui lòng chọn thời gian bắt đầu và kết thúc.");
      return;
    }

    try {
      await axios.post(
        '/api/flashsale/create',
        {
          title: 'Flash Sale',
          products: items,
          startTime,
          endTime,
          isActive: true,
        },
        {
          headers: { token },
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      alert('❌ Tạo flash sale thất bại.');
      console.error(err);
    }
  };

  return (
    <div
  className="fixed inset-0 flex items-center justify-center z-50"
  onClick={onClose}
>
      <div
  className="bg-white w-full max-w-6xl rounded-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto"
  onClick={(e) => e.stopPropagation()} // chặn sự kiện click từ cha
>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          🎯 Add Products to Flash Sale
        </h2>
{/* Filter UI */}
<div className="mb-4 flex flex-col lg:flex-row items-center justify-between gap-4">
  <input
    type="text"
    placeholder="🔍 Tìm sản phẩm..."
    value={searchText}
    onChange={(e) => {
      setSearchText(e.target.value);
      setCurrentPage(1);
    }}
    className="border px-3 py-2 rounded w-full lg:w-1/3"
  />

  <select
    value={categoryFilter}
    onChange={(e) => {
      setCategoryFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="border px-3 py-2 rounded w-full lg:w-[200px]"
  >
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat === 'all' ? 'Tất cả danh mục' : cat}
      </option>
    ))}
  </select>
</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((item) => {
            const totalQty = item.sizes?.reduce((sum, s) => sum + (s.quantity || 0), 0);
            return (
              <div key={item._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50 relative">
                <label className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    disabled={totalQty === 0}
                    checked={selected.includes(item._id)}
                    onChange={() => toggleSelect(item._id)}
                    className="accent-red-600 w-5 h-5"
                  />
                  <span className="font-medium text-gray-800 truncate">{item.name}</span>
                </label>

                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-full h-36 object-cover rounded-md mb-3"
                />

                <div className="text-sm text-gray-500 mb-2">
                  <span className="font-semibold">Original:</span> {item.price} VND
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  <span className="font-semibold">Sizes:</span>
                  <ul className="ml-4 list-disc">
                    {item.sizes?.map((s, idx) => (
                      <li key={idx}>
                        {s.size || s[0]}: {s.quantity} sp
                      </li>
                    ))}
                  </ul>
                  {totalQty === 0 && (
                    <p className="text-xs text-red-600 font-semibold mt-2">⚠️ Out of Stock</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-700">
                    Sale Price:
                    <input
                      type="number"
                      placeholder="e.g. 199000"
                      value={salePrices[item._id] || ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setSalePrices({ ...salePrices, [item._id]: value });
                        const percent = Math.round(100 - (value / item.price) * 100);
                        setDiscountPercents({ ...discountPercents, [item._id]: percent });
                      }}
                      className="border px-2 py-1 mt-1 rounded w-full focus:ring focus:ring-red-200"
                    />
                  </label>

                  <label className="text-sm text-gray-700">
                    Discount %:
                    <input
                      type="number"
                      placeholder="e.g. 20"
                      value={discountPercents[item._id] || ''}
                      onChange={(e) => {
                        const percent = Number(e.target.value);
                        const price = Math.round(item.price * (1 - percent / 100));
                        setDiscountPercents({ ...discountPercents, [item._id]: percent });
                        setSalePrices({ ...salePrices, [item._id]: price });
                      }}
                      className="border px-2 py-1 mt-1 rounded w-full focus:ring focus:ring-red-200"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        {/* Pagination */}
<div className="mt-4 flex justify-center gap-4 text-sm">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
    disabled={currentPage === 1}
    className="px-3 py-1 border rounded disabled:opacity-40"
  >
    ⬅ Trước
  </button>
  <span>Trang {currentPage} / {Math.ceil(filteredProducts.length / pageSize)}</span>
  <button
    onClick={() => setCurrentPage((prev) =>
      prev < Math.ceil(filteredProducts.length / pageSize) ? prev + 1 : prev
    )}
    disabled={currentPage === Math.ceil(filteredProducts.length / pageSize)}
    className="px-3 py-1 border rounded disabled:opacity-40"
  >
    Sau ➡
  </button>
</div>


        {/* Time inputs */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-sm font-medium text-gray-700">
            Start Time:
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              readOnly={!!startTimeDefault}
              className="border px-3 py-2 mt-1 rounded w-full focus:ring focus:ring-blue-200"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            End Time:
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              readOnly={!!endTimeDefault}
              className="border px-3 py-2 mt-1 rounded w-full focus:ring focus:ring-blue-200"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={submitFlashSale}
            className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
          >
            Save Flash Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleForm;
