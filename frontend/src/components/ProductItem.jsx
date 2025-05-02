import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const ProductItem = ({
  id,
  image,
  name,
  price,
  priceBeforeSale,
  discountPercent,
  isFlashSale,
}) => {
  const { currency, addToWishlist, removeFromWishlist, isInWishlist, flashSaleItems } = useContext(ShopContext);

  // Tìm dữ liệu flash sale nếu chưa có props
  const flashData = flashSaleItems.find((item) => item.productId === id);

  const finalPrice = flashData?.salePrice ?? price;
  const originalPrice = flashData ? price : priceBeforeSale;
  const discount = flashData?.discountPercent ?? discountPercent;

  // ✅ Định dạng giá tiền
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '0';
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  const isOnSale =
    typeof originalPrice === 'number' &&
    typeof finalPrice === 'number' &&
    originalPrice > finalPrice;

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer block relative">
      <div className="relative overflow-hidden">
        <img
          src={image?.[0] || image}
          alt={name}
          className="hover:scale-110 transition ease-in-out w-full h-[260px] object-cover"
        />

        <div
          onClick={handleWishlist}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md cursor-pointer"
        >
          <img
            src={isInWishlist(id) ? assets.heart_filled : assets.heart_outline}
            alt="wishlist"
            className="w-5 h-5"
          />
        </div>

        {isOnSale && discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
            -{discount}%
          </div>
        )}
      </div>

      <p className="text-center mt-2 text-sm">{name}</p>

      {isOnSale ? (
        <>
          <p className="text-center text-gray-500 text-sm line-through">
            {formatCurrency(originalPrice)} {currency}
          </p>
          <p className="text-center text-lg font-bold text-red-600">
            {formatCurrency(finalPrice)} {currency}
          </p>
        </>
      ) : (
        <p className="text-center text-sm font-medium">
          {formatCurrency(finalPrice)} {currency}
        </p>
      )}
    </Link>
  );
};

export default ProductItem;