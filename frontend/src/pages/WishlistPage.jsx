import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const WishlistPage = () => {
  const { wishlist, loadWishlist, removeFromWishlist, currency } = useContext(ShopContext);

  useEffect(() => {
    loadWishlist();
  }, []);

  const formatPrice = (price) =>
    typeof price === 'number'
      ? price.toLocaleString('vi-VN') + ` ${currency}`
      : 'N/A';

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className='text-gray-500'>Your wishlist is empty.</p>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
          {wishlist
            .filter((item) => item && (item._id || item.id))
            .map((item, index) => {
              const id = item._id?.toString() || item.id;
              const name = item.title || item.name || 'Unnamed';
              const image = Array.isArray(item.image)
                ? item.image[0]
                : item.image;
              const category = item.category || '—';
              const subCategory = item.subCategory || '—';

              return (
                <div
                  key={id || index}
                  className='relative border border-gray-200 hover:shadow-md transition rounded-xl overflow-hidden group bg-white'
                >
                  <button
                    onClick={() => removeFromWishlist(id)}
                    className='absolute top-2 right-2 bg-white text-gray-600 p-2 rounded-full shadow hover:bg-red-100 hover:text-red-600 transition z-10'
                    aria-label="Remove from wishlist"
                  >
                    <FaTrash size={14} />
                  </button>

                  <Link to={`/product/${id}`} className='block'>
                    <img
                      src={image || '/default.png'}
                      alt={name}
                      className='w-full h-40 object-cover rounded-t-xl'
                    />
                    <div className='p-3'>
                      <h2 className='text-sm font-semibold text-gray-800 mb-1 truncate'>
                        {name}
                      </h2>
                      <p className='text-xs text-gray-500 mb-1'>
                        {category} / {subCategory}
                      </p>
                      <p className='text-sm font-semibold text-red-600'>
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
