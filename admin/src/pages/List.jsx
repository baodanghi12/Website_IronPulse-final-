import React, { useEffect, useState } from "react";
import { backendUrl} from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import EditForm from "../components/EditForm";
import { VND } from "../utils/handleCurrency";
import { useLocation } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail'; 
import FlashSaleList from '../components/FlashSaleList';
const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [inventoryStats, setInventoryStats] = useState({
    totalCategories: 0,
    totalProducts: 0,
    totalRevenue: 0,
    topSelling: 0,
    topSellingRevenue: 0,
    lowStocks: 0,
    outOfStocks: 0,
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sortBy = queryParams.get('sort'); // lấy giá trị 'lowStock' nếu có
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        const products = response.data.products;
        
        setList(products);
  
        // ✅ Tính toán Inventory Overview
        const categories = [...new Set(products.map(p => p.category))];
        const totalProducts = products.length;
        const totalRevenue = products.reduce((sum, p) => sum + (p.price || 0), 0);
        const topSelling = products.filter(p => p.totalSold > 5).length; // từ 5 lượt bán trở lên thì gọi là bán chạy
const topSellingRevenue = products
  .filter(p => p.totalSold > 5)
  .reduce((sum, p) => sum + (p.price || 0), 0);
        const lowStocks = products.filter(p =>
          p.sizes?.some(size => size.quantity > 0 && size.quantity <= 5)
        ).length;
        const outOfStocks = products.filter(p =>
          p.sizes?.every(size => size.quantity === 0)
        ).length;
  
        setInventoryStats({
          totalCategories: categories.length,
          totalProducts,
          totalRevenue,
          topSelling,
          topSellingRevenue,
          lowStocks,
          outOfStocks,
        });
      } else {
        toast.error(response.data.message || "Error fetching products");
      }
    } catch (error) {
      toast.error("Error fetching data. Please try again later.");
      console.error("Error:", error);
    }
  };
  
  const sortByTopSelling = () => {
    const sorted = [...list].sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0));
    setList(sorted);
  };
  
  const sortByLowStock = () => {
    const sorted = [...list].sort((a, b) => {
      const totalA = a.sizes?.reduce((sum, s) => sum + (s.quantity || 0), 0) || 0;
      const totalB = b.sizes?.reduce((sum, s) => sum + (s.quantity || 0), 0) || 0;
      return totalA - totalB;
    });
    setList(sorted);
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditProduct(null);
  };

  const handleUpdateSuccess = () => {
    fetchList();
    setEditMode(false);
    setEditProduct(null);
  };

  useEffect(() => {
    fetchList();
  }, []);

  let filteredList = list.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchSubCategory = selectedSubCategory ? item.subCategory === selectedSubCategory : true;
    return matchSearch && matchCategory && matchSubCategory;
  });
  const totalPages = Math.ceil(filteredList.length / pageSize);
  const paginatedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  
  
  // Nếu sortBy=lowStock thì sắp xếp số lượng tăng dần
  if (sortBy === 'lowStock') {
  filteredList = filteredList.sort((a, b) => {
    const getQty = (product) => {
      if (Array.isArray(product.sizes)) {
        return product.sizes.reduce((sum, size) => sum + size.quantity, 0);
      }
      return product.countInStock ?? 0;
    };
    return getQty(a) - getQty(b);
  });
} else if (sortBy === 'topSelling') {
  filteredList = filteredList.sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0));
}

  return (
    <>
   {/* Bộ lọc */}
<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
  
  {/* Filter Category */}
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
  >
    <option value="">All Categories</option>
    <option value="Men">Men</option>
    <option value="Women">Women</option>
    <option value="Kids">Kids</option>
  </select>

  {/* Filter Subcategory */}
  <select
    value={selectedSubCategory}
    onChange={(e) => setSelectedSubCategory(e.target.value)}
    className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
  >
    <option value="">All Subcategories</option>
    <option value="Topwear">Topwear</option>
    <option value="Bottomwear">Bottomwear</option>
    <option value="Winterwear">Winterwear</option>
  </select>

  {/* Search Box */}
  <div className="relative w-full max-w-md">
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    />
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
      🔍
    </span>
  </div>
    
</div>

      {/* Overall Inventory */}
<div className="bg-white rounded-lg shadow-sm p-6 mb-8">
  <h2 className="text-lg font-semibold text-gray-800 mb-6">Overall Inventory</h2>
  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
    
    {/* Categories */}
    <div className="flex flex-col items-center text-center">
      <p className="text-2xl font-bold text-blue-600">{inventoryStats.totalCategories}</p>
      <p className="mt-1 text-gray-700 font-medium">Categories</p>
    </div>

    {/* Total Products */}
    <div className="flex flex-col items-center text-center">
      <p className="text-2xl font-bold text-orange-500">{inventoryStats.totalProducts}</p>
      <p className="mt-1 text-gray-700 font-medium">Total Products</p>
    </div>

    {/* Top Selling */}
<div
  className="flex flex-col items-center text-center cursor-pointer"
  onClick={sortByTopSelling}
  title="Click to sort by top selling"
>
  <p className="text-2xl font-bold text-purple-500">{inventoryStats.topSelling}</p>
  <p className="mt-1 text-gray-700 font-medium">Top Selling</p>
</div>

{/* Low Stocks */}
<div
  className="flex flex-col items-center text-center cursor-pointer"
  onClick={sortByLowStock}
  title="Click to sort by low stock"
>
  <p className="text-2xl font-bold text-red-500">{inventoryStats.lowStocks}</p>
  <p className="mt-1 text-gray-700 font-medium">Low Stocks</p>
</div>

  </div>
</div>
<FlashSaleList allProducts={list} token={token} onSuccess={fetchList} />

      

      {/* Header */}
      <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-3 p-3 bg-gray-100 border text-sm font-semibold text-gray-700 rounded-md">
        <span>Image</span>
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Colors</span>
        <span>Quantity</span>
        <span>Cost</span>
        <span className="text-center">Actions</span>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-3 mt-2">
        {paginatedList.map((item, index) => (
          <React.Fragment key={index}>
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition"
            >
              <div className="relative w-20 h-20">
  <img
  src={item.image[0]}
  alt={item.name}
  className="w-full h-full object-cover rounded-md cursor-pointer"
  onClick={() => {
    setSelectedProductId(item._id);
    setShowDetailModal(true);
  }}
/>
  
  {item.newArrival && (
    <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] px-1 py-[1px] font-semibold rotate-[-45deg] origin-top-left">
      NEW
    </div>
  )}
</div>
              <p className="truncate" title={item.name}>
                {item.name}
              </p>
              <p className="text-gray-700">{item.category}</p>
              <p className="text-blue-600 font-semibold">
                {VND.format(item.price)}
              </p>

              {/* Colors */}
              <div className="flex flex-wrap gap-1">
                {item.colors?.length > 0 ? (
                  item.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                  ))
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>

              {/* Sizes & Quantity */}
              <div className="flex flex-col gap-1 text-sm">
                {item.sizes?.length > 0 ? (
                  item.sizes.map((s, idx) => (
                    <div key={idx} className="flex gap-1">
                      <span className="font-semibold">{s.size}:</span>
                      <span>{s.quantity}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>

              {/* Cost */}
              <p className="text-gray-800 font-medium">
                {item.cost !== undefined ? VND.format(item.cost) : "N/A"}
              </p>

              {/* Actions */}
              <div className="flex justify-end md:justify-center gap-2 text-sm">
                <button
                  className="text-blue-600 hover:underline transition"
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline transition"
                  onClick={() => removeProduct(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Edit Form */}
            {editMode && editProduct?._id === item._id && (
              <div className="col-span-full p-4 border-t border-gray-200 bg-gray-50">
                <EditForm
                  productId={editProduct._id}
                  product={editProduct}
                  onCancel={handleCancelEdit}
                  onUpdateSuccess={handleUpdateSuccess}
                  token={token}
                />
              </div>
            )}
            
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6 px-2 text-sm text-gray-600">
  <span>
    Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredList.length)} of {filteredList.length}
  </span>
  <div className="flex gap-3 items-center">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      ← Previous
    </button>
    <span className="font-medium">Page {currentPage} / {totalPages}</span>
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Next →
    </button>
  </div>
  <ProductDetail
  productId={selectedProductId}
  visible={showDetailModal}
  onClose={() => {
    setShowDetailModal(false);
    setSelectedProductId(null);
  }}
/>
</div>


      
    </>
  );
};

export default List;
