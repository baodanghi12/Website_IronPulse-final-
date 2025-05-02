import {
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Switch,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

const AddPromotion = ({ visible, onClose, promotion, onAddNew }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (promotion) {
      form.setFieldsValue({
        ...promotion,
        startDate: dayjs(promotion.startDate),
        endDate: dayjs(promotion.endDate),
      });
    }
  }, [promotion]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleAddNewPromotion = async (values) => {
    const start = values.startDate;
    const end = values.endDate;

    if (new Date(end).getTime() < new Date(start).getTime()) {
      message.error('Thời gian kết thúc phải lớn hơn thời gian bắt đầu');
      return;
    }

    const data = {
      ...values,
      startDate: new Date(start),
      endDate: new Date(end),
    };

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
      title='Add Promotion'
      open={visible}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isLoading }}
      cancelButtonProps={{ loading: isLoading }}
    >
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
          rules={[{ required: true, message: 'Please enter title' }]}
        >
          <Input placeholder='Title' />
        </Form.Item>

        <Form.Item
          name='description'
          label='Description'
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <Input.TextArea rows={3} placeholder='Description' />
        </Form.Item>

        <Form.Item
          name='code'
          label='Code'
          rules={[{ required: true, message: 'Please enter code' }]}
        >
          <Input placeholder='Discount code' />
        </Form.Item>

        <Form.Item
          name='value'
          label='Discount Value'
          rules={[{ required: true, message: 'Please enter discount value' }]}
        >
          <Input type='number' placeholder='e.g. 10 for 10%' />
        </Form.Item>

        <Form.Item
          name='type'
          label='Type'
          rules={[{ required: true }]}
          initialValue='percent'
        >
          <Select
            options={[
              { label: 'Percent', value: 'percent' },
              { label: 'Amount', value: 'amount' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name='numOfAvailable'
          label='Number of uses'
          rules={[{ required: true, message: 'Please enter number of uses' }]}
        >
          <Input type='number' />
        </Form.Item>

        <Form.Item
          name='startDate'
          label='Start Date'
          rules={[{ required: true }]}
        >
          <DatePicker showTime format='DD/MM/YYYY HH:mm:ss' />
        </Form.Item>

        <Form.Item
          name='endDate'
          label='End Date'
          rules={[{ required: true }]}
        >
          <DatePicker showTime format='DD/MM/YYYY HH:mm:ss' />
        </Form.Item>

        <Form.Item
          name='isActive'
          label='Active?'
          valuePropName='checked'
          initialValue={true}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPromotion;
