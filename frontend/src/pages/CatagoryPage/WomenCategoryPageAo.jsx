import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { assets } from '../../assets/assets';
import Title from '../../components/Title';
import ProductItem from '../../components/ProductItem';

const WomenCategoryPageAo = () => {
  const { products, flashSaleItems } = useContext(ShopContext);
  const { type } = useParams();
  const [filtered, setFiltered] = useState([]);

  const filterMap = {
    'ao': { mainCategory: 'Áo' },
    'ao-thun': { subCategory: 'Áo Thun' },
    'ao-somi': { subCategory: 'Áo Sơ Mi' },
    'ao-khoac': { subCategory: 'Áo Khoác' },
    'ao-croptop': { subCategory: 'Áo Croptop' },
    'size-cuoi': { lastSize: true }
  };

  useEffect(() => {
    let filteredProducts = products.filter(
      (item) => item.category?.toLowerCase() === 'women'
    );

    const condition = filterMap[type?.toLowerCase()];

    if (condition?.mainCategory) {
      filteredProducts = filteredProducts.filter(
        (item) => item.mainCategory === condition.mainCategory
      );
    }

    if (condition?.subCategory) {
      filteredProducts = filteredProducts.filter(
        (item) => item.subCategory === condition.subCategory
      );
    }

    if (condition?.lastSize) {
      filteredProducts = filteredProducts.filter((item) => item.isLastSize);
    }

    setFiltered(filteredProducts);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type, products]);

  // Map flash sale data for quick lookup
  const flashMap = new Map();
  flashSaleItems.forEach(item => {
    flashMap.set(item._id || item.productId, item);
  });

  return (
    <div className='pt-10 border-t'>
      {/* Banner */}
      <div className='w-full mb-4'>
        <img src={assets.womenimg} className='w-full h-60 object-cover rounded-xl' alt="Women banner" />
      </div>

      {/* Horizontal Category Slider */}
      <div className="w-full overflow-x-auto scrollbar-hide py-4 mb-6">
        <div className="flex gap-4 min-w-max px-2 sm:px-4">
          {[
            { label: 'ÁO', img: assets.shirt1, link: '/women/category/ÁO' },
            { label: 'ÁO THUN', img: assets.aothunnu, link: '/women/category/ÁO THUN' },
            { label: 'ÁO SƠ MI', img: assets.aosominu, link: '/women/category/ÁO SƠ MI' },
            { label: 'ÁO KHOÁC', img: assets.aokhoacnu, link: '/women/category/ÁO KHOÁC' },
            { label: 'ÁO CROPTOP', img: assets.aocroptop, link: '/women/category/ÁO CROPTOP' },
          ].map((item, index) => (
            <Link to={item.link || '#'} key={index}>
              <div className="group min-w-[140px] sm:min-w-[160px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 cursor-pointer">
                <div className="w-full h-28 sm:h-32 overflow-hidden">
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="text-center py-2 px-2 font-medium text-sm text-gray-800 group-hover:text-black">
                  {item.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Title and Product Grid */}
      <div className='flex justify-between items-center mb-4'>
        <Title text1="WOMEN" text2={type.replace('-', ' ').toUpperCase()} />
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
        {filtered.map((item, index) => {
          const flash = flashMap.get(item._id);
          return (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={flash?.price || item.price}
              image={item.image}
              priceBeforeSale={flash?.priceBeforeSale || item.priceBeforeSale}
              discountPercent={flash?.discountPercent || item.discountPercent}
              isFlashSale={!!flash || item.isFlashSale}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WomenCategoryPageAo;