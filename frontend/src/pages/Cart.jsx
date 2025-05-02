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
            tempData.push({
              _id: itemId,
              size,
              color,
              quantity,
            });
          }
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products]);

  const getCartSubtotal = () => {
    let total = 0;
    for (const item of cartData) {
      const product = products.find(p => p._id === item._id);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    return total;
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

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img className="w-16 sm:w-20" src={productData?.image?.[0]} alt="" />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{productData?.name || 'Unknown'}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <p>
                      {currency}
                      {productData?.price}
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
                onChange={(e) =>
                  e.target.value === '' || e.target.value === '0'
                    ? null
                    : updateQuantity(item._id, item.size, Number(e.target.value), item.color, item.size, item.color)
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
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
              onClick={() => navigate('/place-order')}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
