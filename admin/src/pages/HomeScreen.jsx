import React, { useState, useEffect } from 'react';
import { Button, Card, Spin, Typography } from 'antd';
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
  });



  const getStatistics = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/statistics/orders');
      console.log('API response:', res.data);
      const { sales, revenue, cost, profit } = res.data;
      setStatisticValues({
        salesCount: sales,
        revenue,
        cost,
        profit,
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
                  statisticValue.cost || 0
                )}
                title='Profits'
                color='#FCD547'
                image='./src/assets/icons8-profit-50.png'
              />
            </div>
            <div style={{ flex: '0 0 22%' }}>
              <StatisticComponent
                value={VND.format(statisticValue.profit || 0)}
                title='Costs'
                image='./src/assets/icons8-sales-50.png'
              />
            </div>
          </div>
        </Card>
        <Card className='mb-4' style={{ width: '100%', marginTop: '1rem', height:'211px' }}>
    <Typography.Title level={4}>Purchase Overview</Typography.Title>
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
          value='10,000'
          title='Purchase'
          image='./src/assets/icons8-sales-50.png'
        />
      </div>
      <div style={{ flex: '0 0 22%' }}>
        <StatisticComponent
          value='5,000,000'
          title='Cost'
          color='#DE5AFF'
          image='./src/assets/icons8-sales-50.png'
        />
      </div>
      <div style={{ flex: '0 0 22%' }}>
        <StatisticComponent
          value='100,000'
          title='Cancel'
          image='./src/assets/icons8-sales-50.png'
        />
      </div>
      <div style={{ flex: '0 0 22%' }}>
        <StatisticComponent
          value='500,000'
          title='Return'
          image='./src/assets/icons8-sales-50.png'
        />
      </div>
    </div>
  </Card>
      </div>
      

      {/* Card phụ - nằm bên phải */}
{/* Bọc cả Extra Stats và Extra Stats 2 lại */}
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
        padding: '0.5rem 0',
      }}
    >
      <StatisticComponent type='vertical' value='123' title='Quantity in Hand' />
      <StatisticComponent type='vertical' value='456' title='To be recieve' />
    </div>
  </Card>

  {/* Extra Stats 2 */}
  <Card className='mb-0' body={{ padding: '1.8rem' }}>
    <Typography.Title level={4}>Extra Stats 2</Typography.Title>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.5rem 0',
      }}
    >
      <StatisticComponent type='vertical' value='789' title='Products' />
      <StatisticComponent type='vertical' value='012' title='Suppliers' />
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
