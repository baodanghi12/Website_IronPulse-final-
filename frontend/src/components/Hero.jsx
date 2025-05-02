import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom'; // <-- import này
import { assets } from '../assets/assets';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Hero = () => {
  const navigate = useNavigate(); // <-- hook điều hướng

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleShopNow = () => {
    navigate('/collection');
  };

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">Latest Arrivals</h1>
          <div className="flex items-center gap-2 mt-4">
            <button 
              onClick={handleShopNow} 
              className="font-semibold text-sm md:text-base bg-[#414141] text-white px-4 py-2 rounded hover:bg-[#313131] transition"
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>

      {/* Hero Right Side with Carousel */}
      <div className="w-full sm:w-1/2">
        <Slider {...settings}>
          <div>
            <img className="w-full" src={assets.hero_img_1} alt="Hero Image 1" />
          </div>
          <div>
            <img className="w-full" src={assets.hero_img_2} alt="Hero Image 2" />
          </div>
          <div>
            <img className="w-full" src={assets.hero_img_3} alt="Hero Image 3" />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
