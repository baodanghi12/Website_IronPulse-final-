import React from 'react';
import { Typography } from 'antd';

const StatisticComponent = ({
  value,
  title,
  color = '#339AF0',
  image = './src/assets/icons8-sales-50.png',
}) => {
  return (
    
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.2rem', // Giảm padding để thu hẹp không gian
        width: '100%', 
        height: '100%',
        
      }}
    >
      {/* ICON */}
      <div
        style={{
          width: 40, // Giảm kích thước icon
          height: 40,
          backgroundColor: `${color}1a`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          marginBottom: '0.3rem', // Giảm margin giữa icon và title/value
        }}
      >
        <img
          style={{
            width: '60%',
            height: 'auto',
            borderRadius: 2,
          }}
          src={image}
          alt='icon'
        />
      </div>

      {/* Title và Value nằm ngang */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start', // Căn trái để title gần với value
          margin: 0, // Loại bỏ margin không cần thiết
        }}
      >
        <Typography.Paragraph
          className='m-0'
          type='secondary'
          style={{
            fontSize: '0.8rem', // Giảm font size của title để thu nhỏ khoảng cách
            marginRight: '0.3rem', // Giảm khoảng cách giữa title và value
            flexShrink: 0,
            padding: 0, // Loại bỏ padding không cần thiết
          }}
        >
          {title}
        </Typography.Paragraph>

        <Typography.Paragraph
          className='mb-0'
          type='secondary'
          style={{
            fontSize: '1rem', // Điều chỉnh lại font size của value để vừa vặn hơn
            fontWeight: '500',
            padding: 0, // Loại bỏ padding không cần thiết
          }}
        >
          {value}
        </Typography.Paragraph>
      </div>
    </div>
  );
};

export default StatisticComponent;
