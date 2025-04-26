/** @format */

import { useEffect, useState } from 'react';
import { Avatar, Button, Modal, Space, Table } from 'antd';
import AddPromotion from '../modal/AddPromotion';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;

const PromotionScreen = ({ role }) => {  // Accept role prop from App.jsx
	const [isVisibleModalAddPromotion, setIsVisibleModalAddPromotion] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [promotions, setPromotions] = useState([]);
	const [promotionSelected, setPromotionSelected] = useState(null);
	useEffect(() => {
		getPromotions(); // Load data when entering the screen
	}, []);
	
	const getPromotions = async () => {
		setIsLoading(true);
		try {
			// Call API to fetch promotions here
			// Example:
			const res = await axios.get('/api/promotions');
			console.log('Promotions from API:', res.data);
			setPromotions(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemovePromotion = async (id) => {
		console.log('Trying to delete promotion:', id);
		try {
		  const res = await axios.delete(`/api/promotions/${id}`);
		  console.log('Delete successful:', res.data); // Log dữ liệu phản hồi từ backend
		  await getPromotions(); // Tải lại danh sách sau khi xóa
		} catch (err) {
		  console.error('Delete failed:', err.response?.data || err.message);
		  alert(`Xóa khuyến mãi thất bại: ${err.response?.data?.message || err.message}`);
		}
	  };
	  
	
	  
	  

	const columns = [
		{
			key: 'image',
			dataIndex: 'imageURL',
			title: 'Image',
			render: (img) => <Avatar src={img} size={50} />,
		},
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
			key: 'btn',
			dataIndex: '',
			align: 'right',
			fixed: 'right',
			render: (item) => (
				<Space>
				  <Button
					onClick={() => {
					  console.log('Editing promotion:', item); // ✅ debug
					  setPromotionSelected(item);
					  setIsVisibleModalAddPromotion(true);
					}}
					type='text'
					icon={<EditOutlined style={{ color: '#1677ff' }} />}
				  />
			  
				  <Button
					onClick={() => {
					  console.log('Trying to delete promotion:', item); // ✅ debug
					  if (!item?._id) {
						console.error('ID is missing in item:', item);
						return;
					  }
			  
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
			{/* Hiển thị nút "Add Promotion" chỉ khi role là admin */}
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

		  <Table loading={isLoading} columns={columns} dataSource={promotions} rowKey='_id' />

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
