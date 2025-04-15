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
  Select,
  DatePicker,
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
const { TabPane } = Tabs;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // view | edit | create
  const [userOrders, setUserOrders] = useState([]);
  const [form] = Form.useForm();
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/user');
      setUsers(res.data?.users || []);
    } catch (err) {
      console.error(err);
      message.error('Error loading user list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = async (user) => {
  setEditingUser(user);
  setModalMode('view');
  
  // Đảm bảo dateOfBirth được định dạng đúng trong trường hợp này
  const updatedUser = {
    ...user,
    dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth).format('YYYY-MM-DD') : null,
  };
  
  form.setFieldsValue(updatedUser);  // Cập nhật lại giá trị của form với dữ liệu đã định dạng
  setIsModalVisible(true);

  const userId = user._id;

  try {
    const res = await axios.get(`/api/order/user/${userId}`);
    console.log("Response from API:", res.data);
    setUserOrders(res.data.orders || []);
  } catch (err) {
    console.error("Error fetching orders:", err);
    message.error('Error loading order history');
  }
};
  
  
  
  

  const handleEditUser = (user) => {
    setEditingUser(user);
    const updatedUser = {
      ...user,
      // Chuyển đổi ngày tháng sang định dạng "yyyy-MM-dd"
      dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth).format('YYYY-MM-DD') : null, 
    };
    form.setFieldsValue(updatedUser);  // Chỉ cần gọi một lần
    setModalMode('edit');
    setIsModalVisible(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ role: 'user', isBlocked: false, dateOfBirth: null, });
    setModalMode('create');
    setIsModalVisible(true);
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
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || 'Operation failed');
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
            e.stopPropagation(); // Ngăn event lan ra hàng
            handleViewUser(user); // Hiển thị modal khi click avatar
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

  const filteredUsers = users
  .filter((user) => user.role === 'user') // Lọc chỉ lấy user có role là 'user'
  .filter(
    (user) =>
      user.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const renderFormFields = () => {
    const isView = modalMode === 'view';
    return (
      <>
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input disabled={isView} />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input disabled={isView} />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input disabled={isView} />
        </Form.Item>
        <Form.Item label="Date of Birth" name="dateOfBirth">
          <Input type="date" disabled={isView} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: modalMode === 'create', message: 'Password is required' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password disabled={isView} />
        </Form.Item>
        <Form.Item label="Role" name="role">
        <Select disabled={isView}>
          <Select.Option value="user">User</Select.Option>
          {/* Ẩn tùy chọn Admin nếu không muốn cho phép tạo user admin */}
          {/* <Select.Option value="admin">Admin</Select.Option> */}
        </Select>
        
      </Form.Item>
        <Form.Item label="Status">
          <Input disabled value={form.getFieldValue('isBlocked') ? 'Locked' : 'Active'} />
        </Form.Item>
      </>
    );
  };

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

      <Table
        loading={isLoading}
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
        
      />

      <Modal
        open={isModalVisible}
        title={
          modalMode === 'create'
            ? 'Create New User'
            : modalMode === 'edit'
            ? 'Edit User'
            : 'User Details'
        }
        onCancel={() => {
          setIsModalVisible(false);
          setModalMode('view');
        }}
        footer={
          modalMode === 'view'
            ? [<Button onClick={() => setIsModalVisible(false)}>Close</Button>]
            : [
                <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>,
                <Button type="primary" onClick={handleSaveUser}>
                  Save
                </Button>,
              ]
        }
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="User Info" key="1">
            <Form layout="vertical" form={form}>
              {renderFormFields()}
            </Form>
          </TabPane>

          {modalMode === 'view' && (
           <TabPane tab="Order History" key="2">
           <Table
             columns={[
               {
                 title: 'Order ID',
                 dataIndex: '_id',
                 render: (id) => <Tag color="blue">{id.slice(-6).toUpperCase()}</Tag>, // rút gọn ID cho gọn
               },
               {
                 title: 'Date',
                 dataIndex: 'date',
                 render: (d) =>
                   d ? new Date(Number(d)).toLocaleString() : 'N/A',
               },
               {
                 title: 'Status',
                 dataIndex: 'status',
                 render: (status) => {
                   let color = 'blue';
                   if (status === 'Delivered') color = 'green';
                   else if (status === 'Pending') color = 'orange';
                   else if (status === 'Canceled') color = 'red';
                   return <Tag color={color}>{status}</Tag>;
                 },
               },
               {
                 title: 'Payment',
                 dataIndex: 'payment',
                 render: (paid) =>
                   paid ? (
                     <Tag color="green">Paid</Tag>
                   ) : (
                     <Tag color="red">Unpaid</Tag>
                   ),
               },
               {
                 title: 'Method',
                 dataIndex: 'paymentMethod',
                 render: (method) =>
                   method === 'COD' ? 'Cash on Delivery' : 'Online Payment',
               },
               {
                 title: 'Amount',
                 dataIndex: 'amount',
                 render: (amount) =>
                   amount?.toLocaleString('vi-VN', {
                     style: 'currency',
                     currency: 'VND',
                   }) || '0₫',
               },
               {
                 title: 'Items',
                 dataIndex: 'items',
                 render: (items) =>
                   items.map((item, idx) => (
                     <div key={idx}>
                       {item.name} x{item.quantity}
                     </div>
                   )),
               },
             ]}
             dataSource={userOrders}
             rowKey="_id"
             pagination={false}
             scroll={{ x: 'max-content' }} 
           />
         </TabPane>
          
          
          )}
        </Tabs>
      </Modal>
    </div>
  );
};

export default UserManagement;
