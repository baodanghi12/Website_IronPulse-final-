import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProdcuts from '../components/RelatedProdcuts';

const Product = () => {
    const { productId } = useParams();
    const { products, currency, addToCart, comments, addComment, token } = useContext(ShopContext);

    const [productData, setProductData] = useState(null);
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [newComment, setNewComment] = useState('');
    const [activeTab, setActiveTab] = useState('description');

    const fetchProductData = () => {
        const foundProduct = products.find(item => item._id === productId);
        if (foundProduct) {
            setProductData(foundProduct);
            setImage(foundProduct.image[0]);
        }
    }

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        addComment(productId, 'Bạn', newComment);
        setNewComment('');
    }

    useEffect(() => {
        fetchProductData();
    }, [productId, products]);

    return productData ? (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
            {/* -------- Product Details -------- */}
            <div className='flex gap-12 flex-col sm:flex-row'>
                {/* Image Gallery */}
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18%] w-full'>
                        {productData.image.map((item, index) => (
                            <img
                                onClick={() => setImage(item)}
                                src={item}
                                key={index}
                                className='w-[24%] sm:w-full sm:mb-3 cursor-pointer'
                                alt=""
                            />
                        ))}
                    </div>
                    <div className='w-full sm:w-[80%]'>
                        <img className='w-full h-auto' src={image} alt="" />
                    </div>
                </div>

                {/* Product Info */}
                <div className='flex-1'>
                    <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <img src={assets.star_icon} key={i} alt="star" className="w-5 h-5" />
                        ))}
                    </div>
                    <p className='mt-5 text-3xl font-medium'>{productData.price}{currency}</p>
                    <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

                    {/* Size Selection */}
                    <div className='flex flex-col gap-4 my-8'>
                        <p>Select Size</p>
                        <div className='flex gap-2'>
                            {productData.sizes.map((item, index) => (
                                <button
                                    onClick={() => setSize(item)}
                                    className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`}
                                    key={index}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div className='flex flex-col gap-4 my-8'>
                        <p>Select Color</p>
                        <div className='flex gap-2 flex-wrap'>
                            {productData.colors?.map((item, index) => (
                                <button
                                    onClick={() => setColor(item.color)}
                                    key={index}
                                    className={`w-10 h-10 rounded-full border-2 transition-all duration-200 
                    ${item.color === color ? 'border-orange-500 scale-110' : 'border-gray-300'}`}
                                    style={{ backgroundColor: item.color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className='flex flex-col gap-4 my-8'>
                        <p>Select Quantity</p>
                        <input
                            type="number"
                            min="1"
                            max={productData.quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className='w-20 border p-2'
                        />
                    </div>

                    {/* Add to cart */}
                    <button
                        onClick={() => addToCart(productData._id, size, color, quantity)}
                        className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'
                    >
                        ADD TO CART
                    </button>

                    <hr className='mt-8 sm:w-4/5' />
                    <div className='text-sm text-gray-500 mt-5'>
                        <p>100% Original product</p>
                        <p>Cash on delivery available</p>
                        <p>Easy return and exchange policy within 7 days</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className='flex mt-10'>
                <button
                    className={`border px-5 py-3 text-sm ${activeTab === 'description' ? 'bg-gray-100' : ''}`}
                    onClick={() => setActiveTab('description')}
                >
                    Description
                </button>
                <button
                    className={`border px-5 py-3 text-sm ${activeTab === 'review' ? 'bg-gray-100' : ''}`}
                    onClick={() => setActiveTab('review')}
                >
                    Review ({comments.filter(c => c.productId === productId).length})
                </button>
            </div>

            {/* Tab Content */}
            <div className='border p-6 text-sm text-gray-700'>
                {activeTab === 'description' ? (
                    <p>{productData.description}</p>
                ) : (
                    <>
                        {/* Review list */}
                        {comments.filter(c => c.productId === productId).length > 0 ? (
                            comments.filter(c => c.productId === productId).map((comment, index) => (
                                <div key={index} className="border-b pb-2 mb-2">
                                    <p className="font-semibold">{comment.user}</p>
                                    <p>{comment.content}</p>
                                    <p className="text-xs text-gray-400">{comment.date}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No comments yet — be the first!</p>
                        )}

                        {/* Comment form */}
                        {token ? (
                            <div className='mt-4'>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write your comment..."
                                    className='w-full border p-2 mb-2 rounded'
                                />
                                <button
                                    onClick={handleAddComment}
                                    className='bg-black text-white px-5 py-2 text-sm rounded'
                                >
                                    Submit
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-400">Log in to comment.</p>
                        )}
                    </>
                )}
            </div>
            {/* Related Products */}
            <RelatedProdcuts category={productData.category} subCategory={productData.subCategory} />
        </div>
    ) : null;
}

export default Product;