import React from 'react';
import { Link } from 'react-router-dom';
import video_1 from '../assets/video_1.mp4';
import video_2 from '../assets/video_2.mp4';
import video_3 from '../assets/video_3.mp4';
import video_4 from '../assets/video_4.mp4';
import { assets } from '../assets/assets';
const topItems = [
  {
    type: 'image',
    src: assets.img1,
    title: 'Minimalist',
    subtitle: 'Thời trang tối giản hiện đại',
    link: '/collection/minimalist',
  },
  {
    type: 'video',
    src: video_2, 
    title: 'Urban Style',
    subtitle: 'Phong cách thành thị trẻ trung',
    link: '/collection/urbanstyle',
  },
  {
    type: 'image',
    src: assets.img2,
    title: 'Casual Look',
    subtitle: 'Thoải mái và thời trang',
    link: '/collection/casuallook',
  },
];

const collections = [
  {
    type: 'image',
    src: assets.img3,
    title: 'Streetwear',
    desc: 'Thời trang đường phố cá tính',
    link: '/collection/streetwear',
  },
  {
    type: 'image',
    src: assets.img4,
    title: 'Bộ sưu tập mùa đông',
    desc: 'Ấm áp và thời trang',
    link: '/collection/winter',
  },
  {
    type: 'video',
    src: video_3,
    title: 'Sơ mi x Iron Pulse',
    desc: 'Đậm phong cách cá tính',
    link: '/collection/ironpulse',
  },
  {
    type: 'image',
    src: assets.img5,
    title: 'Hela Clothes',
    desc: 'Thời trang nữ tính nhẹ nhàng',
    link: '/collection/hela',
  },
  {
    type: 'video',
    src: video_4,
    title: 'Áo Thun Boxy',
    desc: 'Thoải mái, năng động',
    link: '/collection/boxy',
  },
  {
    type: 'image',
    src: assets.img6,
    title: 'Flannel',
    desc: 'Phong cách cổ điển ấm áp',
    link: '/collection/flannel',
  },
];


const BestSellerSection = () => {
  return (
    <div className="bg-white">
      {/* VIDEO nền */}
      <section className="relative bg-black text-white h-[400px] md:h-[500px] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <video
            src={video_1}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-gray-300 text-sm md:text-base">
                IRONPULSE <span className="text-white font-medium">Collection by</span>
              </p>
              <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-white"></p>
            </div>
            <h1 className="text-4xl md:text-5xl font-light mb-6">
              Embracing simplicity with our essential collection
            </h1>
            <Link to="/collection">
              <button className="bg-white text-black px-6 py-2 text-sm uppercase tracking-wider hover:bg-gray-200 transition duration-300">
                EXPLORE NOW
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Hình/Video nổi bật */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-12 py-8">
      {topItems.map((item, index) => {
  const linkPath = `/collection/${item.title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <Link to={linkPath} key={index} className="relative overflow-hidden block">
      {item.type === 'video' ? (
        <video
          src={item.src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[350px] object-cover"
        />
      ) : (
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-[350px] object-cover"
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.subtitle}</p>
        <button className="mt-2 bg-black text-white px-4 py-2 text-xs uppercase hover:bg-gray-800">
          Mua Ngay
        </button>
      </div>
    </Link>
  );
})}
      </div>

      {/* Bộ sưu tập (WHAT’S HOT) */}
      <div className="px-4 md:px-12 py-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">WHAT’S HOT</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collections.map((item, idx) => (
  <div key={idx} className="bg-white shadow border">
    <Link to={item.link}>
      {item.type === 'video' ? (
        <video
          src={item.src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[350px] object-cover"
        />
      ) : (
        <img
          src={item.src}
          alt={item.title}
          className="w-full h-[350px] object-cover"
        />
      )}
    </Link>
    <div className="p-4">
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <p className="text-sm text-gray-600">{item.desc}</p>
      <Link to={item.link}>
        <button className="mt-3 bg-black text-white px-4 py-2 text-xs uppercase hover:bg-gray-800">
          Mua Ngay
        </button>
      </Link>
      
    </div>
  </div>
))}
        </div>
      </div>
    </div>
  );
};

export default BestSellerSection;
