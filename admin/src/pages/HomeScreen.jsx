import React, { useState, useEffect } from 'react';
import { Card, Spin, Typography } from 'antd';
import StatisticComponent from '../components/StatisticComponent';
import { VND } from '../utils/handleCurrency';
import SalesAndPurchaseStatistic from '../components/SalesAndPurchaseStatistic';
// import { handleAPI } from '../utils/api';
import TopSellingAndLowQuantityStatistic from '../components/TopSellingAndLowQuantityStatistic';
import axios from 'axios'

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statisticValue, setStatisticValues] = useState({
    sales: [],
    salesCount: 0,
  revenue: 0,
  cost: 0,
  profit: 0,
  deliveringOrders: 0,
  toBeReceivedOrders: 0,
  });



  const getStatistics = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/statistics/orders');

      console.log('API response:', res.data);
      const { sales, revenue, cost, profit, deliveringOrders, toBeReceivedOrders} = res.data;
      setStatisticValues({
        salesCount: sales,
        revenue,
        cost,
        profit,
        deliveringOrders,
        toBeReceivedOrders,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStatistics();
  }, []);



  const totalcost = (value) => {
    const items = value.map((item) => {
      return item.products.reduce((a, b) => a + (b.price * (b.cost ?? 0)), 0);
    });

    return items.reduce((a, b) => a + b, 0);
  };

  // const handleUpdateCost = async (value) => {
  //   try {
  //     const items = value.map((item) => {
  //       item.products.forEach((product) => {
  //         if (!product.cost) {
  //           product.cost = product.price * 0.7;
  //           console.log(product._id);
  //         }
  //         console.log('product cost', product.cost);
  //       });
  //     });
  //     await Promise.all(items);
  //   } catch (error) {
  //     console.error('Error updating cost:', error);
  //   }
  // };

  return isLoading ? (
    <div className='container text-center py-5'>
      <Spin />
    </div>
  ) : (
    <div className='container py-5' style={{ paddingLeft: '0.5rem' }}>
  <div className='row'>
    {/* Bọc cả 2 Card vào trong một flex container */}
    <div
      style={{
        display: 'flex',
        gap: '1rem', // Khoảng cách giữa hai phần
        width: '100%',
        flexWrap: 'wrap', // Cho responsive nếu cần
      }}
    >
      {/* Card chính - Sales Overview */}
      <div style={{ flex: '1 1 65%' }}> {/* Chiếm 65% chiều ngang */}
        <Card className='mb-4' style={{ width: '100%' }}>
          <Typography.Title level={4}>Sales Overviews</Typography.Title>
          <div
            className='d-flex justify-content-center mt-3'
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '0.2rem',
              maxWidth: '100%',
            }}
          >
            <div style={{ flex: '0 0 22%' }}>
              <StatisticComponent
                value={statisticValue.salesCount}
                title='Sales'
                image='./src/assets/icons8-sales-50.png'
              />
            </div>
            <div style={{ flex: '0 0 22%' }}>
              <StatisticComponent
                value={VND.format(
                  statisticValue.revenue || 0
                )}
                title='Revenue'
                color='#DE5AFF'
                image='./src/assets/icons8-revenue-32.png'
              />
            </div>
            <div style={{ flex: '0 0 22%' }}>
              <StatisticComponent
                value={VND.format(
                  statisticValue.profit || 0
                )}
                title='Profits'
                color='#FCD547'
                image='./src/assets/icons8-profit-50.png'
              />
            </div>
            <div style={{ flex: '0 0 22%' }}>
              <StatisticComponent
                value={VND.format(statisticValue.cost || 0)}
                title='Costs'
                image='./src/assets/icons8-cost-24.png'
                color='#47FC5E'
              />
            </div>
          </div> 
        </Card>
        
      </div>
      

      {/* Card phụ - nằm bên phải */}
{/* Bọc cả Extra Stats */}
{/* Bọc cả Extra Stats */}
<div style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
  {/* Extra Stats */}
  <Card className='mb-0' body={{ padding: '1rem' }}>
    <Typography.Title level={4}>Extra Stats</Typography.Title>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.2rem 0',
      }}
    >
      {/* Block 1 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* ICON */}
        <div
          style={{
            width: 35,
            height: 35,
            backgroundColor: '#339AF01a',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            marginBottom: '0.2rem',
          }}
        >
          <img
            style={{
              width: '60%',
              height: 'auto',
              borderRadius: 2,
            }}
            src='./src/assets/icons8-sales-50.png'
            alt='icon'
          />
        </div>

        {/* VALUE & TITLE */}
        <Typography.Text style={{ fontSize: '1.2rem', fontWeight: '600' }}>
          {statisticValue.deliveringOrders}
        </Typography.Text>
        <Typography.Text type='secondary' style={{ fontSize: '0.8rem' }}>
          Quantity in Hand
        </Typography.Text>
      </div>

      {/* Block 2 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: 35,
            height: 35,
            backgroundColor: '#339AF01a',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            marginBottom: '0.2rem',
          }}
        >
          <img
            style={{
              width: '60%',
              height: 'auto',
              borderRadius: 2,
            }}
            src='./src/assets/icons8-sales-50.png'
            alt='icon'
          />
        </div>

        <Typography.Text style={{ fontSize: '1.2rem', fontWeight: '600' }}>
          {statisticValue.toBeReceivedOrders}
        </Typography.Text>
        <Typography.Text type='secondary' style={{ fontSize: '0.8rem' }}>
          To be received
        </Typography.Text>
      </div>
    </div>
  </Card>
</div>



    </div>
    
  </div>
    <SalesAndPurchaseStatistic/> 
    <TopSellingAndLowQuantityStatistic/> 
</div>


  );
  
};

export default HomeScreen;
