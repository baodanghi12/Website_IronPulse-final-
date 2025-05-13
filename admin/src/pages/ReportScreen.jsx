import React, { useEffect, useState } from 'react';
import { Card, Divider, Spin, Table, Select, DatePicker, Space } from 'antd';
import { Link } from 'react-router-dom';
import { VND } from '../utils/handleCurrency';
import ProfitRevenueChart from '../components/ProfitRevenueChart';
import ExcelExporter from '../components/ExcelExporter';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const ReportScreen = () => {
  const [rangeType, setRangeType] = useState('month'); // day, week, month, quarter, year
  const [customDate, setCustomDate] = useState(dayjs());
  const [totalProfitDatas, setTotalProfitDatas] = useState({
    bills: 0,
    orders: 0,
    revenue: 0,
    totalCost: 0,
    profitMOM: 0,
    profitYOY: 0,
  });
  const [flashSaleData, setFlashSaleData] = useState([]);
  const [bestCategories, setBestCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bestProducts, setBestProducts] = useState([]);
   const [filterMeta, setFilterMeta] = useState(null);

  const fetchDataByRange = async (range, date) => {
    setLoading(true);
    try {
      const res = await axios.get('/api/statistics/orders', {
        params: {
          range,
          date: date.toISOString(),
        },
      });

      const data = res.data;
      setTotalProfitDatas({
        bills: data.totalBills || 0,
        orders: data.totalOrders || 0,
        revenue: data.revenue || 0,
        totalCost: data.totalCost || 0,
         profitThisMonth: res.data.profitThisMonth,
  profitThisYear: res.data.profitThisYear,
      });
      setBestCategories(data.bestSellingCategories || []);
      setBestProducts(data.bestSellingProducts || []);

      // lưu meta để đưa vào Excel
      if (data.rangeType && data.dateRange) {
        setFilterMeta({
          rangeType: data.rangeType,
          dateRange: data.dateRange
        });
      }
    } catch (err) {
      console.error("Error fetching range data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFlashSaleSummary = async () => {
    try {
      const res = await axios.get('/api/statistics/flashsale-report');
      setFlashSaleData(res.data || []);
    } catch (err) {
      console.error('Error fetching flash sale summary:', err);
    }
  };

  useEffect(() => {
    fetchDataByRange(rangeType, customDate);
    getFlashSaleSummary();
  }, []);

  useEffect(() => {
    if (customDate) {
      fetchDataByRange(rangeType, customDate);
    }
  }, [rangeType, customDate]);

  const CustomStatistic = ({ title, value, tooltip }) => (
    <div style={{ textAlign: 'center' }} title={tooltip}>
      <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'gray' }}>{title}</div>
    </div>
  );

  return (
    <div style={{ padding: '1rem' }}>
      {/* Filter & Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 12 }}>
        <Space>
          <Select value={rangeType} onChange={setRangeType} style={{ width: 150 }}>
             <Option value="day">By Day</Option>
              <Option value="month">By Month</Option>
              <Option value="quarter">By Quarter</Option>
              <Option value="year">By Year</Option>
          </Select>

          {rangeType === 'day' && (
            <DatePicker value={customDate} onChange={setCustomDate} />
          )}
          {rangeType === 'month' && (
            <DatePicker picker="month" value={customDate} onChange={setCustomDate} />
          )}
          {rangeType === 'quarter' && (
            <DatePicker picker="quarter" value={customDate} onChange={setCustomDate} />
          )}
          {rangeType === 'year' && (
            <DatePicker picker="year" value={customDate} onChange={setCustomDate} />
          )}
        </Space>

         <ExcelExporter
          reportData={totalProfitDatas}
          bestCategories={bestCategories}
          bestProducts={bestProducts}
          flashSaleData={flashSaleData}
          filterMeta={filterMeta}
        />
      
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Card title="Overviews" style={{ flex: 1, minWidth: '500px' }}>
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <Spin />
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <CustomStatistic title="Profit" value={VND.format(totalProfitDatas.revenue - totalProfitDatas.totalCost)} />
                <CustomStatistic title="Revenue" value={VND.format(totalProfitDatas.revenue)} />
                <CustomStatistic title="Total Cost" value={VND.format(totalProfitDatas.totalCost)} />
              </div>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <CustomStatistic title="Total Bills" value={totalProfitDatas.bills.toLocaleString()} />
                <CustomStatistic title="Total Orders" value={totalProfitDatas.orders.toLocaleString()} />
                <CustomStatistic
                  title="Profit MOM"
                  value={(totalProfitDatas.profitMOM || 0).toFixed(1) + '%'}
                  tooltip={VND.format(totalProfitDatas.profitThisMonth || 0)}
                />
                <CustomStatistic
                  title="Profit YOY"
                  value={(totalProfitDatas.profitYOY || 0).toFixed(1) + '%'}
                  tooltip={VND.format(totalProfitDatas.profitThisYear || 0)}
                />
              </div>
            </>
          )}
        </Card>

        <Card title="Best selling categories" extra={<Link to="#">See all</Link>} style={{ flex: 1, minWidth: '500px' }}>
          <Table
            dataSource={bestCategories}
            rowKey="category"
            pagination={{ pageSize: 5, hideOnSinglePage: true }}
            columns={[
              {
                key: 'category',
                title: 'Category',
                dataIndex: 'category',
                render: (category) => <strong>{category}</strong>,
              },
              {
                key: 'turnOver',
                title: 'Turn Over',
                dataIndex: 'turnOver',
                render: (turnOver) => VND.format(turnOver),
              },
              {
                key: 'count',
                title: 'Quantity Sold',
                dataIndex: 'count',
                render: (count) => count.toLocaleString(),
              },
              {
                key: 'increaseBy',
                title: 'Increase By',
                dataIndex: 'increaseBy',
                render: (increaseBy) => `${increaseBy}%`,
              },
            ]}
          />
        </Card>
      </div>

      {/* Chart */}
      <ProfitRevenueChart
  range={
    rangeType === 'month'
      ? 'monthly'
      : rangeType === 'year'
      ? 'yearly'
      : rangeType === 'day'
      ? 'weekly'
      : 'monthly'
  }
  date={customDate}
/>

      {/* Best Products */}
      <Table
        dataSource={bestProducts}
         scroll={{ x: 'max-content' }}
        rowKey={(record, index) => `${record.productName}-${index}`}
        pagination={{ pageSize: 5, hideOnSinglePage: true }}
        style={{ marginTop: '2rem' }}
        columns={[
          {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
            render: (name, record) => (
              <span>
                {name}{' '}
                {record.color && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: record.color,
                      marginLeft: '6px',
                      border: '1px solid #ccc',
                      verticalAlign: 'middle',
                    }}
                    title={record.color}
                  />
                )}
              </span>
            ),
          },
          {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
          },
          {
            title: 'Remaining Quantity',
            dataIndex: 'remainingQuantity',
            key: 'remainingQuantity',
            render: (quantity) => quantity?.toLocaleString() || 0,
          },
          {
            title: 'Turn Over',
            dataIndex: 'turnOver',
            key: 'turnOver',
            render: (value) => VND.format(value),
          },
          {
            title: 'Increase By',
            dataIndex: 'increaseBy',
            key: 'increaseBy',
            render: (value) => `${value}%`,
          },
        ]}
        title={() => (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>Best selling product</span>
            <a href="#">See All</a>
          </div>
        )}
      />
    </div>
  );
};

export default ReportScreen;
