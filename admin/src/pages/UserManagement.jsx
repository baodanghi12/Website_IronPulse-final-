import { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Avatar,
  Modal,
  message,
  Form,
  Tabs,
  Select,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const UserManagement = ({ role }) => {
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // view | edit | create
  const [userOrders, setUserOrders] = useState([]);
  const [userWishlist, setUserWishlist] = useState([]);
  const [activeDetailTab, setActiveDetailTab] = useState("1");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsersAndStaff();
  }, []);

  const fetchUsersAndStaff = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/user');
      setUsers(res.data?.users.filter(user => user.role === 'user') || []);
      setStaff(res.data?.users.filter(user => user.role === 'staff') || []);
    } catch (err) {
      console.error(err);
      message.error('Error loading user list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = async (user) => {
    setEditingUser(user);
    setActiveDetailTab("1");
    setModalMode('view');
  
    const updatedUser = {
      ...user,
      dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth).format('YYYY-MM-DD') : null,
    };
    form.setFieldsValue(updatedUser);
    setIsModalVisible(true);
  
    if (user.role === 'user') {
      const userId = user._id;
      try {
        const [ordersRes, wishlistRes] = await Promise.all([
          axios.get(`/api/order/user/${userId}`),
          axios.get(`/api/user/${userId}/wishlist`)
        ]);
  
        console.log('✅ Wishlist API response:', wishlistRes.data.wishlist); // ✅ Đặt đúng chỗ
  
        setUserOrders(ordersRes.data.orders || []);
        setUserWishlist(wishlistRes.data.wishlist || []);
      } catch (err) {
        message.error('Error loading order history or wishlist');
      }
    } else {
      setUserOrders([]);
      setUserWishlist([]);
    }
  };
  

  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ role: 'user', isBlocked: false, dateOfBirth: null });
    setModalMode('create');
    setIsModalVisible(true);
  };

  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();
      if (modalMode === 'edit') {
        await axios.put(`/api/user/${editingUser._id}`, values);
        message.success('User updated successfully');
      } else if (modalMode === 'create') {
        await axios.post(`/api/user`, values);
        message.success('User created successfully');
      }
      setIsModalVisible(false);
      fetchUsersAndStaff();
    } catch (err) {
      message.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleBlockToggle = async (user) => {
    try {
      await axios.patch(`/api/user/block/${user._id}`, {
        isBlocked: !user.isBlocked,
      });
      message.success(`${user.isBlocked ? 'Unblocked' : 'Blocked'} successfully`);
      fetchUsersAndStaff();
    } catch (err) {
      message.error('Cannot update user status');
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      await axios.delete(`/api/user/${user._id}`);
      message.success('User deleted');
      fetchUsersAndStaff();
    } catch (err) {
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (avatar, user) => (
        <Avatar
          src={avatar || '/default-avatar.png'}
          onClick={(e) => {
            e.stopPropagation();
            handleViewUser(user);
          }}
          style={{ cursor: 'pointer' }}
        />
      ),
    },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (role) => <Tag color={role === 'admin' ? 'volcano' : 'blue'}>{role}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'isBlocked',
      render: (isBlocked) =>
        isBlocked ? <Tag color="red">Locked</Tag> : <Tag color="green">Active</Tag>,
    },
    {
      title: 'Action',
      render: (user) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleViewUser(user)} />
          <Button
            icon={user.isBlocked ? <CheckCircleOutlined /> : <StopOutlined />}
            onClick={() => handleBlockToggle(user)}
          />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteUser(user)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <Space className="mb-3">
        <Input
          placeholder="Search by name or email"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear
        />
        <Button type="primary" onClick={handleCreateUser}>
          Create New User
        </Button>
      </Space>

      <Tabs defaultActiveKey="1" items={[
        {
          key: "1",
          label: "Users",
          children: (
            <Table
              loading={isLoading}
              dataSource={users.filter((user) =>
                user.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchValue.toLowerCase())
              )}
              columns={columns}
              rowKey="_id"
              scroll={{ x: true }}
            />
          ),
        },
        ...(role === 'admin' ? [{
          key: "2",
          label: "Staff",
          children: (
            <Table
              loading={isLoading}
              dataSource={staff.filter((user) =>
                user.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchValue.toLowerCase())
              )}
              columns={columns}
              rowKey="_id"
              scroll={{ x: true }}
            />
          ),
        }] : []),
      ]} />

      <Modal
        open={isModalVisible}
        title={modalMode === 'create' ? 'Create New User' : modalMode === 'edit' ? 'Edit User' : 'User Details'}
        onCancel={() => {
          setIsModalVisible(false);
          setModalMode('view');
        }}
        footer={
          modalMode === 'view'
            ? [<Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>]
            : [
                <Button key="cancel" onClick={() => setIsModalVisible(false)}>Cancel</Button>,
                <Button key="save" type="primary" onClick={handleSaveUser}>Save</Button>,
              ]
        }
        width={800}
      >
        <Tabs
          activeKey={activeDetailTab}
          onChange={setActiveDetailTab}
          items={[
            {
              key: '1',
              label: 'User Details',
              children: (
                <Form layout="vertical" form={form}>
                  <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="Phone" name="phone">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Date of Birth" name="dateOfBirth">
                    <Input type="date" />
                  </Form.Item>
                  <Form.Item label="Password" name="password">
                    <Input.Password />
                  </Form.Item>
                  <Form.Item label="Role" name="role" initialValue="user">
                    {role === 'staff' ? (
                      <Input value="user" disabled />
                    ) : (
                      <Select>
                        <Select.Option value="user">User</Select.Option>
                        <Select.Option value="staff">Staff</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="Status">
                    <Input disabled value={form.getFieldValue('isBlocked') ? 'Locked' : 'Active'} />
                  </Form.Item>
                </Form>
              ),
            },
            ...(editingUser?.role === 'user'
              ? [
                  {
                    key: '2',
                    label: 'Order History',
                    children: (
                      <Table
  dataSource={userOrders}
  columns={[
    {
      title: 'Order ID',
      dataIndex: '_id',
      render: (id) => (
        <span
          style={{
            backgroundColor: '#e6f7ff',
            padding: '2px 8px',
            borderRadius: '5px',
            color: '#1890ff',
            fontWeight: 500,
          }}
        >
          #{id.slice(-6)}
        </span>
      ),
    },
    {
      title: 'Total',
      render: (order) =>
        typeof order.amount === 'number'
          ? order.amount.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })
          : 'N/A',
    },
    
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        const colorClass =
          status === 'Delivered'
            ? 'bg-green-500'
            : status === 'Shipped'
            ? 'bg-blue-500'
            : status === 'Packing'
            ? 'bg-yellow-500'
            : status === 'Out for delivery'
            ? 'bg-orange-500'
            : 'bg-gray-500';
        return (
          <span
            className={`${colorClass} text-white px-2 py-1 rounded text-sm`}
            style={{ display: 'inline-block' }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (value) => moment(value).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Delivered At',
      dataIndex: 'updatedAt',
      render: (value, record) =>
        record.status === 'Delivered'
          ? moment(value).format('YYYY-MM-DD HH:mm')
          : '—',
    },
  ]}
  rowKey="_id"
  pagination={false}
/>
                    ),
                  },
                  {
                    key: '3',
                    label: 'Wishlist',
                    children: (
                      <Table
  dataSource={userWishlist}
  columns={[
    {
      title: 'Product ID',
      dataIndex: '_id',
      render: (id) => (
        <span
          style={{
            backgroundColor: '#f0fdf4',
            padding: '2px 8px',
            borderRadius: '5px',
            color: '#10b981',
            fontWeight: 500,
          }}
        >
          #{id?.slice(-6)}
        </span>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'title', // hoặc 'name' nếu title không tồn tại
      render: (title, record) => title || record.name || 'N/A',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (cat) => cat || '—',
    },
    {
      title: 'Sub Category',
      dataIndex: 'subCategory',
      render: (sub) => sub || '—',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) =>
        typeof price === 'number'
          ? price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
          : 'N/A',
    },
  ]}
  rowKey="_id"
  pagination={false}
/>

                    ),
                  },
                ]
              : []),
          ]}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;
