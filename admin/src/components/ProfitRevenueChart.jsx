import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, Select, Spin } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const formatCurrency = (value) => value.toLocaleString();

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const revenue = payload.find((p) => p.dataKey === 'revenue')?.value;
    const profit = payload.find((p) => p.dataKey === 'profit')?.value;
    return (
      <div style={{ background: '#fff', padding: '10px', borderRadius: 8, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: 12, color: '#999' }}>Sales</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>{formatCurrency(revenue)}</div>
        <div style={{ fontSize: 12, color: profit < 0 ? 'red' : '#666' }}>
          Profit: {formatCurrency(profit)}
        </div>

        <div style={{ fontSize: 12, color: '#ccc' }}>{label}</div>
      </div>
    )
  }
  return null;
};

const ProfitRevenueChart = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChartData = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/statistics/orders?type=${type}`);
      const { labels, sales, profits } = res.data;

      const mergedData = labels.map((label, idx) => ({
        label,
        revenue: sales[idx],
        profit: profits[idx],
      }));

      setChartData(mergedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData(timeRange);
  }, [timeRange]);

  return (
    <Card
      title="Profit & Revenue"
      extra={
        <Select
          value={timeRange}
          onChange={(value) => setTimeRange(value)}
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
      {loading ? (
        <Spin />
      ) : (
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#2f80ed" strokeWidth={3} dot={{ r: 4 }} name="Revenue" />
              <Line type="monotone" dataKey="profit" stroke="#f5c26b" strokeWidth={2} dot={false} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default ProfitRevenueChart;
