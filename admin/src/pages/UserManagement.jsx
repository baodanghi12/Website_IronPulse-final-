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

const UserManagement = ({ role }) => {
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // view | edit | create
  const [userOrders, setUserOrders] = useState([]);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState(null);
  

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
    setModalMode('view');
    const updatedUser = {
      ...user,
      dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth).format('YYYY-MM-DD') : null,
    };
    form.setFieldsValue(updatedUser);
    setIsModalVisible(true);

    const userId = user._id;

    try {
      const res = await axios.get(`/api/order/user/${userId}`);
      setUserOrders(res.data.orders || []);
    } catch (err) {
      message.error('Error loading order history');
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

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (avatar, user) => (
        <Avatar
          src={avatar || '/default-avatar.png'}
          onClick={(e) => {
            e.stopPropagation(); // Prevent event propagation
            handleViewUser(user); // Open modal when clicking avatar
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

  const handleBlockToggle = async (user) => {
    try {
      await axios.put(`/api/user/${user._id}/block`, {
        isBlocked: !user.isBlocked,
      });
      message.success(`${user.isBlocked ? 'Unblocked' : 'Blocked'} successfully`);
      fetchUsersAndStaff();
    } catch (err) {
      message.error('Cannot update user status');
    }
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

      <Tabs defaultActiveKey="1">
        <TabPane tab="Users" key="1">
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
        </TabPane>

        {/* Conditionally render the "Staff" tab based on role */}
        {role === 'admin' && (
  <TabPane tab="Staff" key="2">
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
  </TabPane>
)}
      </Tabs>

      <Modal
        open={isModalVisible}
        title={modalMode === 'create' ? 'Create New User' : modalMode === 'edit' ? 'Edit User' : 'User Details'}
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
    <Input value="user" disabled />  // Nếu là Staff, chỉ có thể chọn User và không thể thay đổi
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
      </Modal>
    </div>
  );
};

export default UserManagement;
