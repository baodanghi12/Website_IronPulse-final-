import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { VND } from '../utils/handleCurrency';

const EditForm = ({ token, productId, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([false, false, false, false]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [bestSeller, setBestSeller] = useState(false);
  const [flashSale, setFlashSale] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState('#000000');
  const [importProducts, setImportProducts] = useState([]);
  // Gọi API để lấy thông tin sản phẩm
  useEffect(() => {
    setLoading(true);
    fetchProduct();
  }, [productId, token]);
 
  const fetchProduct = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/product/single`,
        { productId },
        { headers: { token } }
      );
  
      if (res.data.success) {
        const p = res.data.product;
        setProduct(p);
        setName(p.name);
        setDescription(p.description);
        setPrice(p.price);
        setCategory(p.category);
        setSubCategory(p.subCategory);
        setBestSeller(p.bestseller);
        setFlashSale(p.flashSale);
        setSizes(p.sizes || []);
        setColors(p.colors || []);
  
        const imgs = Array(4).fill(false);
        for (let i = 0; i < 4; i++) {
          imgs[i] = p.image[i] || false;
        }
        setImages(imgs);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi gửi form
  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('bestSeller', bestSeller ? 'true' : 'false');
    formData.append('flashSale', flashSale ? 'true' : 'false');
    formData.append('sizes', JSON.stringify(sizes));
    formData.append('colors', JSON.stringify(colors));
  
    images
      .filter((img) => img && typeof img !== 'string')
      .forEach((img, i) => {
        formData.append(`image${i + 1}`, img);
      });
  
    // Debug: Log formData content
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      const url = `${backendUrl}/api/product/edit/${productId}`;
      const res = await axios.put(url, formData, {
        headers: {
          token,
          // 'Content-Type' should be omitted for FormData
        },
      });
  
      if (res.data.success) {
        toast.success(res.data.message);
        fetchProduct();
        if (onUpdateSuccess && typeof onUpdateSuccess === 'function') {
          onUpdateSuccess();
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error in submission:", err.response ? err.response.data : err);
      toast.error(err.response ? err.response.data.message : 'Failed to update product');
    }
};

  
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      {/* Upload Image */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {images.map((img, idx) => (
            <label key={idx} htmlFor={`image${idx}`}>
              <img
                className="w-20 h-20 object-cover"
                src={typeof img === 'string'
                  ? img.startsWith('http') ? img : `${backendUrl}/${img}`
                  : img
                  ? URL.createObjectURL(img)
                  : assets.upload_area}
                alt={`image${idx + 1}`}
              />
              <input
                type="file"
                id={`image${idx}`}
                hidden
                accept="image/*"
                onChange={(e) => handleImageChange(e, idx)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>

      {/* Category, SubCategory, Price */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div>
          <p className="mb-2">Category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="px-3 py-2">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Price</p>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-3 py-2 w-[100px]"
            type="number"
            min={0}
            placeholder="0"
            required
          />
        </div>
      </div>
      {/* Danh sách sizes và cost tương ứng */}
<div className="mt-4">
  <h4 className="font-semibold">Size / Quantity</h4>
  <div className="flex flex-col gap-1 text-sm mt-2">
    {sizes && sizes.length > 0 ? (
      sizes.map((s, idx) => (
        <div key={idx} className="flex gap-3">
          <span><b>Size:</b> {s.size}</span>
          <span><b>Quantity:</b> {s.quantity}</span>
        </div>
      ))
    ) : (
      <span className="text-gray-500">No size info</span>
    )}
  </div>

  {/* Hiển thị cost một lần */}
  <div className="mt-2">
    <span><b>Cost:</b> {VND.format(product?.cost ?? 0)}</span>
  </div>
</div>


      {/* Colors */}
      <div className="w-full">
        <p className="mb-2">Colors</p>
        <div className="flex items-center gap-2 mb-2">
          <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-[120px] px-3 py-2 border"
          />
          <button
            type="button"
            className="bg-black text-white px-3 py-2"
            onClick={() => {
              if (!colors.includes(newColor)) {
                setColors([...colors, newColor]);
              }
            }}
          >
            Add Color
          </button>
        </div>
        <div className="flex gap-3 flex-wrap">
          {colors.map((color) => (
            <div key={color} className="flex gap-2 items-center">
              <div
                style={{ backgroundColor: color }}
                className="w-6 h-6 border border-black"
              />
              <button
                type="button"
                className="text-red-500"
                onClick={() => setColors(colors.filter((c) => c !== color))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Best Seller and Flash Sale */}
      <div className="flex gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={bestSeller}
            onChange={() => setBestSeller(!bestSeller)}
          />
          <p className="ml-2">Best Seller</p>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={flashSale}
            onChange={() => setFlashSale(!flashSale)}
          />
          <p className="ml-2">Flash Sale</p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-5 py-3 mt-4"
      >
        {loading ? 'Updating...' : 'Update Product'}
      </button>
    </form>
  );
};

export default EditForm;
