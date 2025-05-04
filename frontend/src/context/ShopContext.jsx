/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, createContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '₫'; // Tiền Việt
  const delivery_fee = 30000;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userInfo, setUserInfo] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promotion, setPromotion] = useState(null);
  const [flashSaleItems, setFlashSaleItems] = useState([]);
const [flashSaleEndTime, setFlashSaleEndTime] = useState(null);
  const navigate = useNavigate();
  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) =>
        item &&
        (item.id === productId || item._id === productId)
    );
  };
  
  const loadFlashSale = async () => {
    try {
      const res = await axios.get('/api/flashsale/active');
      if (res.data.success && Array.isArray(res.data.products) && res.data.endTime) {
        setFlashSaleItems(res.data.products);
        setFlashSaleEndTime(res.data.endTime);
      }
    } catch (err) {
      console.error("❌ Flash Sale Fetch Error:", err);
    }
  };
  useEffect(() => {
    loadFlashSale();
  }, []);
  useEffect(() => {
    if (!token) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, token]);
  
  // ✅ Đây là đúng cách gọi API từ frontend
  const addToWishlist = async (productId) => {
    if (!token) {
      toast.error('Bạn cần đăng nhập để thêm vào wishlist');
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/wishlist/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Dùng token trong state
          },
          withCredentials: true,
        }
      );
  
      if (response.data.success) {
        toast.success('Added to wishlist');
        await loadWishlist(); 
      } else {
        toast.info(response.data.message || 'Already in wishlist');
      }
    } catch (error) {
      console.error("🔥 Wishlist API error:", error);
      toast.error('Error adding to wishlist');
    }
  };
  
  const loadWishlist = async () => {
    if (!token || !userInfo?._id) return;
  
    try {
      const response = await axios.get(`${backendUrl}/api/user/${userInfo._id}/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
  
      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
      }
    } catch (err) {
      console.error('❌ Lỗi khi load wishlist:', err);
    }
  };
  
  
  const removeFromWishlist = async (productId) => {
    if (!token) return;
  
    try {
      const response = await axios.delete(`${backendUrl}/api/user/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
  
      if (response.data.success) {
        setWishlist((prev) => prev.filter((item) => item._id !== productId));
        toast.success('Removed from wishlist');
      } else {
        toast.error(response.data.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error("❌ Failed to remove from wishlist:", error);
      toast.error('Error removing from wishlist');
    }
  };
  


  // 🟢 Load lại token + user info + cart sau reload
  useEffect(() => {
    if (token) {
      getUserInfo(token);
      getUserCart(token);
      getProdcutsData();
    } else {
      setCartItems({});
      setWishlist([]);
    }
  }, [token]);
  useEffect(() => {
    if (token) {
      getProdcutsData(); // ✅ Load lại sản phẩm có flash sale nếu có
    }
  }, [token]);

  const getUserInfo = async (activeToken = token) => {
    try {
      const response = await axios.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });
      
  
      setUserInfo(response.data.user); // Chỉ hoạt động nếu backend trả về { success: true, user }
    } catch (error) {
      console.error('❌ Error fetching profile:', error.response?.data || error.message);
    }
  };

  const getUserCart = async (activeToken = token) => {
    try {
      if (!activeToken) return;
  
      const response = await axios.post(
        backendUrl + '/api/cart/get',
        {},
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
          withCredentials: true,
        }
      );
  
      if (response.data.success) {
        const dbCart = response.data.cartData || {};
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{}');
  
        // 🔀 Merge guestCart và dbCart
        const mergedCart = { ...dbCart };
        for (const itemId in guestCart) {
          if (!mergedCart[itemId]) mergedCart[itemId] = {};
          for (const key in guestCart[itemId]) {
            mergedCart[itemId][key] = (mergedCart[itemId][key] || 0) + guestCart[itemId][key];
          }
        }
  
        // 🧠 Gửi mergedCart lên server để lưu lại
        await axios.post(
          backendUrl + '/api/cart/update',
          { cartData: mergedCart },
          {
            headers: { Authorization: `Bearer ${activeToken}` },
            withCredentials: true,
          }
        );
  
        setCartItems(mergedCart);
        localStorage.removeItem('guestCart'); // ✅ Xóa cart tạm sau khi đã merge
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Lỗi lấy giỏ hàng');
    }
  };
  

  const getProdcutsData = async () => {
    try {
      const productRes = await axios.get(backendUrl + '/api/product/list');
  
      if (!productRes.data.success) {
        toast.error(productRes.data.message || "Không lấy được sản phẩm");
        return;
      }
  
      const productsFromDB = productRes.data.products || [];
  
      // ❌ Không cần merge Flash Sale nữa vì đã có flashSaleItems riêng
      const enriched = productsFromDB.map(p => ({
        ...p,
        isFlashSale: false,
        discountPercent: 0,
        priceBeforeSale: undefined,
        price: p.price,
      }));
  
      setProducts(enriched);
    } catch (error) {
      console.error('❌ Lỗi khi tải sản phẩm:', error);
      toast.error(error.message || "Lỗi khi lấy sản phẩm");
    }
  };
  
  
  

  useEffect(() => {
    getProdcutsData();
  }, []);
  useEffect(() => {
    if (userInfo && userInfo._id) {
      loadWishlist(); // ✅ Gọi lại sau khi userInfo đã có _id
    }
  }, [userInfo]);
  const addToCart = async (itemId, size, color) => {
    if (!size) {
      toast.error('Select Product Size');
      return;
    }
  
    const key = color ? `${size}-${color}` : size; // ✅ dùng key chuẩn
    const cartData = structuredClone(cartItems);
    cartData[itemId] = cartData[itemId] || {};
    cartData[itemId][key] = (cartData[itemId][key] || 0) + 1;
    setCartItems(cartData);
  
    if (token) {
      try {
        const res = await axios.post(
          backendUrl + '/api/cart/add',
          { itemId, size, color },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log('✅ Saved to DB:', res.data.cartData);
      } catch (error) {
        toast.error('Không thể lưu giỏ hàng');
        console.error(error);
      }
    }
  };
  
  
  

  const updateQuantity = async (itemId, size, quantity, color, oldSize = size, oldColor = color) => {
    if (!token) return;
  
    try {
      const response = await axios.post(
        backendUrl + '/api/cart/update',
        { itemId, size, quantity, color, oldSize, oldColor },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
  
      if (response.data.success) {
        setCartItems(response.data.cartData); // ✅ chỉ set lại khi backend đã xử lý xong
      }
    } catch (error) {
      console.error('🔴 Update Cart Error:', error.response || error.message);
      toast.error(error.response?.data?.message || 'Lỗi cập nhật giỏ hàng');
    }
  };
  
  

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (!product) continue;

      for (const key in cartItems[itemId]) {
        totalAmount += product.price * cartItems[itemId][key];
      }
    }
    return totalAmount;
  };
  const logout = () => {
    setUserInfo(null);
    setToken('');
    setWishlist([]);
    setCartItems({}); // 🛒 XÓA GIỎ HÀNG
    localStorage.removeItem('token');
    navigate('/'); // 👉 Nếu muốn điều hướng sau khi logout
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount: () => Object.values(cartItems).reduce((sum, group) =>
      sum + Object.values(group).reduce((s, q) => s + q, 0), 0),
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    userInfo,
    getProdcutsData,
    setUserInfo,
    logout,
    getUserInfo,
    wishlist,
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    promoCode,
    setPromoCode,
    promotion,
    setPromotion,
    flashSaleItems,
flashSaleEndTime,
loadFlashSale,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
