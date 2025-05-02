import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { assets } from '../../assets/assets';
import Title from '../../components/Title';
import ProductItem from '../../components/ProductItem';

const LatestArrivalsCategoryAo = () => {
  const { products, flashSaleItems } = useContext(ShopContext);
  const { type } = useParams();
  const [filtered, setFiltered] = useState([]);

  const maleFilters = {
    'ao': { mainCategory: 'Áo', category: 'men' },
    'ao-thun-polo': { subCategory: ['Áo Thun & Polo'], category: 'men' },
    'ao-khoac': { subCategory: ['Áo Khoác'], category: 'men' },
    'ao-so-mi': { subCategory: ['Áo Sơ Mi'], category: 'men' },
  };

  const femaleFilters = {
    'ao': { mainCategory: 'Áo', category: 'women' },
    'ao-thun-polo': { subCategory: ['Áo Thun'], category: 'women' },
    'ao-khoac': { subCategory: ['Áo Khoác'], category: 'women' },
    'ao-so-mi': { subCategory: ['Áo Sơ Mi'], category: 'women' },
    'ao-croptop': { subCategory: ['Áo Croptop'], category: 'women' },
  };

  useEffect(() => {
    const maleCondition = maleFilters[type?.toLowerCase()];
    const femaleCondition = femaleFilters[type?.toLowerCase()];

    let filteredProducts = products.filter((item) => {
      const lowerCat = item.category?.toLowerCase();

      if (lowerCat === 'men' && maleCondition) {
        if (maleCondition.mainCategory && item.mainCategory !== maleCondition.mainCategory) return false;
        if (maleCondition.subCategory && !maleCondition.subCategory.includes(item.subCategory)) return false;
        return true;
      }

      if (lowerCat === 'women' && femaleCondition) {
        if (femaleCondition.mainCategory && item.mainCategory !== femaleCondition.mainCategory) return false;
        if (femaleCondition.subCategory && !femaleCondition.subCategory.includes(item.subCategory)) return false;
        return true;
      }

      return false;
    });

    setFiltered(filteredProducts);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type, products]);

  const flashMap = new Map();
  flashSaleItems.forEach(item => {
    flashMap.set(item._id || item.productId, item);
  });

  return (
    <div className='pt-10 border-t'>
      {/* Banner */}
      <div className='w-full mb-4'>
        <img src={assets.latestimg} className='w-full h-60 object-cover rounded-xl' alt="Latest Arrivals banner" />
      </div>

      {/* Horizontal Category Slider */}
      <div className="w-full overflow-x-auto scrollbar-hide py-4 mb-6">
        <div className="flex gap-4 min-w-max px-2 sm:px-4">
          {[
            { label: 'ÁO NAM', img: assets.shirt, link: '/latest-arrivals/ao/ÁO NAM' },
            { label: 'ÁO THUN & POLO NAM', img: assets.aothun1, link: '/latest-arrivals/ao/ÁO THUN & POLO NAM' },
            { label: 'ÁO KHOÁC NAM', img: assets.aokhoac, link: '/latest-arrivals/ao/ÁO KHOÁC NAM' },
            { label: 'ÁO SƠ MI NAM', img: assets.aosomi, link: '/latest-arrivals/ao/ÁO SƠ MI NAM' },
            { label: 'ÁO NỮ', img: assets.shirt1, link: '/latest-arrivals/ao/ÁO NỮ' },
            { label: 'ÁO THUN NỮ', img: assets.aothunnu, link: '/latest-arrivals/ao/ÁO THUN NỮ' },
            { label: 'ÁO KHOÁC NỮ', img: assets.aokhoacnu, link: '/latest-arrivals/ao/ÁO KHOÁC NỮ' },
            { label: 'ÁO SƠ MI NỮ', img: assets.aosominu, link: '/latest-arrivals/ao/ÁO SƠ MI NỮ' },
            { label: 'ÁO CROPTOP NỮ', img: assets.aocroptop, link: '/latest-arrivals/ao/ÁO CROPTOP NỮ' },
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
        <Title text1="LATEST" text2={type.replace('-', ' ').toUpperCase()} />
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
        {filtered.map((item, index) => {
          const flash = flashMap.get(item._id);
          return (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              image={item.image}
              price={flash?.price || item.price}
              priceBeforeSale={flash?.priceBeforeSale}
              discountPercent={flash?.discountPercent || 0}
              isFlashSale={!!flash}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LatestArrivalsCategoryAo;