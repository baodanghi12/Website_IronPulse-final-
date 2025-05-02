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
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      {/* Upload ảnh */}
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[image1, image2, image3, image4].map((img, idx) => (
            <label key={idx} htmlFor={`image${idx + 1}`}>
              <img className='w-20' src={!img ? assets.upload_area : URL.createObjectURL(img)} alt="" />
              <input
                onChange={(e) => {
                  const setFn = [setImage1, setImage2, setImage3, setImage4][idx];
                  setFn(e.target.files[0]);
                }}
                type="file"
                id={`image${idx + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* Tên sản phẩm */}
      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className='w-full max-w-[500px] px-3 py-2'
          type="text"
          placeholder='Type here'
          required
        />
      </div>

      {/* Mô tả */}
      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className='w-full max-w-[500px] px-3 py-2'
          placeholder='Write content here'
          required
        />
      </div>

      {/* Danh mục, phụ danh mục, giá */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className='w-full px-3 py-2'>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Sub category</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className='w-full px-3 py-2'>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className='w-full px-3 py-2 sm:w-[120px]'
            type="number"
            placeholder='25'
          />
        </div>
      </div>

      {/* Size chọn dạng Select đẹp */}
      <div className='w-full'>
        <p className='mb-2'>Chọn size</p>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Chọn size cho sản phẩm"
          value={selectedSizes}
          onChange={(value) => setSelectedSizes(value)}
        >
          {sizeOptions.map((size) => (
            <Option key={size} value={size}>
              {size}
            </Option>
          ))}
        </Select>
      </div>
          {/* Chọn màu */}
{/* Chọn màu */}
<div className='w-full mt-4'>
  <p className='mb-2'>Chọn màu</p>
  <div className='flex items-center gap-4'>
    <input
      type="color"
      value={newColor}
      onChange={(e) => setNewColor(e.target.value)}
      className='w-10 h-10 p-0 border rounded-md'
    />
    <button
      type="button"
      onClick={() => setColors([newColor])} // 👈 chỉ cho 1 màu duy nhất
      className='px-4 py-2 bg-black text-white rounded-md'
    >
      Chọn màu
    </button>
  </div>

  {/* Hiển thị màu đã chọn */}
  {colors.length > 0 && (
    <div className='flex items-center gap-4 mt-4'>
      {colors.map((color, index) => (
        <div key={index} className="relative">
          <div
            className='w-10 h-10 rounded-full border shadow-md'
            style={{ backgroundColor: color }}
          />
          <button
            type="button"
            onClick={() => setColors([])} // 👈 bấm là xóa màu luôn
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>

      {/* Best seller */}
      <div className='flex gap-2 mt-2'>
  <input
    onChange={() => setNewArrival(prev => !prev)}
    checked={newArrival}
    type="checkbox"
    id='newArrival'
  />
  <label className='cursor-pointer' htmlFor="newArrival">Add to New Arrival</label>
</div>


      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  );
};

export default Add;
