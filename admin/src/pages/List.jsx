import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import EditForm from "../components/EditForm";
import { VND } from "../utils/handleCurrency";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

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

  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search Box */}
      <div className="mb-6 flex items-center justify-center">
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
        {filteredList.map((item, index) => (
          <React.Fragment key={index}>
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-14 h-14 object-cover rounded"
              />
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
    </>
  );
};

export default List;
