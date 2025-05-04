import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { VND } from '../utils/handleCurrency';
import FlashSaleForm from '../components/FlashSaleForm';

const FlashSaleList = ({ allProducts, token, onSuccess }) => {
  const [saleProducts, setSaleProducts] = useState([]);
  const [showFlashSaleForm, setShowFlashSaleForm] = useState(false);
  const [editProductIds, setEditProductIds] = useState([]);
  const [saleTime, setSaleTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  const fetchFlashSale = useCallback(async () => {
    try {
      const res = await axios.get('/api/flashsale/active');
      console.log("📦 Flash Sale API response:", res.data);
  
      const { success, products, startTime, endTime } = res.data;
  
      if (
        success &&
        startTime &&
        endTime &&
        !isNaN(Date.parse(startTime)) &&
        !isNaN(Date.parse(endTime))
      ) {
        setSaleTime({
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        });
  
        if (Array.isArray(products)) {
          const productsInSale = products.map(item => {
            const totalQty = item.sizes?.reduce((sum, s) => sum + (s.quantity || 0), 0) || 0;
          
            return {
              ...item,
              originalPrice: item.priceBeforeSale, // ✅ lấy từ field backend đã enrich
              salePrice: item.price,               // ✅ chính là salePrice
              discountPercent: item.discountPercent,
              totalQty,
            };
          }).filter(Boolean);
  
          setSaleProducts(productsInSale);
        } else {
          setSaleProducts([]);
        }
      } else {
        setSaleProducts([]);
        setSaleTime(null);
      }
    } catch (err) {
      console.error("❌ Failed to load flash sale:", err);
    }
  }, []);
  
  
  

  useEffect(() => {
    fetchFlashSale();
  }, [fetchFlashSale]);

  // ⏰ Countdown
  useEffect(() => {
    console.log("🔎 saleTime for countdown:", saleTime);
    if (saleTime?.endTime instanceof Date && !isNaN(saleTime.endTime)) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = Math.max(0, saleTime.endTime - now);

        if (diff === 0) {
          setRemainingTime(null);
          clearInterval(interval);
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setRemainingTime({ hours, minutes, seconds });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setRemainingTime(null);
    }
  }, [saleTime]);

  const removeProductFromSale = async (productId) => {
    try {
      await axios.delete(`/api/flashsale/remove/${productId}`, {
        headers: { token },
      });
      fetchFlashSale();
    } catch (err) {
      alert('Failed to remove product from Flash Sale');
    }
  };

  const clearFlashSale = async () => {
    if (!window.confirm("Are you sure you want to remove all flash sale items?")) return;
    try {
      await axios.delete('/api/flashsale/clear', {
        headers: { token },
      });
      fetchFlashSale();
    } catch (err) {
      alert('Failed to clear flash sale');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Flash Sale Products</h2>
          {saleTime?.endTime && (
  <span className="text-sm text-red-600 font-semibold">
    ⏰{" "}
    {remainingTime
      ? `${remainingTime.hours}h ${remainingTime.minutes}m ${remainingTime.seconds}s`
      : "⏳ Flash Sale đang diễn ra"}
  </span>
)}

        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditProductIds([]);
              setShowFlashSaleForm(true);
            }}
            className="bg-red-600 text-white py-1.5 px-4 rounded hover:bg-red-700 text-sm"
          >
            Add to Flash Sale
          </button>
          {saleProducts.length > 0 && (
            <button
              onClick={clearFlashSale}
              className="bg-gray-300 text-gray-800 py-1.5 px-3 rounded hover:bg-gray-400 text-sm"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {saleProducts.length > 0 ? (
        <div className="flex overflow-x-auto gap-4 pb-2">
          {saleProducts.map((item, index) => (
            <div key={index} className="min-w-[220px] border p-3 rounded shadow-sm bg-gray-50 relative">
              <img src={item.image[0]} alt={item.name} className="w-full h-28 object-cover rounded mb-2" />
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-sm text-gray-400 line-through">
  {VND.format(item.originalPrice)}
</p>
<p className="text-red-600 font-bold">
  {VND.format(item.salePrice)}
</p>

              {item.discountPercent && (
                <p className="text-xs text-green-600 mt-1 font-semibold">
                  Giảm {item.discountPercent}%
                </p>
              )}
              <p className="text-xs mt-1 text-gray-500">Stock: {item.totalQty}</p>

              <div className="flex justify-between mt-3 text-sm">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    setEditProductIds([item._id]);
                    setShowFlashSaleForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => removeProductFromSale(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No products in flash sale currently.</p>
      )}

      {showFlashSaleForm && (
        <FlashSaleForm
          products={
            editProductIds.length > 0
              ? allProducts.filter(p => editProductIds.includes(p._id))
              : allProducts
          }
          token={token}
          startTimeDefault={
            saleTime?.startTime instanceof Date && !isNaN(saleTime.startTime)
              ? saleTime.startTime.toISOString().slice(0, 16)
              : ''
          }
          endTimeDefault={
            saleTime?.endTime instanceof Date && !isNaN(saleTime.endTime)
              ? saleTime.endTime.toISOString().slice(0, 16)
              : ''
          }
          onClose={() => {
            setShowFlashSaleForm(false);
            setEditProductIds([]);
          }}
          onSuccess={() => {
            fetchFlashSale();
            onSuccess();
          }}
        />
      )}
    </div>
  );
};

export default FlashSaleList;
