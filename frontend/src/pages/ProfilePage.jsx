import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { userInfo, token, setUserInfo, backendUrl } = useContext(ShopContext);

  const [phone, setPhone] = useState(userInfo.phone || '');
  const [address, setAddress] = useState(userInfo.shippingAddress || '');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setPhone(userInfo.phone || '');
    setAddress(userInfo.shippingAddress || '');
  }, [userInfo]);
  if (!userInfo || !userInfo.name) {
    return <p className="p-6">Bạn chưa đăng nhập.</p>;
  }

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${backendUrl}/api/user/${userInfo._id}`,
        { phone, shippingAddress: address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUserInfo(response.data.user); // cập nhật context
        toast.success('Cập nhật thành công!');
      } else {
        toast.error('Cập nhật thất bại!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi cập nhật!');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.post(`${backendUrl}/api/upload/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setUserInfo((prev) => ({
          ...prev,
          avatar: res.data.filename,
        }));
        toast.success('Cập nhật ảnh đại diện thành công!');
      } else {
        toast.error(res.data.message || 'Không thể tải ảnh');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải ảnh lên');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👤 Thông tin tài khoản</h1>
      <div className="bg-white shadow-md rounded-lg p-4 space-y-4">

        {/* Avatar section */}
        <div className="flex flex-col items-start gap-2">
          <label className="block font-semibold">Ảnh đại diện:</label>
          <img
  src={
    userInfo.avatar?.startsWith('http')
      ? userInfo.avatar
      : `${backendUrl}/${userInfo.avatar}`
  }
  alt="avatar"
  className="w-24 h-24 rounded-full object-cover"
/>
          <input type="file" accept="image/*" onChange={handleUploadAvatar} />
        </div>

        <p><strong>Tên:</strong> {userInfo.name}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Ngày tạo:</strong> {new Date(userInfo.createdAt).toLocaleString()}</p>

        <div>
          <label className="block font-semibold mb-1">Số điện thoại:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Địa chỉ giao hàng:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded px-3 py-2"
          ></textarea>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
