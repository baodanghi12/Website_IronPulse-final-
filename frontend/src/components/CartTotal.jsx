import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = ({ discount = 0 }) => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const total = subtotal + delivery_fee - discount;

  // ✅ Hàm định dạng tiền Việt
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{formatCurrency(subtotal)}</p>
        </div>

        

        <hr />
        <div className="flex justify-between">
          <p>Phí vận chuyển</p>
          <p>{formatCurrency(delivery_fee)}</p>
        </div>
        {discount > 0 && (
          <>
            <hr />
            <div className="flex justify-between text-green-600">
              <p>Giảm giá</p>
              <p>-{formatCurrency(discount)}</p>
            </div>
          </>
        )}
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>{subtotal === 0 ? formatCurrency(0) : formatCurrency(total)}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
