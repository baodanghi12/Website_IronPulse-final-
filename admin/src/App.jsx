import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from "./pages/HomeScreen";
import ReportScreen from "./pages/ReportScreen"; // Giữ một lần import duy nhất
import Actions from "./pages/Actions";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { BillsScreen } from "./pages";
import PromotionScreen from "./pages/PromotionScreen";
import UserManagement from "./pages/UserManagement";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);
// eslint-disable-next-line react-refresh/only-export-components
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '$'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(()=>{
    localStorage.setItem("token", token);
  },[token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? 
        <Login setToken={setToken} />
       : 
        <>
        <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
            <Routes>
            <Route path="/home" element={<HomeScreen token={token}/>} />
              <Route path="/add" element={<Add token={token}/>} />
              <Route path="/list" element={<List token={token} />} />
              <Route path="/orders" element={<Orders token={token}/>} />
              <Route path="/revenue" element={<ReportScreen token={token}/>} />
              <Route path="/index" element={<BillsScreen token={token}/>} />
              <Route path="/promotions" element={<PromotionScreen token={token}/>} />
              <Route path="/actions" element={<Actions token={token}/>} />
              <Route path="/usermanagement" element={<UserManagement token={token}/>} />
            </Routes>
          </div>
          </div>
        </>
      }
    </div>
  );
};

export default App;
