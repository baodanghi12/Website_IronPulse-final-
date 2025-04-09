import React from "react";
import { Card } from "antd";
import { Link } from "react-router-dom";
const TopSellingAndLowQuantityStatistic = () => {
    return (
        <div
        style={{
          display: "flex", // Sử dụng Flexbox để sắp xếp ngang
          gap: "1rem", // Khoảng cách giữa hai Card
          marginTop: "1rem", // Khoảng cách trên
        }}
      >
        {/* Card 1 */}
        <Card
          title="Top Selling Stock"
          extra={<Link to={`/bills`}>See all</Link>}
          style={{
            flex: 2, // Đảm bảo Card chiếm cùng một tỷ lệ
             // Đặt chiều cao cố định
          }}
        ></Card>
  
        {/* Card 2 */}
        <Card
          title="Low Quantity Stock"
          extra={<Link to={`/inventory`}>See all</Link>}
          style={{
            flex: 1, // Đảm bảo Card chiếm cùng một tỷ lệ
             // Đặt chiều cao cố định
          }}
        ></Card>
      </div>
    );
};
export default TopSellingAndLowQuantityStatistic;