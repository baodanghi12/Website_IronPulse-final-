import React, { useEffect, useState } from 'react';
import { Card, Divider, Spin, Table } from 'antd';
import { Link } from 'react-router-dom';
import { VND } from '../utils/handleCurrency';
import ProfitRevenueChart from '../components/ProfitRevenueChart';

const ReportScreen = () => {
  const [totalProfitDatas, setTotalProfitDatas] = useState({
    bills: [],
    orders: [],
    revenue: 0,
    profitMonth: 0,
    profitYear: 0,
  });
  const bestSellingProducts = []; // hoặc gán từ logic nào đó
  const columns = [];
  const [loadings, setLoadings] = useState({
    loadingsTotalProfitDatas: false,
  });

  
  useEffect(() => {
    getTotalProfitDatas();
  }, []);

  const getTotalProfitDatas = async () => {
    setLoadings((prev) => ({ ...prev, loadingsTotalProfitDatas: true }));
    const api = `/admin/total-profit`;
    try {
      // const res = await handleAPI(api);
      // setTotalProfitDatas(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadings((prev) => ({ ...prev, loadingsTotalProfitDatas: false }));
    }
  };

  const CustomStatistic = ({ title, value }) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'gray' }}>{title}</div>
    </div>
  );

  return (
    <div style={{ padding: '1rem' }}>
      {/* Phần trên: 2 Card ngang hàng */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        {/* Card 1 */}
        <Card title="Overviews" style={{ flex: 1, minWidth: '500px' }}>
          {loadings.loadingsTotalProfitDatas ? (
            <div style={{ textAlign: 'center' }}>
              <Spin />
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <CustomStatistic title="Profit" value={VND.format(123000000)} />
                <CustomStatistic title="Revenue" value={VND.format(456000000)} />
                <CustomStatistic title="Order" value={789} />
              </div>
              <Divider />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <CustomStatistic title="Total Bills" value={120} />
                <CustomStatistic title="Total Orders" value={98} />
                <CustomStatistic title="Profit MOM" value={VND.format(23000000)} />
                <CustomStatistic title="Profit YOY" value={VND.format(54000000)} />
              </div>
            </>
          )}
        </Card>

        {/* Card 2 */}
        <Card
          title="Best selling categories"
          extra={<Link to={'#'}>See all</Link>}
          style={{ flex: 1, minWidth: '500px' }}
        >
          <Table
            dataSource={[]} // Cập nhật lại dataSource phù hợp
            showHeader={false}
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true,
            }}
            columns={[
              {
                key: 'name',
                title: 'Name',
                dataIndex: 'title',
              },
              {
                key: 'count',
                title: 'Count',
                dataIndex: 'count',
              },
              {
                key: 'total',
                title: 'Total',
                dataIndex: 'total',
                render: (total) => VND.format(total),
              },
            ]}
          />
        </Card>
      </div>

      {/* Biểu đồ phía dưới */}
      <ProfitRevenueChart />
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
    </div>
  );
};

export default ReportScreen;
