import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { Select } from 'antd';
const { Option } = Select;

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Topwear');
  const [newArrival, setNewArrival] = useState(false);


  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState('#000000');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('newArrival', newArrival);

      const formattedSizes = selectedSizes.map((size) => ({
        size,
        quantity: 0, // quantity mặc định = 0, sẽ nhập sau ở trang nhập hàng
      }));

      formData.append('sizes', JSON.stringify(formattedSizes));
      formData.append('colors', JSON.stringify(colors));

      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);

      const response = await axios.post(backendUrl + '/api/product/add', formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setSelectedSizes([]);
        setNewArrival(false);
        setColors([]);
        setNewColor('#000000');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
  <form
  onSubmit={onSubmitHandler}
  className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow border text-sm px-6 py-4"
  style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.7fr', gap: '2rem', alignItems: 'start', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto' }}
>
  {/* Image Upload - bên trái */}
  <div className="space-y-2">
    <h2 className="text-base font-semibold text-gray-800">Upload Images</h2>
    <div className="grid grid-cols-2 gap-2">
      {[image1, image2, image3, image4].map((img, idx) => (
        <label key={idx} htmlFor={`image${idx + 1}`} className="cursor-pointer">
          <img
            className="w-full aspect-square object-cover border rounded"
            src={!img ? assets.upload_area : URL.createObjectURL(img)}
            alt=""
          />
          <input
            type="file"
            id={`image${idx + 1}`}
            hidden
            onChange={(e) => {
              const setFn = [setImage1, setImage2, setImage3, setImage4][idx];
              setFn(e.target.files[0]);
            }}
          />
        </label>
      ))}
    </div>
  </div>

  {/* Form nhập thông tin */}
  <div className="grid grid-cols-2 gap-4">
    <div className="col-span-2">
      <label className="block text-xs font-semibold mb-1">Product Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border rounded"
        required
      />
    </div>

    <div>
      <label className="block text-xs font-semibold mb-1">Price (VND)</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
    </div>

    <div className="flex items-center mt-6 gap-2">
      <input
        type="checkbox"
        id="newArrival"
        checked={newArrival}
        onChange={() => setNewArrival(prev => !prev)}
      />
      <label htmlFor="newArrival" className="text-sm">New Arrival</label>
    </div>

    <div>
      <label className="block text-xs font-semibold mb-1">Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      >
        <option>Men</option>
        <option>Women</option>
        <option>Kids</option>
      </select>
    </div>

    <div>
      <label className="block text-xs font-semibold mb-1">Sub Category</label>
      <select
        value={subCategory}
        onChange={(e) => setSubCategory(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      >
        <option>Topwear</option>
        <option>Bottomwear</option>
        <option>Winterwear</option>
      </select>
    </div>

    <div className="col-span-2">
      <label className="block text-xs font-semibold mb-1">Select Sizes</label>
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        value={selectedSizes}
        onChange={setSelectedSizes}
        size="small"
        placeholder="Select available sizes"
      >
        {sizeOptions.map(size => (
          <Option key={size} value={size}>{size}</Option>
        ))}
      </Select>
    </div>

    <div className="col-span-2">
      <label className="block text-xs font-semibold mb-1">Color</label>
      <div className="flex items-center gap-3 mt-1">
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="w-8 h-8 border rounded"
        />
        <button
          type="button"
          onClick={() => setColors([newColor])}
          className="px-3 py-1 bg-black text-white text-xs rounded"
        >
          Set
        </button>
        {colors.length > 0 && (
          <div
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: colors[0] }}
          />
        )}
      </div>
    </div>

    <div className="col-span-2">
      <label className="block text-xs font-semibold mb-1">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 border rounded"
      />
    </div>

    <div className="col-span-2 mt-2">
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-900"
      >
        ADD PRODUCT
      </button>
    </div>
  </div>
</form>

);
};

export default Add;
