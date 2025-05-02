import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { assets } from '../../assets/assets';
import Title from '../../components/Title';
import ProductItem from '../../components/ProductItem';

const MenCategoryPageQuan = () => {
  const { products, flashSaleItems } = useContext(ShopContext);
  const { type } = useParams();
  const [filtered, setFiltered] = useState([]);

  const filterMap = {
    'quan': { mainCategory: 'Quần' },
    'quan-short': { subCategory: 'Quần Short' },
    'quan-dai': { subCategory: 'Quần Dài' },
    'quan-jean': { subCategory: 'Quần Jean' },
    'quan-au': { subCategory: 'Quần Âu' },
    'size-cuoi': { lastSize: true }
  };

  useEffect(() => {
    let filteredProducts = products.filter(
      (item) => item.category?.toLowerCase() === 'men'
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

  const flashMap = new Map();
  flashSaleItems.forEach(item => {
    flashMap.set(item._id || item.productId, item);
  });

  return (
    <div className='pt-10 border-t'>
      <div className='w-full mb-4'>
        <img src={assets.menimg} className='w-full h-60 object-cover rounded-xl' alt="Men banner" />
      </div>

      {/* Horizontal Category Slider */}
      <div className="w-full overflow-x-auto scrollbar-hide py-4 mb-6">
        <div className="flex gap-4 min-w-max px-2 sm:px-4">
          {[
            { label: 'QUẦN', img: assets.quannam, link: '/men/quan/QUẦN' },
            { label: 'QUẦN SHORT', img: assets.quanshort, link: '/men/quan/QUẦN SHORT' },
            { label: 'QUẦN DÀI', img: assets.quanau, link: '/men/quan/QUẦN DÀI' },
            { label: 'QUẦN JEAN', img: assets.quanjean, link: '/men/quan/QUẦN JEAN' },
            { label: 'QUẦN ÂU', img: assets.quandai, link: '/men/quan/QUẦN ÂU' },
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

      {/* Title and Products */}
      <div className='flex justify-between items-center mb-4'>
        <Title text1="MEN" text2={type.replace('-', ' ').toUpperCase()} />
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

export default MenCategoryPageQuan;
