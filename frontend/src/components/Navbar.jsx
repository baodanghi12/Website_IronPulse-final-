import React, { useContext, useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const { setShowSearch, getCartCount, token, setToken, userInfo, setUserInfo, wishlist, backendUrl } = useContext(ShopContext);
  const hideTimeoutRef = useRef(null);

  const handleMouseEnter = (menu) => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setHoveredMenu(menu);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 50);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='flex items-center justify-between py-4 px-6 bg-white shadow-md relative z-50'>
      <Link to='/'>
        <img src={assets.logo11} className="w-32" alt='Logo' />
      </Link>

      <ul className='hidden sm:flex gap-8 text-sm text-gray-600'>
        <NavLink to='/' className='flex flex-col items-center'><p className='hover:text-red-500'>{t('home')}</p></NavLink>
        <NavLink to='/collection' className='flex flex-col items-center'><p className='hover:text-red-500'>{t('collection')}</p></NavLink>
        <NavLink to='/about' className='flex flex-col items-center'><p className='hover:text-red-500'>{t('about')}</p></NavLink>
        <NavLink to='/contact' className='flex flex-col items-center'><p className='hover:text-red-500'>{t('contact')}</p></NavLink>

        {/* MEN */}
        <div className="relative" onMouseEnter={() => handleMouseEnter('men')} onMouseLeave={handleMouseLeave}>
          <NavLink to='/men' className='flex flex-col items-center cursor-pointer'><p className='hover:text-red-500'>MEN</p></NavLink>
          {hoveredMenu === 'men' && (
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg py-6 px-8 grid grid-cols-3 gap-8 justify-center z-50 text-sm text-gray-800 min-w-[720px]'>
              <div><p className='font-bold mb-2'>{t('outstading')}</p><NavLink to='/men' className='text-red-600 font-bold text-3xl leading-tight hover:underline'>UP TO 50%</NavLink></div>
              <div><p className='font-bold mb-2'>{t('shirt')}</p><NavLink to='/men/category/Áo Thun & Polo' className='block hover:underline'>Áo Thun & Polo</NavLink><NavLink to='/men/category/Áo Khoác' className='block hover:underline'>Áo khoác</NavLink><NavLink to='/men/category/Áo sơ mi' className='block hover:underline'>Áo sơ mi</NavLink></div>
              <div><p className='font-bold mb-2'>{t('pants')}</p><NavLink to='/men/quan/Quần short' className='block hover:underline'>Quần short</NavLink><NavLink to='/men/quan/Quần dài' className='block hover:underline'>Quần dài</NavLink><NavLink to='/men/quan/Quần Jean' className='block hover:underline'>Quần Jean</NavLink><NavLink to='/men/quan/Quần âu' className='block hover:underline'>Quần Âu</NavLink></div>
            </div>
          )}
        </div>

        {/* WOMEN */}
        <div className="relative" onMouseEnter={() => handleMouseEnter('women')} onMouseLeave={handleMouseLeave}>
          <NavLink to='/women' className='flex flex-col items-center cursor-pointer'><p className='hover:text-red-500'>WOMEN</p></NavLink>
          {hoveredMenu === 'women' && (
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg py-6 px-8 grid grid-cols-4 gap-8 justify-center z-50 text-sm text-gray-800 min-w-[960px]'>
              <div><p className='font-bold mb-2'>{t('outstading')}</p><NavLink to='/women' className='text-red-600 font-bold text-3xl leading-tight hover:underline'>UP TO 50%</NavLink></div>
              <div><p className='font-bold mb-2'>{t('shirt')}</p><NavLink to='/women/category/Áo' className='block hover:underline'>Áo</NavLink><NavLink to='/women/category/Áo thun' className='block hover:underline'>Áo thun</NavLink><NavLink to='/women/category/Áo khoác' className='block hover:underline'>Áo khoác</NavLink><NavLink to='/women/category/Áo sơ mi' className='block hover:underline'>Áo sơ mi</NavLink><NavLink to='/women/category/Áo Croptop' className='block hover:underline'>Áo croptop</NavLink></div>
              <div><p className='font-bold mb-2'>{t('pants')}</p><NavLink to='/women/quan/Quần short' className='block hover:underline'>Quần short</NavLink><NavLink to='/women/quan/Quần tây' className='block hover:underline'>Quần tây</NavLink><NavLink to='/women/quan/Quần Jean' className='block hover:underline'>Quần Jean</NavLink></div>
              <div><p className='font-bold mb-2'>VÁY/ĐẦM</p><NavLink to='/women/vaydam/Váy ngắn' className='block hover:underline'>Váy ngắn</NavLink><NavLink to='/women/vaydam/Váy dài' className='block hover:underline'>Váy dài</NavLink><NavLink to='/women/vaydam/Đầm dự tiệc' className='block hover:underline'>Đầm dự tiệc</NavLink><NavLink to='/women/vaydam/Đầm công sở' className='block hover:underline'>Đầm công sở</NavLink></div>
            </div>
          )}
        </div>

        {/* CHILDREN */}
        <div className="relative" onMouseEnter={() => handleMouseEnter('children')} onMouseLeave={handleMouseLeave}>
          <NavLink to='/children' className='flex flex-col items-center cursor-pointer'><p className='hover:text-red-500'>CHILDREN</p></NavLink>
          {hoveredMenu === 'children' && (
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg py-6 px-8 grid grid-cols-3 gap-8 justify-center z-50 text-sm text-gray-800 min-w-[720px]'>
              <div><p className='font-bold mb-2'>{t('outstading')}</p><NavLink to='/children' className='text-red-600 font-bold text-3xl leading-tight hover:underline'>UP TO 50%</NavLink></div>
              <div><p className='font-bold mb-2'>{t('shirt')}</p><NavLink to='/children/category/Áo Thun' className='block hover:underline'>Áo thun</NavLink><NavLink to='/children/category/Áo Khoác' className='block hover:underline'>Áo khoác</NavLink><NavLink to='/children/category/Áo sơ mi' className='block hover:underline'>Áo sơ mi</NavLink></div>
              <div><p className='font-bold mb-2'>{t('pants')}</p><NavLink to='/children/pants/Quần short' className='block hover:underline'>Quần short</NavLink><NavLink to='/children/pants/Quần dài' className='block hover:underline'>Quần dài</NavLink><NavLink to='/children/pants/Quần Jean' className='block hover:underline'>Quần Jean</NavLink></div>
            </div>
          )}
        </div>

        <NavLink to='/new-arrivals' className='flex flex-col items-center'><p className='hover:text-red-500'>NEW ARRIVALS</p></NavLink>
      </ul>

      <NavLink to='/category/sale' className='hidden sm:flex items-center justify-center text-sm text-red-600 bg-gray-100 p-2 rounded-lg'>
      {t('sale40')}
      </NavLink>

      

      <div className='flex items-center gap-8'>
        <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="Search" />
        <Link to='/wishlist' className='relative'>
          <img src={assets.w_img} className='w-5' alt="Wishlist" />
          {wishlist.length > 0 && <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-red-500 text-white aspect-square rounded-full text-xs'>{wishlist.length}</p>}
        </Link>
        <div className='relative' ref={dropdownRef}>
          {token && userInfo ? (
            <>
              <img onClick={() => setDropdownOpen(!dropdownOpen)} className='w-8 h-8 rounded-full object-cover cursor-pointer' src={userInfo.avatar ? `${backendUrl}/${userInfo.avatar}` : assets.profile_icon} alt="Profile" />
              {dropdownOpen && (
                <div className='absolute right-0 top-10 bg-white shadow-lg rounded-lg w-64 p-4 z-10'>
                  <div className='flex items-center gap-3 border-b pb-3 mb-3'>
                    <div className='bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg'>{userInfo.name?.charAt(0).toUpperCase() || 'U'}</div>
                    <div>
                      <p className='font-semibold text-gray-800'>{userInfo.name}</p>
                      <p className='text-sm text-gray-500'>{userInfo.email}</p>
                    </div>
                  </div>
                  <Link to='/profile' className='flex items-center gap-2 py-2 hover:bg-gray-100 px-2 rounded'><span className='material-icons text-gray-600'>person</span>{t('myaccount')}</Link>
                  <Link to='/orders' className='flex items-center gap-2 py-2 hover:bg-gray-100 px-2 rounded'><span className='material-icons text-gray-600'>assignment</span>{t('orders')}</Link>
                  <Link to='/wishlist' className='flex items-center gap-2 py-2 hover:bg-gray-100 px-2 rounded'><span className='material-icons text-gray-600'>favorite</span>{t('favorite')}</Link>
                  <Link to='/promotions' className='flex items-center gap-2 py-2 hover:bg-gray-100 px-2 rounded'>
            <span className='material-icons text-gray-600'>card_giftcard</span>{t('promotions')}</Link>
                  <p onClick={() => { setUserInfo(null); setToken(null); localStorage.removeItem('token'); }} className='flex items-center gap-2 py-2 hover:bg-gray-100 px-2 rounded cursor-pointer'><span className='material-icons text-gray-600'>logout</span>{t('logout')}</p>
                </div>
              )}
            </>
          ) : (
            <Link to='/login'><img className='w-5 cursor-pointer' src={assets.profile_icon} alt="Profile" /></Link>
          )}
        </div>
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5' alt="Cart" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-xs'>{getCartCount()}</p>
        </Link>
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="Menu" />
      </div>

      <div className={`fixed top-0 right-0 h-full bg-white transition-all ${visible ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="Back" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/'>{t('home')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/collection'>{t('collection')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/about'>{t('about')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/contact'>{t('contact')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/men'>{t('men')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/women'>{t('women')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/children'>{t('children')}</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-b' to='/new-arrivals'>NEW ARRIVALS</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;