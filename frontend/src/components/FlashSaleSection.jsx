import React, { useEffect, useState, useRef, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const FlashSaleSection = () => {
  const { flashSaleItems, flashSaleEndTime } = useContext(ShopContext);
  const [timeLeft, setTimeLeft] = useState(0);
  const topRef = useRef(null);

  useEffect(() => {
    if (!flashSaleEndTime) return;
    const end = new Date(flashSaleEndTime).getTime();
    const now = Date.now();
    setTimeLeft(Math.floor((end - now) / 1000));
  }, [flashSaleEndTime]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;
    return { days, hours, minutes, secs };
  };

  const { days, hours, minutes, secs } = formatTime(timeLeft);

  if (flashSaleItems.length === 0) return null;

  return (
    <div ref={topRef} className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="TODAY'S" text2="FLASH SALES" />
        <div className="flex justify-center space-x-4 text-lg text-red-600 font-semibold">
          <span>{days} Days</span>
          <span>{hours} Hours</span>
          <span>{minutes} Minutes</span>
          <span>{secs} Seconds</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {flashSaleItems.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
            priceBeforeSale={item.priceBeforeSale}
            discountPercent={item.discountPercent}
            isFlashSale={true}
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
};

export default FlashSaleSection;