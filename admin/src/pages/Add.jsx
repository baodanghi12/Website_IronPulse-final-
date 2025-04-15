import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  // Thêm state màu sắc
  const [colors, setColors] = useState([])
  const [newColor, setNewColor] = useState('#000000') // Mặc định màu đen

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))
      formData.append('colors', JSON.stringify(colors)) // Gửi lên server

      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const response = await axios.post(backendUrl + '/api/product/add', formData, {
        headers: { token }
      })

      if (response.data.success) {
        toast.success(response.data.message)
        // Reset form
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setSizes([])
        setBestseller(false)
        setColors([])
        setNewColor('#000000')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>

      {/* Upload ảnh */}
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[image1, image2, image3, image4].map((img, idx) => (
            <label key={idx} htmlFor={`image${idx + 1}`}>
              <img className='w-20' src={!img ? assets.upload_area : URL.createObjectURL(img)} alt="" />
              <input onChange={(e) => {
                const setFn = [setImage1, setImage2, setImage3, setImage4][idx]
                setFn(e.target.files[0])
              }} type="file" id={`image${idx + 1}`} hidden />
            </label>
          ))}
        </div>
      </div>

      {/* Tên sản phẩm */}
      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
      </div>

      {/* Mô tả */}
      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Write content here' required />
      </div>

      {/* Danh mục, phụ danh mục, giá */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Sub category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25' />
        </div>
      </div>

      {/* Chọn size */}
      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3 flex-wrap'>
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <div key={size} onClick={() => setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}>
              <p className={`${sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}>{size}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Chọn màu sắc */}
      <div className='w-full'>
        <p className='mb-2'>Product Colors</p>

        <div className="flex items-center gap-2 mb-2">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-10 h-10 border border-gray-300"
          />
          <input
  type="text"
  placeholder="Color name or hex"
  value={newColor}
  onChange={(e) => setNewColor(e.target.value)}
  className="w-[120px] px-3 py-2 border border-gray-300"
/>
<button
  type="button"
  onClick={() => {
    const colorToAdd = newColor.trim()
    if (colorToAdd && !colors.includes(colorToAdd)) {
      setColors(prev => [...prev, colorToAdd])
      setNewColor('#000000')
    }
  }}
  className="w-[120px] py-2 bg-black text-white"
>
  Add
</button>

        </div>

        <div className="flex gap-2 flex-wrap">
          {colors.map((color, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <div
                style={{
                  backgroundColor: color,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '1px solid #ccc'
                }}
                title={color}
              />
              <button
                type="button"
                onClick={() => setColors(prev => prev.filter(c => c !== color))}
                className="text-sm text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Best seller */}
      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  )
}

export default Add
