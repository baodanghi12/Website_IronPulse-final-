import React, { useState } from 'react';
import { Card, Divider, Spin, Table, Button } from 'antd';
import { Link } from 'react-router-dom';
import { VND } from '../utils/handleCurrency';
import ProfitRevenueChart from '../components/ProfitRevenueChart';
import axios from 'axios';

const ReportScreen = () => {
  const [totalProfitDatas, setTotalProfitDatas] = useState({
    bills: [],
    orders: [],
    revenue: 0,
    profitMonth: 0,
    profitYear: 0,
  });
  const getTotalProfit = async () => {
    setLoadings({ ...loadings, loadingsTotalProfitDatas: true });
    try {
      const res = await axios.get('/api/report');
      const data = res.data;
  
      // Tính total cost từ orders
      const totalCost = data.orders.reduce((sumOrder, order) => {
        const orderCost = order.products.reduce((sumProduct, product) => {
          return sumProduct + (product.cost ?? 0) * (product.quantity ?? 1);
        }, 0);
        return sumOrder + orderCost;
      }, 0);
  
      // Cập nhật state
      setTotalProfitDatas({
        bills: data.bills,
        orders: data.orders,
        revenue: data.revenue,
        profitMonth: data.profitMonth,
        profitYear: data.profitYear,
        totalCost: totalCost,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadings({ ...loadings, loadingsTotalProfitDatas: false });
    }
  };
  
  
  
  const bestSellingProducts = [];
  const columns = [];

  const [loadings, setLoadings] = useState({
    loadingsTotalProfitDatas: false,
  });

  const CustomStatistic = ({ title, value }) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'gray' }}>{title}</div>
    </div>
  );

  return (
    <div style={{ padding: '1rem' }}>
      {/* Button để tải dữ liệu */}
      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        <Button type="primary" onClick={getTotalProfit} loading={loadings.loadingsTotalProfitDatas}>
          Tải báo cáo
        </Button>
      </div>

      {/* Phần trên: 2 Card ngang hàng */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <Card title="Overviews" style={{ flex: 1, minWidth: '500px' }}>
          {loadings.loadingsTotalProfitDatas ? (
            <div style={{ textAlign: 'center' }}>
              <Spin />
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <CustomStatistic title="Profit" value={VND.format(totalProfitDatas.revenue - (totalProfitDatas.totalCost ?? 0))}/>
                <CustomStatistic title="Revenue" value={VND.format(totalProfitDatas.revenue || 0)}/>
                <CustomStatistic title="Order" value={(totalProfitDatas.orders?.length || 0).toLocaleString()}/>
              </div>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <CustomStatistic title="Total Bills" value={(totalProfitDatas.bills?.length || 0).toLocaleString()} />
                <CustomStatistic title="Total Orders" value={(totalProfitDatas.orders?.length || 0).toLocaleString()} />
                <CustomStatistic title="Profit MOM" value={VND.format(totalProfitDatas.profitMonth?.toLocaleString() || 0)} />
                <CustomStatistic title="Profit YOY" value={VND.format(totalProfitDatas.profitYear?.toLocaleString() || 0)} />
              </div>
            </>
          )}
        </Card>

        <Card
          title="Best selling categories"
          extra={<Link to={'#'}>See all</Link>}
          style={{ flex: 1, minWidth: '500px' }}
        >
          <Table
            dataSource={[]} // Cập nhật dữ liệu sau
            pagination={{ pageSize: 5, hideOnSinglePage: true }}
            columns={[
              {
                key: 'category',
                title: 'Category',
                dataIndex: 'category',
                render: (category) => <strong>{category}</strong>, // Hiển thị category
              },
              {
                key: 'turnOver',
                title: 'Turn Over',
                dataIndex: 'turnOver',
                render: (turnOver) => VND.format(turnOver), // Hiển thị Turn Over dưới dạng tiền
              },
              {
                key: 'increaseBy',
                title: 'Increase By',
                dataIndex: 'increaseBy',
                render: (increaseBy) => `${increaseBy}%`, // Hiển thị phần trăm tăng trưởng
              },
            ]}
          />
        </Card>

      </div>

      <ProfitRevenueChart />

      <Table
        dataSource={bestSellingProducts}
        columns={columns}
        pagination={false}
        style={{ marginTop: '2rem' }}
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
