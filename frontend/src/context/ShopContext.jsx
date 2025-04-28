/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false)
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState({});
    const [products,setProducts] = useState([]);
    const [token,setToken] = useState('')
    const navigate = useNavigate()
    const [comments, setComments] = useState([
        { productId: 'abc123', user: 'Đạt', content: 'Sản phẩm rất tốt!', date: '20/04/2025' },
        { productId: 'abc123', user: 'Bảo', content: 'Hài lòng lắm.', date: '21/04/2025' },
      ]);


      const addToCart = async (itemId, size, color, quantity = 1) => {
        if (!size) {
          toast.error('Select Product Size');
          return;
        }
      
        let cartData = structuredClone(cartItems);
      
        if (!cartData[itemId]) cartData[itemId] = {};
        const key = size + (color ? `-${color}` : '');
      
        cartData[itemId][key] = (cartData[itemId][key] || 0) + quantity;
        setCartItems(cartData);
      
        if (token) {
          try {
            await axios.post(backendUrl + '/api/cart/add', { itemId, size, color, quantity }, {
                withCredentials: true, // ✅ Thêm dòng này
              });
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
        }
      }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId,size,quantity) => {
        
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData);

        if (token) {
            try {
                
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, {
                    withCredentials: true, // ✅ Thêm dòng này
                  });
                  

            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            if (!itemInfo) continue;
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item]
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        }
        return totalAmount;
    }

    const getProdcutsData = async () => {
        try {
            
            const response = await axios.get(backendUrl + '/api/product/list') 
            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }

    const getUserCart = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {
                withCredentials: true, // ✅ THÊM
            });
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const addComment = (productId, user, content) => {
        const newComment = {
          productId,
          user,
          content,
          date: new Date().toLocaleString()
        };
        setComments([...comments, newComment]);
      };

      const getUserData = async () =>{
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/data', {
              withCredentials: true, // 🔥 thêm luôn cho chắc ăn
            })
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }
    

    /*const getAuthState = async()=> {
        try {
            const {data} = await axios.get(backendUrl + 'api/user/is-auth')
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }*/

    /*useEffect(()=>{
        getAuthState();
    },[])*/


    useEffect(()=>{
        getProdcutsData()
    },[])

    useEffect(()=> {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            
        }
        getUserCart()
    },[])

    const value = {
        products , currency, delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems,addToCart, setCartItems,
        getCartCount,updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken,token,
        comments, addComment,
        isLoggedin, setIsLoggedin,
        userData, setUserData ,
        getUserData 
    }   

    return (
        <ShopContext.Provider value={value}> 
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;