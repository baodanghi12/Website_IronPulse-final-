import React, { useEffect, useState } from 'react';
import { Card, Divider, Spin, Table, Button } from 'antd';
import { Link } from 'react-router-dom';
import { VND } from '../utils/handleCurrency';
import ProfitRevenueChart from '../components/ProfitRevenueChart';
import axios from 'axios';
import * as XLSX from 'xlsx'; // 👉 import thêm thư viện xuất Excel
import ExcelExporter from '../components/ExcelExporter';
const ReportScreen = () => {
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

  const getFlashSaleSummary = async () => {
    try {
      const res = await axios.get('/api/statistics/flashsale-report');
      setFlashSaleData(res.data || []);
    } catch (err) {
      console.error('Error fetching flash sale summary:', err);
    }
  };
  const getTotalProfit = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/statistics/orders');
      const data = res.data;

      setTotalProfitDatas({
        bills: data.totalBills || 0,
        orders: data.totalOrders || 0,
        revenue: data.revenue || 0,
        totalCost: data.totalCost || 0,
        profitMOM: data.profitMOM || 0,
        profitYOY: data.profitYOY || 0,
      });
      setBestCategories(data.bestSellingCategories || []);
      setBestProducts(data.bestSellingProducts || []);
    } catch (error) {
      console.error('Error loading profit data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🆕 Tự động fetch khi mở trang
  useEffect(() => {
    getTotalProfit();
    getFlashSaleSummary();
  }, []);

  
  const CustomStatistic = ({ title, value, tooltip }) => (
    <div style={{ textAlign: 'center' }} title={tooltip}>
      <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'gray' }}>{title}</div>
    </div>
  );
  

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
  <ExcelExporter
    reportData={totalProfitDatas}
    bestCategories={bestCategories}
    bestProducts={bestProducts}
    flashSaleData={flashSaleData} 
  />
</div>


      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <Card title="Overviews" style={{ flex: 1, minWidth: '500px' }}>
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <Spin />
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <CustomStatistic
                  title="Profit"
                  value={VND.format(totalProfitDatas.revenue - totalProfitDatas.totalCost)}
                />
                <CustomStatistic
                  title="Revenue"
                  value={VND.format(totalProfitDatas.revenue)}
                />
                <CustomStatistic
                  title="Total Cost"
                  value={VND.format(totalProfitDatas.totalCost)}
                />
              </div>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <CustomStatistic
                  title="Total Bills"
                  value={totalProfitDatas.bills.toLocaleString()}
                />
                <CustomStatistic
                  title="Total Orders"
                  value={totalProfitDatas.orders.toLocaleString()}
                />
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

        <Card
          title="Best selling categories"
          extra={<Link to="#">See all</Link>}
          style={{ flex: 1, minWidth: '500px' }}
          
        >
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
      title: 'Quantity Sold', // 🆕 thêm cột
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

      <ProfitRevenueChart />

      <Table
  dataSource={bestProducts}
  rowKey="productId"
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
                verticalAlign: 'middle'
              }}
              title={record.color}
            />
          )}
        </span>
      ),
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
      render: (productId) => {
        if (!productId) {
          return <span style={{ color: 'red', fontWeight: 600 }}>Unknown</span>;
        }
        const last6 = productId.slice(-6); // lấy 6 ký tự cuối
        return (
          <span
            style={{
              backgroundColor: '#e0f7fa',
              padding: '2px 8px',
              borderRadius: '5px',
              fontWeight: '600',
              color: '#00796b',
            }}
          >
            #{last6}
          </span>
        );
      }
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
