import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Card, Select } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { Table } from 'antd';

const { Option } = Select;

// Dummy Data
const weeklyData = [
    { day: 'Mon', revenue: 4000, profit: 2000 },
    { day: 'Tue', revenue: 5200, profit: 2500 },
    { day: 'Wed', revenue: 6100, profit: 3000 },
    { day: 'Thu', revenue: 7000, profit: 3500 },
    { day: 'Fri', revenue: 8000, profit: 4000 },
    { day: 'Sat', revenue: 7500, profit: 4200 },
    { day: 'Sun', revenue: 6800, profit: 3900 },
  ];
  

const monthlyData = [
  { month: 'Sep', revenue: 20000, profit: 30000 },
  { month: 'Oct', revenue: 40000, profit: 35000 },
  { month: 'Nov', revenue: 60000, profit: 42000 },
  { month: 'Dec', revenue: 75000, profit: 46000 },
  { month: 'Jan', revenue: 68000, profit: 44000 },
  { month: 'Feb', revenue: 62000, profit: 41000 },
  { month: 'Mar', revenue: 45000, profit: 39000 },
];

const yearlyData = [
  { year: '2021', revenue: 400000, profit: 230000 },
  { year: '2022', revenue: 520000, profit: 310000 },
  { year: '2023', revenue: 680000, profit: 400000 },
  { year: '2024', revenue: 720000, profit: 450000 },
];

const formatCurrency = (value) => value.toLocaleString();

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const revenue = payload.find((p) => p.dataKey === 'revenue')?.value;
    return (
      <div
        style={{
          background: '#fff',
          padding: '10px 15px',
          borderRadius: 8,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ fontSize: 12, color: '#999' }}>Sales</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>
          {formatCurrency(revenue)}
        </div>
        <div style={{ fontSize: 12, color: '#ccc' }}>{label}</div>
      </div>
    );
  }
  return null;
};

const ProfitRevenueChart = () => {
  const [timeRange, setTimeRange] = useState('weekly');

  const handleChange = (value) => setTimeRange(value);

  let data = [];
  let xKey = '';

  switch (timeRange) {
    case 'monthly':
      data = monthlyData;
      xKey = 'month';
      break;
    case 'yearly':
      data = yearlyData;
      xKey = 'year';
      break;
      case 'weekly':
        default:
          data = weeklyData;
          xKey = 'day';
          break;
        
  }

  return (
    <Card
      title="Profit & Revenue"
      extra={
        <Select
          defaultValue="weekly"
          onChange={handleChange}
          style={{ width: 120 }}
          suffixIcon={<CalendarOutlined />}
        >
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
          <Option value="yearly">Yearly</Option>
        </Select>
      }
      style={{ marginTop: '2rem' }}
    >
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey={xKey} />
            <YAxis tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2f80ed"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#f5c26b"
              strokeWidth={2}
              dot={false}
              name="Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
const bestSellingProducts = [
    {
      key: '1',
      name: 'Tomato',
      productId: '23567',
      category: 'Vegetable',
      quantity: '225 kg',
      turnover: 170000,
    },
    {
      key: '2',
      name: 'Beef',
      productId: '87213',
      category: 'Meat',
      quantity: '150 kg',
      turnover: 220000,
    },
    {
      key: '3',
      name: 'Milk',
      productId: '99182',
      category: 'Dairy',
      quantity: '300 bottles',
      turnover: 195000,
    },
    {
      key: '4',
      name: 'Apple',
      productId: '33121',
      category: 'Fruit',
      quantity: '500 kg',
      turnover: 310000,
    },
  ];
  
  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Turnover',
      dataIndex: 'turnover',
      key: 'turnover',
      render: (value) => VND.format(value),
    },
  ];
  
  <Table
  dataSource={bestSellingProducts}
  columns={columns}
  pagination={false}
  style={{ marginTop: '2rem' }}
  title={() => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 600,
      }}
    >
      <span>Best selling product</span>
      <a href="#">See All</a>
    </div>
  )}
/>

  

export default ProfitRevenueChart;
