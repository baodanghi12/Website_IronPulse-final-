import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import EditForm from "../components/EditForm"
const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message || "Error fetching products");
      }
    } catch (error) {
      toast.error("Error fetching data. Please try again later.");
      console.error("Error:", error);
    }
    
  };
  

  //edit product:
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false); // New state for view mode
  const [editProduct, setEditProduct] = useState(null);
  const handleViewClick = (product) => {
    setEditProduct(product);
    setViewMode(true); // Switch to view mode
    setEditMode(false); // Ensure not in edit mode
  };
const handleEditClick = (product) => {
  setEditProduct(product);
  setEditMode(true);
};

const handleCancelEdit = () => {
  setEditMode(false);
  setEditProduct(null);
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
      console.log(error);
      toast.error(error.message);
    }
  };
  const handleUpdateSuccess = () => {
    fetchList(); // load lại danh sách
    setEditMode(false); // đóng form chỉnh sửa
    setEditProduct(null); // reset product đang chỉnh sửa
  };
  useEffect(() => {
    fetchList();
  }, []);
  const filteredList = list.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
       {/* Thanh tìm kiếm */}
       <div className="mb-4 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
          {/* Icon tìm kiếm */}
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 4a7 7 0 017 7v1a7 7 0 11-7-7z"
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {/* Table title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Colors</b>
          <b className="text-center">Action</b>
        </div>
  
        {/* List of products */}
        {list.map((item, index) => (
          <React.Fragment key={index}>
            {/* Sản phẩm */}
            <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm">
              <img className="w-12" src={item.image[0]} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <div className="flex gap-2">
                {item.colors?.length > 0 ? (
                  item.colors.map((color, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border" style={{ backgroundColor: color }} />
                  ))
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-1 items-center justify-end md:justify-center text-sm">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className="text-red-500 hover:underline"
                >
                  X
                </button>
              </div>
            </div>
  
            {/* Form chỉnh sửa hiện ngay dưới sản phẩm đang edit */}
            {editMode && editProduct?._id === item._id && (
  <div className="col-span-full border-t border-gray-200 px-4 py-3 bg-gray-50">
    <EditForm
      productId={editProduct._id}
      product={editProduct}
      onCancel={handleCancelEdit}
      onUpdateSuccess={handleUpdateSuccess}
      onSaved={() => {
        fetchList();
        setEditMode(false);
        setEditProduct(null);
      }}
      token={token}
    />
  </div>
)}
          </React.Fragment>
        ))}
      </div>
    </>
  );
  
};

export default List;
