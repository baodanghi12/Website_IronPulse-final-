import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    currency,
    getUserInfo,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    fristName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promotionType, setPromotionType] = useState(null);
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    try {
      if (!couponCode) {
        toast.error("Vui lòng nhập mã khuyến mãi");
        return;
      }
  
      const res = await axios.post(`${backendUrl}/api/promotions/check`, { code: couponCode });
  
      if (res.data.success) {
        const promo = res.data.promotion;
        let calculatedDiscount = promo.value;
  
        if (promo.type === 'percent') {
          calculatedDiscount = Math.round((getCartAmount() * promo.value) / 100);
        }
  
        setDiscount(calculatedDiscount);
        setPromotionType(promo.type);
        toast.success(`Áp dụng mã thành công! Giảm ${calculatedDiscount}${currency}`);
      } else {
        toast.error(res.data.message || "Mã khuyến mãi không hợp lệ");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi áp dụng mã");
    }
  };
  

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
  
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
  
      let orderData = {
        phone: formData.phone,
        address: {
          firstName: formData.fristName,
          lastName: formData.lastName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          country: formData.country
        },
        items: orderItems,
        promotionCode: couponCode // 👈 giữ lại dòng này
      };
  
      switch (method) {
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          if (response.data.success) {
            setCartItems({});
            await getUserInfo(token);
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;
        }
  
        case "stripe": {
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        }
  
        case "zalopay": {
          const response = await axios.post(
            backendUrl + "/api/order/zalopay",
            orderData,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          if (response.data.success) {
            window.location.replace(response.data.zalo_url);
          } else {
            toast.error(response.data.message);
          }
          break;
        }
  
        default:
          break;
      }
  
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  
  
  return (
    <form
      onSubmit={onSubmitHandler}
      className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 sm:pt-14 px-4 sm:px-10 min-h-[80vh] border-t"
    >
      {/* Left Side */}
      <div className="flex flex-col gap-6 w-full sm:max-w-[500px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        {/* First and Last Name */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full">
            <label className="text-sm font-medium mb-1 block">First Name</label>
            <input
              required
              name="fristName"
              value={formData.fristName}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded px-4 py-2 w-full"
              type="text"
            />
          </div>
          <div className="w-full">
            <label className="text-sm font-medium mb-1 block">Last Name</label>
            <input
              required
              name="lastName"
              value={formData.lastName}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded px-4 py-2 w-full"
              type="text"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium mb-1 block">Email Address</label>
          <input
            required
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            type="email"
          />
        </div>

        {/* Street */}
        <div>
          <label className="text-sm font-medium mb-1 block">Street</label>
          <input
            required
            name="street"
            value={formData.street}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            type="text"
          />
        </div>

        {/* City and State */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full">
            <label className="text-sm font-medium mb-1 block">City</label>
            <input
              required
              name="city"
              value={formData.city}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded px-4 py-2 w-full"
              type="text"
            />
          </div>
          <div className="w-full">
            <label className="text-sm font-medium mb-1 block">State</label>
            <input
              required
              name="state"
              value={formData.state}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded px-4 py-2 w-full"
              type="text"
            />
          </div>
        </div>

        {/* Zipcode and Country */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full">
            <label className="text-sm font-medium mb-1 block">Zipcode</label>
            <input
              required
              name="zipcode"
              value={formData.zipcode}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded px-4 py-2 w-full"
              type="number"
            />
          </div>
          <div className="w-full">
            <label className="text-sm font-medium mb-1 block">Country</label>
            <input
              required
              name="country"
              value={formData.country}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded px-4 py-2 w-full"
              type="text"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium mb-1 block">Phone Number</label>
          <input
            required
            name="phone"
            value={formData.phone}
            onChange={onChangeHandler}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            type="number"
          />
        </div>
      </div>


      {/* Right: Cart Total, Coupon, Payment */}
      <div className="flex flex-col gap-10">
        <div>
          <CartTotal discount={discount} />
          <div className="mt-4">
            <input
              type="text"
              placeholder="Nhập mã khuyến mãi"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
            >
              Áp dụng mã
            </button>
          </div>
        </div>

        <div>
          <Title text1="PAYMENT" text2="METHOD" />
          <div className="flex flex-col gap-4 mt-3">
            {/* Stripe */}
            <div
              onClick={() => setMethod("stripe")}
              className={`payment-option ${method === "stripe" ? "ring-2 ring-green-400" : ""}`}
            >
              <div className="radio-dot" />
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="stripe" />
            </div>

            {/* ZaloPay */}
            <div
              onClick={() => setMethod("zalopay")}
              className={`payment-option ${method === "zalopay" ? "ring-2 ring-green-400" : ""}`}
            >
              <div className="radio-dot" />
              <img className="h-5 mx-4" src={assets.zalopay} alt="zalopay" />
            </div>

            {/* COD */}
            <div
              onClick={() => setMethod("cod")}
              className={`payment-option ${method === "cod" ? "ring-2 ring-green-400" : ""}`}
            >
              <div className="radio-dot" />
              <p className="text-sm font-medium text-gray-600 mx-4">CASH ON DELIVERY</p>
            </div>
          </div>

          <div className="w-full text-end mt-6">
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md text-sm tracking-wide transition"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
