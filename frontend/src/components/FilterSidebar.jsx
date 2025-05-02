import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

const AccordionItem = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-3 text-sm font-medium"
      >
        <span>{title}</span>
        <ChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} size={16} />
      </button>
      {open && <div className="pl-2 pb-3">{children}</div>}
    </div>
  );
};

const FilterSidebar = () => {
  const [price, setPrice] = useState([270000, 3000000]);
  const [activeFilters, setActiveFilters] = useState(['Nam', 'T-shirts', 'Quần áo']);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold">Lọc & Sắp xếp</h2>
        <button className="text-sm text-blue-500">Clear All</button>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {activeFilters.map((filter, idx) => (
          <span
            key={idx}
            className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full"
          >
            {filter}
            <X size={12} className="ml-1 cursor-pointer" />
          </span>
        ))}
      </div>

      {/* Accordion Filters */}
      <AccordionItem title="SORT BY">
        <div className="space-y-2 text-sm">
          <label className="block">
            <input type="radio" name="sort" className="mr-2" />
            Giá (Thấp - Cao)
          </label>
          <label className="block">
            <input type="radio" name="sort" className="mr-2" />
            Mới nhất trước
          </label>
          <label className="block">
            <input type="radio" name="sort" className="mr-2" />
            Bán chạy nhất
          </label>
          <label className="block">
            <input type="radio" name="sort" className="mr-2" />
            Giá (Cao - Thấp)
          </label>
        </div>
      </AccordionItem>

      <AccordionItem title="LOẠI SẢN PHẨM">
        <div className="space-y-2 text-sm">
          <label className="block"><input type="checkbox" className="mr-2" /> T-shirts</label>
          <label className="block"><input type="checkbox" className="mr-2" /> Áo khoác</label>
          <label className="block"><input type="checkbox" className="mr-2" /> Quần jean</label>
        </div>
      </AccordionItem>

      <AccordionItem title="PRICE">
        <div className="text-sm">
          <p className="mb-2 text-gray-700">
            {price[0].toLocaleString()}₫ - {price[1].toLocaleString()}₫
          </p>
          <input
            type="range"
            min={270000}
            max={3000000}
            value={price[0]}
            onChange={(e) => setPrice([Number(e.target.value), price[1]])}
            className="w-full"
          />
          <input
            type="range"
            min={270000}
            max={3000000}
            value={price[1]}
            onChange={(e) => setPrice([price[0], Number(e.target.value)])}
            className="w-full mt-2"
          />
        </div>
      </AccordionItem>

      {/* Áp dụng */}
      <button className="w-full bg-black text-white py-2 mt-6 rounded hover:bg-gray-800">
        ÁP DỤNG (981)
      </button>
    </div>
  );
};

export default FilterSidebar;
