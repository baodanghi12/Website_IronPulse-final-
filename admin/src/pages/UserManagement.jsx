/** @format */
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
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/user');
      if (res.data && res.data.users) {
        setUsers(res.data.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      message.error('Error loading user list');
    } finally {
      setIsLoading(false);
    }
  };
  const [userOrders, setUserOrders] = useState([]);

  const handleViewUser = async (user) => {
    setEditingUser(user);
    setIsViewMode(true);
    form.setFieldsValue(user);
    setIsEditModalVisible(true);
  
    try {
      const token = localStorage.getItem("token"); // Hoặc lấy token từ sessionStorage nếu bạn lưu ở đó
      const res = await axios.get(`/api/order/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);  // Kiểm tra phản hồi từ server
      setUserOrders(res.data.orders || []);
      console.log(userOrders);  // Kiểm tra giá trị của userOrders
    } catch (error) {
      console.error(error);
      message.error("Không thể lấy lịch sử đơn hàng");
    }
  };
  

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user); // Điền thông tin user vào form nếu có Modal Form
    setIsEditModalVisible(true);
  };

  const handleBlockToggle = async (user) => {
    try {
      await axios.put(`/api/user/${user._id}/block`, {
        isBlocked: !user.isBlocked,
      });
      message.success(`${user.isBlocked ? 'Unblocked' : 'Blocked'} successfully`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error('Cannot update user status');
    }
  };

  const handleDeleteUser = async (user) => {
    Modal.confirm({
      title: 'Confirm delete',
      content: `Are you sure you want to delete "${user.name}"?`,
      okText: 'Delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await axios.delete(`/api/user/${user._id}`);
          message.success('Deleted successfully');
          fetchUsers();
        } catch (err) {
          console.error(err);
          message.error('Error deleting user');
        }
      },
    });

  };

  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
  
      // Optional: kiểm tra xem có cần chỉnh sửa gì không
      if (!editingUser || !editingUser._id) {
        message.error('No user selected for update');
        return;
      }
  
      await axios.put(`/api/user/${editingUser._id}`, {
        name: values.name,
        email: values.email,
        role: values.role,
        avatar: values.avatar,
        isBlocked: values.isBlocked,
        phone : values.phone,
      });
  
      message.success('User updated successfully');
      setIsEditModalVisible(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || 'Update failed');
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (avatar) => <Avatar src={avatar || '/default-avatar.png'} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
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
      dataIndex: '',
      render: (user) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditUser(user)} />
          <Button
            icon={user.isBlocked ? <CheckCircleOutlined /> : <StopOutlined />}
            onClick={() => handleBlockToggle(user)}
          />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteUser(user)} />
        </Space>
      ),
    },
  ];

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

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
        <Button type="primary" onClick={() => {
        setEditingUser(null); // để phân biệt là tạo mới
        form.resetFields();
        setIsEditModalVisible(true);
  }}>
    Create New User
  </Button>
      </Space>

      <Table
        loading={isLoading}
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
        onRow={(record) => ({
          onClick: () => handleViewUser(record), // Mở chi tiết khi nhấn vào dòng
        })}
      />

      {/* Modal chỉnh sửa người dùng */}
      <Modal
  title="User Detail"
  open={isEditModalVisible}
  onCancel={() => {
    setIsEditModalVisible(false);
    setIsViewMode(false);
  }}
  onOk={isViewMode ? () => setIsEditModalVisible(false) : handleUpdateUser}
  okText={isViewMode ? "Close" : "Save"}
>
<Tabs defaultActiveKey="1">
  <Tabs.TabPane tab="User Info" key="1">
    <Form layout="vertical" form={form}>
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input disabled={isViewMode} />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true }]}>
        <Input disabled={isViewMode} />
      </Form.Item>
      <Form.Item label="Phone" name="phone">
        <Input disabled={isViewMode} />
      </Form.Item>
      <Form.Item label="Date of Birth" name="dateOfBirth">
        <Input type="date" disabled={isViewMode} />
      </Form.Item>
      <Form.Item label="Role" name="role">
        <Input disabled={isViewMode} />
      </Form.Item>
      <Form.Item label="Status" name="isBlocked">
        <Input
          disabled
          value={form.getFieldValue("isBlocked") ? "Locked" : "Active"}
        />
      </Form.Item>
    </Form>
  </Tabs.TabPane>

  {editingUser && (
    <Tabs.TabPane tab="Order History" key="2">
      <Table
        columns={[
          { title: 'Order ID', dataIndex: '_id' },
          {
            title: 'Date',
            dataIndex: 'date',
            render: (d) => new Date(Number(d)).toLocaleString(),
          },
          { title: 'Status', dataIndex: 'status' },
          { title: 'Payment', dataIndex: 'paymentMethod' },
          {
            title: 'Items',
            dataIndex: 'items',
            render: (items) =>
              items.map((item, index) => (
                <div key={index}>
                  {item.name} x{item.amount}
                </div>
              )),
          },
        ]}
        dataSource={userOrders}
        rowKey="_id"
        pagination={false}
      />
    </Tabs.TabPane>
  )}
</Tabs>

</Modal>

    </div>
  );
};

export default UserManagement;
