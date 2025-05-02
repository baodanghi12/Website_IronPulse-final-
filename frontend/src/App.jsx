import React, { Children } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Verify from './pages/Verify'
import Header from './components/Header';
import AboutUs from './components/AboutUs';
import MyOrders from './pages/MyOrders';
import Hero from './components/Hero';
import Men from './pages/Men';
import Women from './pages/Women';
import ChildrenPage from './pages/ChildrenPage';
import LatestArrivals from './pages/LatestArrivals';
import Winter from './pages/Winter';
import BigSale from './pages/BigSale';
import StreetwearPage from './pages/Collection/StreetwearPage';
import WinterPage from './pages/Collection/WinterPage';
import IronPulsePage from './pages/Collection/IronPulsePage';
import HelaPage from './pages/Collection/HelaPage';
import BoxyPage from './pages/Collection/BoxyPage';
import FlannelPage from './pages/Collection/FlannelPage';
import MinimalistPage from './pages/Collection/MinimalistPage';
import UrbanStylePage from './pages/Collection/UrbanStylePage';
import CasualLookPage from './pages/Collection/CasuallookPage'
import MenCategoryPageAo from './pages/CatagoryPage/MenCategoryPageAo';
import MenCategoryPageQuan from './pages/CatagoryPage/MenCategoryPageQuan';
import MenFinalSale from './pages/CatagoryPage/MenFinalSale';
import WomenCategoryPageAo from './pages/CatagoryPage/WomenCategoryPageAo';
import WomenCategoryPageQuan from './pages/CatagoryPage/WomenCategoryPageQuan';
import WomenCategoryPageVayDam from './pages/CatagoryPage/WomenCategoryPageVayDam';
import WomenFinalSale from './pages/CatagoryPage/WomenFinalSale';
import ChildrenCategoryPageAo from './pages/CatagoryPage/ChildrenCategoryPageAo';
import ChildrenCategoryPageQuan from './pages/CatagoryPage/ChildrenCategoryPageQuan';
import ChildrenFinalSale from './pages/CatagoryPage/ChildrenFinalSale';
import LatestArrivalsCategoryAo from './pages/CatagoryPage/LatestArrivalsCategoryAo';
import LatestArrivalsCategoryQuan from './pages/CatagoryPage/LatestArrivalsCategoryQuan';
import LatestArrivalsFinalSale from './pages/CatagoryPage/LatestArrivalsFinalSale';
import PrivacyPolicy from './pages/FooterPage/PrivacyPolicy';
import WarantyPolicy from './pages/FooterPage/WarantyPolicy';
import DeliveryPolicy from './pages/FooterPage/DeliveryPolicy';
import FAQ from './pages/FooterPage/FAQ';
import WishlistPage from './pages/WishlistPage';
import Chatbot from './pages/Chatbot'
import ForgetPassword from './pages/ForgetPassword'
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <div className='w-full'>
      <Header />
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
      <Route path='/men/category/:type' element={<MenCategoryPageAo />} />
      <Route path='/men/quan/:type' element={<MenCategoryPageQuan />} />
      <Route path="/men/final-sale/:type" element={<MenFinalSale />} />
      <Route path="/women/category/:type" element={<WomenCategoryPageAo />} />
      <Route path="/women/quan/:type" element={<WomenCategoryPageQuan />} />
      <Route path="/women/vaydam/:type" element={<WomenCategoryPageVayDam />} />
      <Route path="/women/final-sale/:type" element={<WomenFinalSale />} />
      <Route path="/children/category/:type" element={<ChildrenCategoryPageAo />} />
      <Route path="/children/pants/:type" element={<ChildrenCategoryPageQuan />} />
      <Route path="/children/final-sale/:type" element={<ChildrenFinalSale />} />
      <Route path="/latest-arrivals/ao/:type" element={<LatestArrivalsCategoryAo />} />
      <Route path="/latest-arrivals/category/:type" element={<LatestArrivalsCategoryQuan />} />
      <Route path="/latest-arrivals/final-sale/:type" element={<LatestArrivalsFinalSale />} />
      <Route path='/men' element={<Men/>} />
        <Route path='/women' element={<Women/>} />
        <Route path='/children' element={<ChildrenPage/>} />
        <Route path='/' element={<Home/>} />
        <Route path="/" element={<Hero />} />
        <Route path='/collection' element={<Collection/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/product/:productId' element={<Product/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/place-order' element={<PlaceOrder/>} />
        <Route path='/orders' element={<Orders/>} />
        <Route path='/verify' element={<Verify/>} />
        <Route path="/new-arrivals" element={<LatestArrivals />} />
        <Route path='/orders' element={<MyOrders />} /> 
        <Route path="/category/men" element={<Men />} />
        <Route path="/category/women" element={<Women />} />
        <Route path="/category/new" element={<LatestArrivals />} />
        <Route path="/category/winter" element={<Winter />} />
        <Route path="/category/sale" element={<BigSale />} />
        <Route path="/collection/streetwear" element={<StreetwearPage />} />
        <Route path="/collection/winter" element={<WinterPage />} />
        <Route path="/collection/ironpulse" element={<IronPulsePage />} />
        <Route path="/collection/hela" element={<HelaPage />} />
        <Route path="/collection/boxy" element={<BoxyPage />} />
        <Route path="/collection/flannel" element={<FlannelPage />} />
        <Route path="/collection/minimalist" element={<MinimalistPage />} />
        <Route path="/collection/urban-style" element={<UrbanStylePage />} />
        <Route path="/collection/casual-look" element={<CasualLookPage />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/WarantyPolicy" element={<WarantyPolicy />} />
        <Route path="/DeliveryPolicy" element={<DeliveryPolicy />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path='/wishlist' element={<WishlistPage />} />
        <Route path='/forgot-password' element={<ForgetPassword/>} />
        <Route path='/profile' element={<ProfilePage />} />

        </Routes>
        <Chatbot/>
      <AboutUs /> 
      <Footer/>
    </div>
  )
}

export default App

