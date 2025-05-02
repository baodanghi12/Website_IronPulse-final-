/** @format */

import { useEffect, useState } from 'react';
import { Button, Modal, Space, Table, Tag } from 'antd';
import AddPromotion from '../modal/AddPromotion';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;

const PromotionScreen = ({ role }) => {
  const [isVisibleModalAddPromotion, setIsVisibleModalAddPromotion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [promotionSelected, setPromotionSelected] = useState(null);

  useEffect(() => {
    getPromotions();
  }, []);

  const getPromotions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/promotions');
      setPromotions(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePromotion = async (id) => {
    try {
      const res = await axios.delete(`/api/promotions/${id}`);
      await getPromotions();
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
      alert(`Xóa khuyến mãi thất bại: ${err.response?.data?.message || err.message}`);
    }
  };

  const columns = [
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Title',
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Description',
    },
    {
      key: 'code',
      dataIndex: 'code',
      title: 'Code',
    },
    {
      key: 'available',
      dataIndex: 'numOfAvailable',
      title: 'Available',
    },
    {
      key: 'value',
      dataIndex: 'value',
      title: 'Value',
    },
    {
      key: 'type',
      dataIndex: 'type',
      title: 'Type',
    },
    {
      key: 'startDate',
      dataIndex: 'startDate',
      title: 'Start Date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      key: 'endDate',
      dataIndex: 'endDate',
      title: 'End Date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      key: 'isActive',
      dataIndex: 'isActive',
      title: 'Status',
      render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      key: 'btn',
      dataIndex: '',
      align: 'right',
      fixed: 'right',
      render: (item) => (
        <Space>
          <Button
            onClick={() => {
              setPromotionSelected(item);
              setIsVisibleModalAddPromotion(true);
            }}
            type='text'
            icon={<EditOutlined style={{ color: '#1677ff' }} />}
          />

          <Button
            onClick={() => {
              if (!item?._id) return;
              Modal.confirm({
                title: 'Xác nhận',
                content: `Bạn có chắc muốn xóa khuyến mãi "${item.title}"?`,
                okText: 'Xóa',
                cancelText: 'Hủy',
                okButtonProps: { danger: true },
                onOk: async () => {
                  await handleRemovePromotion(item._id);
                },
              });
            }}
            type='text'
            icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className='container py-4'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        {role === 'admin' && (
          <Button
            type='primary'
            onClick={() => {
              setPromotionSelected(null);
              setIsVisibleModalAddPromotion(true);
            }}
          >
            Add Promotion
          </Button>
        )}
      </div>

      <Table loading={isLoading} columns={columns} dataSource={promotions} rowKey='_id' scroll={{ x: true }} />

      <AddPromotion
        promotion={promotionSelected}
        onAddNew={async () => await getPromotions()}
        visible={isVisibleModalAddPromotion}
        onClose={() => setIsVisibleModalAddPromotion(false)}
      />
    </div>
  );
};

export default PromotionScreen;
