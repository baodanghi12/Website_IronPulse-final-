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
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        padding: '0.5rem 0',
        minHeight: '110px', // giúp mọi ô đều cao bằng nhau
      }}
    >
      {/* ICON */}
      <div
        style={{
          width: 40,
          height: 40,
          backgroundColor: `${color}1a`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
        }}
      >
        <img src={image} alt={title} style={{ width: 22, height: 22 }} />
      </div>

      {/* VALUE */}
      <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#555' }}>
        {value}
      </div>

      {/* TITLE */}
      <div style={{ fontSize: '0.85rem', color: '#888' }}>{title}</div>
    </div>
  );
};
export default StatisticComponent;
