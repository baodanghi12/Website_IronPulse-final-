import {
    DatePicker,
    Form,
    Input,
    message,
    Modal,
    Select,
    Upload,
  } from 'antd';
  import { useEffect, useState } from 'react';
  import dayjs from 'dayjs';
  import axios from 'axios';
  import uploadFile from '../utils/uploadFile';
  const AddPromotion = ({ visible, onClose, promotion, onAddNew }) => {
    const [imageUpload, setImageUpload] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    
    useEffect(() => {
      if (promotion) {
        form.setFieldsValue({
          ...promotion,
          startAt: dayjs(promotion.startAt),
          endAt: dayjs(promotion.endAt),
        });
  
        if (promotion.imageURL) {
          setImageUpload([
            { uid: '-1', url: promotion.imageURL, status: 'done' },
          ]);
        }
      }
    }, [promotion]);
  
    const handleClose = () => {
      form.resetFields();
      setImageUpload([]);
      onClose();
    };
  
    const handleChange = ({ fileList: newFileList }) => {
      const items = newFileList.map((item) =>
        item.originFileObj
          ? {
              ...item,
              url: URL.createObjectURL(item.originFileObj),
              status: 'done',
            }
          : item
      );
      setImageUpload(items);
    };
  
    const handleAddNewPromotion = async (values) => {
      if (imageUpload.length === 0) {
        message.error('Please upload one image');
        return;
      }
  
      const start = values.startAt;
      const end = values.endAt;
  
      if (new Date(end).getTime() < new Date(start).getTime()) {
        message.error('Thời gian kết thúc phải lớn hơn thời gian bắt đầu');
        return;
      }
  
      const data = { ...values };
      data.startAt = new Date(start);
      data.endAt = new Date(end);
  
      if (imageUpload[0]?.originFileObj) {
        const imageURL = await uploadFile(imageUpload[0].originFileObj);
        data.imageURL = imageURL;
      }
  
      
      setIsLoading(true);
  
      try {
        const api = promotion
        ? `/api/promotions/${promotion._id}`
        : `/api/promotions`;
        const res = await axios({
          method: promotion ? 'put' : 'post',
          url: api,
          data,
        });
  
        onAddNew(res.data);
        handleClose();
      } catch (error) {
        console.error('Failed to add/update promotion:', error);
        message.error('Đã có lỗi xảy ra!');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Modal
        title='Add new promotion/discount'
        open={visible}
        onCancel={handleClose}
        onOk={() => form.submit()}
        okButtonProps={{ loading: isLoading }}
        cancelButtonProps={{ loading: isLoading }}
      >
        <Upload
        accept='image/*'
        fileList={imageUpload}
        listType='picture-card'
        className='mb-3'
        onChange={handleChange}
        customRequest={({ file, onSuccess }) => {
          // chỉ xử lý preview, không upload thật
          setTimeout(() => {
            onSuccess("ok"); // Đánh dấu là upload xong
          }, 0);
        }}
        >
          {imageUpload.length === 0 ? 'Upload' : null}
        </Upload>
  
        <Form
          form={form}
          disabled={isLoading}
          size='large'
          onFinish={handleAddNewPromotion}
          layout='vertical'
        >
          <Form.Item
            name='title'
            label='Title'
            rules={[{ required: true, message: 'Please enter promotion' }]}
          >
            <Input placeholder='Title' allowClear />
          </Form.Item>
  
          <Form.Item name='description' label='Description'>
            <Input.TextArea rows={4} placeholder='Description' allowClear />
          </Form.Item>
  
          <div className='row'>
            <div className='col'>
              <Form.Item name='code' label='CODE' rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </div>
            <div className='col'>
              <Form.Item name='value' label='Value' rules={[{ required: true }]}>
                <Input type='number' />
              </Form.Item>
            </div>
          </div>
  
          <div className='row'>
            <div className='col'>
              <Form.Item name='numOfAvailable' label='Num of value'>
                <Input type='number' />
              </Form.Item>
            </div>
            <div className='col'>
              <Form.Item name='type' label='Type' initialValue='amount'>
                <Select
                  options={[
                    { label: 'Amount', value: 'amount' },
                    { label: 'Percent', value: 'percent' },
                  ]}
                />
              </Form.Item>
            </div>
          </div>
  
          <div className='row'>
            <div className='col'>
              <Form.Item name='startAt' label='Start'>
                <DatePicker showTime format='DD/MM/YYYY HH:mm:ss' />
              </Form.Item>
            </div>
            <div className='col'>
              <Form.Item name='endAt' label='End'>
                <DatePicker showTime format='DD/MM/YYYY HH:mm:ss' />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    );
  };
  
  export default AddPromotion;