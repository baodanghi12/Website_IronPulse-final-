import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    // const { products } = useContext(ShopContext);
    // const [latestProducts, setLatestProducts] = useState([]);
    // const [timeLeft, setTimeLeft] = useState(0);
    // const [showAll, setShowAll] = useState(false); // Thêm state
    // const navigate = useNavigate();
    // const topRef = useRef(null); // ref để scroll lên

    // useEffect(() => {
    //     setLatestProducts(products.slice(0, 10));
    //     setTimeLeft(3 * 24 * 60 * 60);

    //     const timer = setInterval(() => {
    //         setTimeLeft(prev => {
    //             if (prev <= 0) {
    //                 clearInterval(timer);
    //                 return 0;
    //             }
    //             return prev - 1;
    //         });
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, [products]);

    // const formatTime = (seconds) => {
    //     const days = Math.floor(seconds / (24 * 60 * 60));
    //     const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    //     const minutes = Math.floor((seconds % (60 * 60)) / 60);
    //     const secs = seconds % 60;
    //     return { days, hours, minutes, secs };
    // };

    // const { days, hours, minutes, secs } = formatTime(timeLeft);

    // const categories = [
    //     {
    //         title: 'BIG SALE 🔥',
    //         image: assets.saleimg,
    //         desc: 'Ưu đãi cực sốc cho bạn! 🔥',
    //         path: '/category/sale'
    //     },
    //     {
    //         title: 'MEN',
    //         image: assets.menimg,
    //         desc: 'Phong cách mạnh mẽ, lịch lãm',
    //         path: '/category/men'
    //     },
    //     {
    //         title: 'WOMEN',
    //         image: assets.womenimg,
    //         desc: 'Thời trang nữ tính, hiện đại',
    //         path: '/category/women'
    //     },
    //     {
    //         title: 'LATEST ARRIVALS',
    //         image: assets.latestimg,
    //         desc: 'Sản phẩm mới nhất hiện đã có mặt',
    //         path: '/category/new'
    //     },
    //     {
    //         title: 'WINTER',
    //         image: assets.winterimg,
    //         desc: 'Đồ ấm áp cho mùa lạnh',
    //         path: '/category/winter'
    //     }
    // ];

    // const handleToggleShowAll = () => {
    //     setShowAll(!showAll);
    //     if (showAll && topRef.current) {
    //         topRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    // };

    // const displayedProducts = showAll ? products : products.slice(0, 10);

    // return (
    //     <div ref={topRef} className='my-10'>
    //         <div className='text-center py-8 text-3xl'>
    //             <Title text1={"TODAY'S"} text2={'FLASH SALES'} />
    //             <div className='flex justify-center space-x-4 text-lg'>
    //                 <span>{days} Days</span>
    //                 <span>{hours} Hours</span>
    //                 <span>{minutes} Minutes</span>
    //                 <span>{secs} Seconds</span>
    //             </div>
    //         </div>

    //         <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
    //             {displayedProducts.map((item, index) => (
    //                 <div key={index} className='relative border border-gray-300 rounded-lg overflow-hidden shadow-lg'>
    //                     <ProductItem
    //                         id={item._id}
    //                         image={item.image}
    //                         name={item.name}
    //                         price={item.price}
    //                     />
    //                     <div className='absolute top-0 left-0 bg-red-600 text-white p-1 text-xs font-bold'>
    //                         -{item.discount || 30}%
    //                     </div>
    //                     <div className='absolute top-0 left-0 bg-red-600 text-white p-1 text-xs font-bold'>
    //     -{item.discount || 30}%
    // </div>
    // {/* Di chuyển label xuống góc dưới phải của hình ảnh */}
    // <div className='absolute bottom-2 right-2 bg-black text-white p-1 text-xs font-bold'>
    //     {item.category || 'Đồ Nam'}
    // </div>
    //                     <p className='text-center mt-2 text-gray-700'>{item.name}</p>
    //                     <p className='text-center text-gray-500 line-through'>{item.originalPrice} VNĐ</p>
    //                     <p className='text-center text-lg font-bold text-red-600'>{item.price} VNĐ</p>
    //                 </div>
    //             ))}
    //         </div>

    //         <div className='text-center mt-4'>
    //             <button
    //                 className='bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800'
    //                 onClick={handleToggleShowAll}
    //             >
    //                 {showAll ? 'Show Less' : 'View All Products'}
    //             </button>
    //         </div>

    //         {/* Hạng Mục Section */}
    //         <div className='mt-12 w-full'>
    //             <h2 className='text-2xl font-bold mb-8 text-center'>Hạng Mục</h2>
    //             <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 w-full'>
    //                 {categories.map((cat, idx) => (
    //                     <div
    //                         key={idx}
    //                         onClick={() => {
    //                             navigate(cat.path);
    //                             window.scrollTo({ top: 0, behavior: 'smooth' });
    //                         }}
    //                         className='cursor-pointer bg-gray-100 p-4 rounded-xl text-center hover:shadow-xl transition-all duration-300 w-full'
    //                     >
    //                         <img
    //                             src={cat.image}
    //                             alt={cat.title}
    //                             className='w-full h-40 object-cover rounded-md mb-3'
    //                         />
    //                         <h3 className='text-lg font-semibold'>{cat.title}</h3>
    //                         <p className='text-sm text-gray-600'>{cat.desc}</p>
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default LatestCollection;
