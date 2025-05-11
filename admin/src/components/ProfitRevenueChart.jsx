import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, Spin } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

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

const ProfitRevenueChart = ({ range = 'monthly', date = dayjs() }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const convertRangeToType = (range) => {
    switch (range) {
      case 'day':
      case 'week':
        return 'weekly';
      case 'month':
        return 'monthly';
      case 'quarter':
      case 'year':
        return 'yearly';
      default:
        return 'monthly';
    }
  };

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/statistics/chart', {
  params: {
    type: convertRangeToType(range),
    date: dayjs(date).format('YYYY-MM-DD'),
  },
});

      const { labels = [], sales = [], profits = [] } = res.data || {};

if (!labels.length || !sales.length || !profits.length) {
  setChartData([]); // hoặc set thông báo không có dữ liệu
  return;
}

const mergedData = labels.map((label, idx) => ({
  label,
  revenue: sales[idx] || 0,
  profit: profits[idx] || 0,
}));

setChartData(mergedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [range, date]);

  return (
  <Card
    title={
      <div>
        <div style={{ fontSize: '1rem', fontWeight: '600' }}>Profit & Revenue</div>
        {chartData?.dateRange && (
          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '2px' }}>
            Thống kê từ <strong>{chartData.dateRange.start}</strong> đến <strong>{chartData.dateRange.end}</strong>
          </div>
        )}
      </div>
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
