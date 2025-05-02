import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { assets } from '../assets/assets';
import RelatedProdcuts from '../components/RelatedProdcuts';
import { toast } from 'react-toastify';

const Product = () => {
  const { productId } = useParams();
  const {
    products,
    currency,
    getProdcutsData,
    addToCart,
    addToWishlist,
    isInWishlist,
    flashSaleItems,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [selectedSizeQuantity, setSelectedSizeQuantity] = useState(null);

  useEffect(() => {
    if (!products || products.length === 0) {
      getProdcutsData();
    }
  }, []);

  useEffect(() => {
    const matchedProduct = products.find((item) => item._id === productId);
    if (matchedProduct) {
      setProductData(matchedProduct);
      setImage(matchedProduct.image?.[0] || '');
    }
  }, [productId, products]);

  const handleSelectSize = (item) => {
    setSize(item.size);
    setSelectedSizeQuantity(item.quantity);
  };

  const handleAddToCartClick = () => {
    if (!size) {
      toast.error('Please select a size before adding to cart.');
      return;
    }
    addToCart(productData._id, size, productData.colors?.[0] || '');
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '0';
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!productData) return <div className="opacity-0"></div>;

  const flashData = flashSaleItems.find(
    (item) => item._id === productData._id || item.productId === productData._id
  );
  const finalPrice = flashData?.price ?? productData.price;
  const originalPrice = flashData?.priceBeforeSale ?? productData.priceBeforeSale;
  const discount = flashData?.discountPercent ?? productData.discountPercent;

  const isOnSale = typeof originalPrice === 'number' && typeof finalPrice === 'number' && originalPrice > finalPrice;

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:w-[18.7%] w-full">
            {Array.isArray(productData.image) &&
              productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  alt=""
                />
              ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <img key={i} src={assets.star_icon} alt="" className="w-3 5" />
            ))}
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>

          {isOnSale ? (
            <div className="mt-5">
              <p className="text-sm text-gray-500 line-through">
                {formatCurrency(originalPrice)} {currency}
              </p>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(finalPrice)} {currency}
              </p>
              {discount > 0 && (
                <p className="text-sm font-semibold text-green-600">
                  🔥 Giảm {discount}%
                </p>
              )}
            </div>
          ) : (
            <p className="mt-5 text-3xl font-medium">
              {formatCurrency(finalPrice)} {currency}
            </p>
          )}

          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item.size === size ? 'border-orange-500' : ''
                  }`}
                  disabled={item.quantity === 0}
                >
                  {item.size}
                </button>
              ))}
            </div>
            {size && (
              <p className="text-sm text-gray-500">
                Quantity remaining: {selectedSizeQuantity}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCartClick}
              className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button>

            <button
              onClick={() => {
                if (isInWishlist(productData._id)) {
                  toast.info('Sản phẩm đã có trong wishlist');
                  return;
                }
                addToWishlist(productData._id);
              }}
              className="bg-gray-200 text-black px-4 py-3 text-sm flex items-center justify-center gap-2 active:bg-gray-400"
            >
              {isInWishlist(productData._id) ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-black" />
              )}
              ADD TO WISHLIST
            </button>
          </div>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Review (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Welcome to our website – a modern online shopping space where you
            can easily explore thousands of diverse, high-quality products at
            competitive prices.
          </p>
          <p>
            We offer a wide variety of fashion products for men, women, and
            children with modern designs and top-quality materials, perfect for
            every age and style.
          </p>
        </div>
      </div>

      <RelatedProdcuts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;