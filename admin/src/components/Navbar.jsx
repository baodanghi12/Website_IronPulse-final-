import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { BellOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Menu, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setToken }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // polling every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/notifications');
      console.log(res.data);
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, link) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      fetchNotifications();
      navigate(link);
    } catch (err) {
      console.error(err);
    }
  };

  const notificationMenu = (
    <Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
      {loading ? (
        <div className="text-center p-2">
          <Spin size="small" />
        </div>
      ) : notifications.length > 0 ? (
        notifications.map((notif) => (
          <Menu.Item
            key={notif._id}
            onClick={() => markAsRead(notif._id, notif.link)}
            style={{ fontWeight: notif.isRead ? 'normal' : 'bold' }}
          >
            {notif.title}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item disabled>Không có thông báo</Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img className='w-[max(15%,80px)]' src={assets.estd_2025} alt='' />
      <div className='flex items-center gap-4'>
        <Dropdown overlay={notificationMenu} trigger={['click']} placement='bottomRight'>
          <Badge count={unreadCount} overflowCount={99}>
            <BellOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
          </Badge>
        </Dropdown>
        <button
          onClick={() => setToken('')}
          className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;