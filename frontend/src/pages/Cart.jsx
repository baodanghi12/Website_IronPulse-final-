import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import axios from 'axios';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const itemId in cartItems) {
        for (const key in cartItems[itemId]) {
          const [size, color] = key.split('-');
          const quantity = cartItems[itemId][key];

          if (quantity > 0) {
            const product = products.find((p) => p._id === itemId);
            const isOnSale = product?.flashSale?.isActive && product?.flashSale?.price < product?.price;
            const originalPrice = product?.priceBeforeSale || product?.price;
            const finalPrice = product?.flashSale?.isActive ? product.flashSale.price : originalPrice;

            tempData.push({
              _id: itemId,
              size,
              color,
              quantity,
              finalPrice,
              isOnSale: product?.flashSale?.isActive,
              originalPrice,
              discountPercent: product?.flashSale?.isActive
                ? Math.round(((originalPrice - product.flashSale.price) / originalPrice) * 100)
                : 0,
            });
          }
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products]);

  const getCartSubtotal = () => {
    return cartData.reduce((total, item) => total + item.finalPrice * item.quantity, 0);
  };

  const handleSizeChange = (itemId, newSize, quantity, color, oldSize, oldColor) => {
    updateQuantity(itemId, newSize, quantity, color, oldSize, oldColor);
  };

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          const availableSizes = productData?.sizes?.filter((s) => s.quantity > 0) || [];
          const selectedSize = productData?.sizes?.find((s) => s.size === item.size);
          const maxQuantity = selectedSize?.quantity || 1;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img className="w-16 sm:w-20" src={productData?.image?.[0] || ''} alt={productData?.name || ''} />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{productData?.name || 'Unknown'}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <p className="flex items-center gap-2">
                      {item.isOnSale ? (
                        <>
                          <span className="text-red-500 font-semibold">{currency}{item.finalPrice}</span>
                          <span className="line-through text-gray-400 text-sm">{currency}{item.originalPrice}</span>
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded font-medium">
                            -{item.discountPercent}%
                          </span>
                        </>
                      ) : (
                        <span>{currency}{item.finalPrice}</span>
                      )}
                    </p>

                    <select
                      value={item.size}
                      onChange={(e) =>
                        handleSizeChange(item._id, e.target.value, item.quantity, item.color, item.size, item.color)
                      }
                      className="border px-2 py-1 text-sm bg-white"
                    >
                      {availableSizes.map((s, i) => (
                        <option key={i} value={s.size}>
                          {s.size} ({s.quantity} left)
                        </option>
                      ))}
                    </select>

                    <div
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: item.color || 'gray' }}
                      title={item.color}
                    ></div>
                  </div>
                </div>
              </div>

              <input
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!value || value <= 0) return;
                  const validValue = Math.min(value, maxQuantity);
                  updateQuantity(item._id, item.size, validValue, item.color, item.size, item.color);
                }}
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                max={maxQuantity}
                value={Math.min(item.quantity, maxQuantity)}
              />

              <img
                onClick={() => updateQuantity(item._id, item.size, 0, item.color, item.size, item.color)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="Delete"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal subtotal={getCartSubtotal()} />
          <div className="w-full text-end">
            <button
              onClick={() => {
                if (cartData.length > 0) navigate('/place-order');
              }}
              disabled={cartData.length === 0}
              className={`text-sm my-8 px-8 py-3 ${cartData.length === 0
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
              {cartData.length === 0 ? 'CART IS EMPTY' : 'PROCEED TO CHECKOUT'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
