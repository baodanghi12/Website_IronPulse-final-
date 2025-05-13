import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ role }) => {
    
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/home">
                <img className='w-5 h-5' src={assets.order_icon} alt="" />
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>

            {/* Ẩn hoàn toàn nút Add Items khi role là "staff" */}
        {role !== 'staff' && (
          <NavLink
            className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1"
            to="/add"
          >
            <img className="w-5 h-5" src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Items</p>
          </NavLink>
        )}

            

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/list">
                <img className='w-5 h-5' src={assets.list_items} alt="" />
                <p className='hidden md:block'>List Items</p>
            </NavLink>

            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/orders">
                <img className='w-5 h-5' src={assets.orders} alt="" />
                <p className='hidden md:block'>Orders</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/revenue">
                <img className='w-5 h-5' src={assets.statistics} alt="" />
                <p className='hidden md:block'>Revenue</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/importProduct">
                <img className='w-5 h-5' src={assets.receipt} alt="" />
                <p className='hidden md:block'>Import Product</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/promotions">
                <img className='w-5 h-5' src={assets.promotion} alt="" />
                <p className='hidden md:block'>Promotions</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/bills">
                <img className='w-5 h-5' src={assets.billManagement} alt="" />
                <p className='hidden md:block'>Bills</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1' to="/usermanagement">
                <img className='w-5 h-5' src={assets.usermanagement} alt="" />
                <p className='hidden md:block'>User Management</p>
            </NavLink>

        </div>
    </div>
  )
}

export default Sidebar
