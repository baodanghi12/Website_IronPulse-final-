import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  message,
  Card,
  Tabs,
  Table,
  Select,
  Tooltip,
  Row,
  Col,
  Typography,
} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { VND } from '../utils/handleCurrency';
import ImportDetailPopup from '../components/ImportDetailPopup';

const { TabPane } = Tabs;
const { Option } = Select;

const ImportProductScreen = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [importData, setImportData] = useState([]);
  const [productList, setProductList] = useState([]); // Product list
  const [selectedProducts, setSelectedProducts] = useState([]); // Selected products and their quantities
  const [quantities, setQuantities] = useState({}); // Keep track of quantities for each selected product
  const [costs, setCosts] = useState({}); // Keep track of cost for each selected product
  const [totalCost, setTotalCost] = useState(0); // Store total cost
  const [form] = Form.useForm();
  const [selectedImport, setSelectedImport] = useState(null);
  // Load import data
  const fetchImportData = async () => {
    try {
      const result = await axios.get('/api/imports');
      setImportData(result.data.data);
    } catch (error) {
      console.error('Import API error:', error);
      alert('Unable to fetch import data. Please try again later!');
    }
  };

  // Load product list
  const fetchProductList = async () => {
    try {
      const res = await axios.get('/api/product/list');
      if (res.data.success && Array.isArray(res.data.products)) {
        const productsWithAvatars = res.data.products.map(product => ({
          ...product,
          avatar: product.avatar || './default-avatar.png',
        }));
        setProductList(productsWithAvatars);
      } else {
        message.error('Invalid product data!');
      }
    } catch (error) {
      message.error('Unable to load product list');
    }
  };

  useEffect(() => {
    fetchProductList();
    fetchImportData();
  }, []);
  
  useEffect(() => {
    let total = 0;
    selectedProducts.forEach(productId => {
      const sizeMap = quantities[productId] || {};
      const productCost = costs[productId] || 0;
  
      Object.values(sizeMap).forEach(quantity => {
        total += (Number(quantity) || 0) * Number(productCost);
      });
    });
    setTotalCost(total);
    form.setFieldsValue({ totalCost: total }); // ✅ update form field
  }, [quantities, costs, selectedProducts, form]);
  
  const onFinish = async (values) => {
    if (!values.products || values.products.length === 0) {
      message.error('Please select at least one product!');
      return;
    }
  
    let importProducts = [];
  
    values.products.forEach((productId) => {
      const cost = parseFloat(values[`cost_${productId}`]) || 0;
      if (cost <= 0) {
        message.error(`Product ${productId} has invalid cost!`);
        return;
      }
  
      const sizeMap = quantities[productId];
      if (!sizeMap || Object.keys(sizeMap).length === 0) return;
  
      const sizesArray = [];
      Object.entries(sizeMap).forEach(([size, quantity]) => {
        const qty = parseInt(quantity, 10);
        if (qty > 0) {
          sizesArray.push({ size, quantity: qty });
        }
      });
  
      if (sizesArray.length > 0) {
        importProducts.push({
          productId,
          cost,
          sizes: sizesArray,
        });
      }
    });
  
    if (importProducts.length === 0) {
      message.error('No valid product details provided!');
      return;
    }
  
    try {
      const response = await axios.post('/api/imports', {
        products: importProducts,
        totalCost: totalCost, // ✅ lấy từ state
        importDate: new Date().toISOString(),
        note: values.note || '',
      });
  
      message.success('Import record created successfully!');
      fetchImportData();  // Reload data
      setActiveTab('1'); 
    } catch (err) {
      console.error("Error creating import:", err);
      message.error('Failed to create import');
    }
  };
  
  
  
  
  

  const handleProductQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: value,
    });
  };

  const handleProductCostChange = (productId, value) => {
    setCosts({
      ...costs,
      [productId]: value,
    });
  };

  return (
    <div className="container py-4">
      <Card
        title="Import Management"
        
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Import Records" key="1">
            <Table
              dataSource={importData}
              columns={[
                {
                  title: 'Import_ID',  // Đổi tên cột thành ImportID
                  dataIndex: '_id',   // Chỉ định dữ liệu sử dụng trường _id
                  key: '_id',
                  render: (value, record) => {
                    // Kiểm tra nếu _id tồn tại và có đủ độ dài
                    const last6Digits = record._id && record._id.length >= 6
                      ? `#${record._id.slice(-6)}` 
                      : 'N/A';  // Nếu không có _id hợp lệ, trả về 'N/A'
                  
                    return (
                      <span
                        style={{
                          padding: '2px 8px',
                          border: '1px solid rgb(11, 85, 146)',  // Khung xanh
                          borderRadius: '4px',
                          color: 'rgb(11, 85, 146)', // Màu chữ xanh
                        }}
                      >
                        {last6Digits}
                      </span>
                    );
                  }
                },
                {
                  title: 'Total Quantity',
                  dataIndex: 'totalQuantity',
                  key: 'totalQuantity',
                },
                {
                  title: 'Total Cost',
                  dataIndex: 'totalCost',
                  key: 'totalCost',
                  render: (value) => (value || 0).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }),
                },
                {
                  title: 'Date',
                  dataIndex: 'importDate',
                  key: 'importDate',
                  render: (value) => value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '(unknown)',
                },
                {
                  title: 'Note',
                  dataIndex: 'note',
                  key: 'note',
                  render: (value) => value ? value : '(null)',
                },
                {
  title: 'Action',
  key: 'action',
  render: (_, record) => (
    <Button type="link" onClick={() => setSelectedImport(record)}>
      View Details
    </Button>
  ),
}
              ]}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          <TabPane tab="Create Import Record" key="2">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Select Products"
                name="products"
                rules={[{ required: true, message: 'Please select at least one product' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select products"
                  onChange={setSelectedProducts}
                  options={productList.map(item => ({
                    label: item.name,
                    value: item._id,
                  }))}
                />
              </Form.Item>

              {selectedProducts.length > 0 && (
                <>
                  <Row gutter={[16, 16]}>
                    {selectedProducts.map(productId => (
                      <Col key={productId} span={8}>
                        <Card
                          title={`Product: ${productList.find(p => p._id === productId)?.name || productId}`}
                          bordered={false}
                          style={{ marginBottom: '1rem' }}
                        >
                          {(productList.find(p => p._id === productId)?.sizes || []).map((sizeObj, index) => (
                            <Form.Item
                              key={`${productId}_size_${sizeObj}`}
                              label={`Quantity for size ${typeof sizeObj === 'string' ? sizeObj : sizeObj.size}`}
                              required
                            >
                              <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                value={
                                  quantities[productId]?.[typeof sizeObj === 'string' ? sizeObj : sizeObj.size] || 0
                                }
                                onChange={(value) => {
                                  const currentSizes = quantities[productId] || {};
                                  const sizeKey = typeof sizeObj === 'string' ? sizeObj : sizeObj.size;
                                  setQuantities({
                                    ...quantities,
                                    [productId]: {
                                      ...currentSizes,
                                      [sizeKey]: value
                                    }
                                  });
                                }}
                              />
                            </Form.Item>
                          ))}

                          <Form.Item
                            label={`Cost for ${productId}`}
                            name={`cost_${productId}`}
                            required
                          >
                            <InputNumber
                              min={0}
                              style={{ width: '100%' }}
                              value={costs[productId] || 0}
                              onChange={(value) => handleProductCostChange(productId, value)}
                              formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                            />
                          </Form.Item>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </>
              )}

              <Form.Item label="Import Date" name="importDate" initialValue={dayjs()}>
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="DD/MM/YYYY HH:mm:ss"
                  disabled
                />
              </Form.Item>
              <Form.Item label="Total Cost">
                <Typography.Text strong style={{ fontSize: '1.2rem', color: '#3f8600' }}>
                  {VND.format(totalCost)}
                </Typography.Text>
              </Form.Item>


              

              <Form.Item label="Note" name="note">
                <Input.TextArea placeholder="Add note if any" />
              </Form.Item>

              <div className="d-flex justify-content-between align-items-center">
                <Button type="primary" htmlType="submit" loading={loading}>
                  {loading ? 'Processing...' : 'Create Import Record'}
                </Button>
                
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
      <ImportDetailPopup
  importRecord={selectedImport}
  onClose={() => setSelectedImport(null)}
/>
    </div>
  );
};

export default ImportProductScreen;
