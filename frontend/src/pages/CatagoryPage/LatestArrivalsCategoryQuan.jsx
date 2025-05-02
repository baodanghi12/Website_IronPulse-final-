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
    'quan': { mainCategory: 'Quần', category: 'men' },
    'quan-short': { subCategory: ['Quần Short'], category: 'men' },
    'quan-dai': { subCategory: ['Quần Dài'], category: 'men' },
    'quan-jean': { subCategory: ['Quần Jean'], category: 'men' },
    'quan-au': { subCategory: ['Quần Âu'], category: 'men' },
  };

  const femaleFilters = {
    'quan': { mainCategory: 'Quần', category: 'women' },
    'quan-jean': { subCategory: ['Quần Jean'], category: 'women' },
    'quan-tay': { subCategory: ['Quần Tây'], category: 'women' },
    'quan-short': { subCategory: ['Quần Short'], category: 'women' },
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
            { label: 'QUẦN', img: assets.pants, link: '/latest-arrivals/category/QUẦN NAM' },
            { label: 'QUẦN SHORT NAM', img: assets.quanshort, link: '/latest-arrivals/category=/QUẦN SHORT NAM' },
            { label: 'QUẦN DÀI NAM', img: assets.quandai, link: '/latest-arrivals/category/QUẦN DÀI NAM' },
            { label: 'QUẦN JEAN NAM', img: assets.quanjean, link: '/latest-arrivals/category/QUẦN JEAN NAM' },
            { label: 'QUẦN ÂU NAM', img: assets.quanau, link: '/latest-arrivals/category/QUẦN ÂU NAM' },
            { label: 'QUẦN NỮ', img: assets.quannu, link: '/latest-arrivals/category/QUẦN NỮ' },
            { label: 'QUẦN JEAN NỮ', img: assets.quanjeannu, link: '/latest-arrivals/category/QUẦN JEAN NỮ' },
            { label: 'QUẦN TÂY NỮ', img: assets.quantaynu, link: '/latest-arrivals/category/QUẦN TÂY NỮ' },
            { label: 'QUẦN SHORT NỮ', img: assets.quanshortnu, link: '/latest-arrivals/category/QUẦN SHORT NỮ' },
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