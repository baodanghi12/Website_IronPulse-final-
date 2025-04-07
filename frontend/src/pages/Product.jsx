import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProdcuts from '../components/RelatedProdcuts';

const Product = () => {

    const {productId} = useParams();
    const {products, currency, addToCart} = useContext(ShopContext);
    const [productData,setProductData] = useState(false);
    const [image,setImage] = useState('')
    const [size,setSize] = useState('')

    const fetchProductData = async () => {

        products.map((item)=>{
            if (item._id === productId) {
                setProductData(item)
                setImage(item.image[0])
                return null;
            }
        })

    }

    useEffect(()=>{
        fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[productId, products])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'> 
        {/* ----------- Product Data ---------- */}
        <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

            {/* --------- Product Images ----------- */}
            <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:jusify-normal sm:w-[18.7%] w-full'>
                    {
                        productData.image.map((item,index)=>(
                            <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                        ))
                    }
                </div>
                <div className='w-full sm:w-[80%]'>
                    <img className='w-full h-auto' src={image} alt="" />
                </div>
            </div>

            {/* --------- Product Info ---------- */}
            <div className='flex-1'>
                <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
                <div className='flex items-center gap-1 mt-2'>
                    <img src={assets.star_icon} alt="" className="w-3 5" />
                    <img src={assets.star_icon} alt="" className="w-3 5" />
                    <img src={assets.star_icon} alt="" className="w-3 5" />
                    <img src={assets.star_icon} alt="" className="w-3 5" />
                    <img src={assets.star_dull_icon} alt="" className="w-3 5" />
                    <p className='p1-2'>(122)</p>
                </div>
                <p className='mt-5 text-3xl font-medium'>{productData.price}{currency}</p>
                <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
                <div className='flex flex-col gap-4 my-8'>
                    <p>Select Size</p>
                    <div className='flex gap-2'>
                        {productData.sizes.map((item,index)=>(
                            <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                        ))}
                    </div>
                </div>
                <button onClick={()=>addToCart(productData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
                <hr className='mt-8 sm:w-4/5' />
                <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                        <p>100% Orignial product.</p>
                        <p>Cash on delivery is avaiable om this product.</p>
                        <p>Easy return and exchange policy within 7 days</p>
                </div>
            </div>
        </div>

        {/* ---------- Description & Review Section ------------- */}
        <div className='mt-20'>
            <div className='flex'>
                <b className='border px-5 py-3 text-sm'>Decription</b>
                <p className='border px-5 py-3 text-sm'>Rewview (122)</p>
            </div>
            <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
                <p>chao mung ban den voi website cua chung toi – khong gian mua sam truc tuyen hien dai, noi ban co the de dang kham pha hang ngan san pham da dang, chat luong vuot troi voi muc gia canh tranh, cung dich vu cham soc khach hang tan tam, mang den trai nghiem mua sam an toan, nhanh chong va tien loi nhat.</p>
                <p>Website cua chung toi chuyen cung cap quan ao da dang cho nam, nu va tre em voi kieu dang hien dai, chat lieu cao cap, phu hop voi moi lua tuoi va phong cach. San pham duoc cap nhat lien tuc theo xu huong, mang den trai nghiem mua sam tien loi va chat luong.</p>
            </div>
        </div>

        {/*---------- display related products --------------*/}

        <RelatedProdcuts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
