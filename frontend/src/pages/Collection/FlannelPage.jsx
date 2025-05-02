// imports
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from "../../context/ShopContext";
import { assets } from "../../assets/assets";
import Title from "../../components/Title";
import ProductItem from "../../components/ProductItem";

import { ChevronDown, X } from 'lucide-react';

const FlannelPage = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [priceRange, setPriceRange] = useState([270000, 3000000]);
  const [accordion, setAccordion] = useState({ cat: true, sub: true, price: true });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    let productsCopy = products.filter(
      (item) => item.category && item.category.toLowerCase() === 'men & women'
    );

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.mainCategory || item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    productsCopy = productsCopy.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let sorted = [...filterProducts];
    switch (sortType) {
      case 'low-high':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      default:
        applyFilter();
        return;
    }
    setFilterProducts(sorted);
  };

  useEffect(() => {
    applyFilter();
  }, [search, showSearch, products, category, subCategory, priceRange]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const clearAll = () => {
    setCategory([]);
    setSubCategory([]);
    setPriceRange([270000, 3000000]);
  };

  return (
    <div className='flex flex-col sm:flex-row pt-10 border-t gap-6 sm:gap-10'>
      {/* FILTER SIDEBAR */}
      <div className='w-full sm:w-1/4 p-4 bg-white shadow rounded-md'>
        <div className='flex justify-between items-center mb-3'>
          <h2 className='text-lg font-semibold'>Lọc & Sắp xếp</h2>
          <button onClick={clearAll} className='text-sm text-blue-500 hover:underline'>Clear All</button>
        </div>

        {(category.length > 0 || subCategory.length > 0) && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {[...category, ...subCategory].map((item, index) => (
              <span key={index} className='text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center'>
                {item}
                <X size={12} className='ml-1 cursor-pointer' />
              </span>
            ))}
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <button onClick={() => setAccordion({ ...accordion, cat: !accordion.cat })}
              className='flex justify-between w-full font-medium mb-1 text-sm'>
              CATEGORIES
              <ChevronDown className={`transition-transform ${accordion.cat ? 'rotate-180' : ''}`} size={16} />
            </button>
            {accordion.cat && (
              <div className='pl-2 space-y-1'>
                {['Áo'].map((cat) => (
                  <label key={cat} className='flex items-center gap-2 text-sm text-gray-700'>
                    <input type="checkbox" value={cat} checked={category.includes(cat)} onChange={toggleCategory} />
                    {cat}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <button onClick={() => setAccordion({ ...accordion, sub: !accordion.sub })}
              className='flex justify-between w-full font-medium mb-1 text-sm'>
              TYPE
              <ChevronDown className={`transition-transform ${accordion.sub ? 'rotate-180' : ''}`} size={16} />
            </button>
            {accordion.sub && (
              <div className='pl-2 grid grid-cols-1 sm:grid-cols-2 gap-1'>
                {[
                  'Áo Sơ Mi', 'Cơ Bản',
                ].map((sub) => (
                  <label key={sub} className='flex items-center gap-2 text-sm text-gray-700'>
                    <input type="checkbox" value={sub} checked={subCategory.includes(sub)} onChange={toggleSubCategory} />
                    {sub}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <button onClick={() => setAccordion({ ...accordion, price: !accordion.price })}
              className='flex justify-between w-full font-medium mb-1 text-sm'>
              PRICE
              <ChevronDown className={`transition-transform ${accordion.price ? 'rotate-180' : ''}`} size={16} />
            </button>
            {accordion.price && (
              <div className='pl-2 pt-2'>
                <div className='text-xs mb-1'>
                  {priceRange[0].toLocaleString()}₫ - {priceRange[1].toLocaleString()}₫
                </div>
                <input
                  type="range"
                  min={270000}
                  max={3000000}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  className='w-full'
                />
                <input
                  type="range"
                  min={270000}
                  max={3000000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className='w-full'
                />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={applyFilter}
          className='w-full mt-6 bg-black text-white text-sm py-2 rounded hover:bg-gray-800'>
          ÁP DỤNG ({filterProducts.length})
        </button>
      </div>

      {/* PRODUCTS SECTION */}
      <div className='flex-1'>
        <div className='w-full mb-4'>
          <img
            className='w-full h-60 object-cover rounded-xl'
            src={assets.flannelimg}
            alt='FLANNEL Banner'
          />
        </div>

        {/* DANH MỤC TRƯỢT NGANG - ĐẸP */}
<div className="w-full overflow-x-auto scrollbar-hide py-4 mb-6">
  <div className="flex gap-4 min-w-max px-2 sm:px-4">
    {[
      { label: 'SALE', img: assets.sale },
      { label: 'ÁO SƠ MI', img: assets.shirt },
      
    ].map((item, index) => (
      <div
        key={index}
        className="group min-w-[140px] sm:min-w-[160px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 cursor-pointer"
      >
        <div className="w-full h-28 sm:h-32 overflow-hidden">
          <img
            src={item.img}
            alt={item.label}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="text-center py-2 px-2 font-medium text-sm text-gray-800 group-hover:text-black">
          {item.label}
        </div>
      </div>
    ))}
  </div>
</div>

        <div className='flex justify-between items-center mb-4'>
          <Title text1={'FLANNEL'} text2={'COLLECTION'} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className='border px-2 py-1 rounded-md text-sm'
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlannelPage;
