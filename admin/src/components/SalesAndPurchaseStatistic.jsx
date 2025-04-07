import React from "react";
import { Card, Dropdown,Select } from "antd";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
const SalesAndPurchaseStatistic = () => {

    const [timeTypeSelected, setTimeTypeSelected] = React.useState('weekly', 'mounthly', 'yearly');
    
    // Khi chọn menu
    const handleMenuClick = (e) => {
        setTimeTypeSelected(e.key); // cập nhật option được chọn
    };
    const options ={
        responsive: true,
        plugins:{
            legend:{
                display: false,
                posision:'top' ,
            },
            title:{
                display: false,
                
            },
        },
    };
    const items =[
        {
            key: 'weekly',
            label: 'Weekly',
        },
        {
            key: 'mounthly',
            label: 'Mounthly',
        },
        {
            key: 'yearly',
            label: 'Yearly',
        },

    ];
    return (
        <div
        style={{
          display: 'flex', // Sử dụng flexbox để sắp xếp ngang
          gap: '1rem', // Khoảng cách giữa hai card
          marginTop: '1rem', // Khoảng cách trên
        }}
      >
        <div style={{ flex: '1.2' }}> {/* Card chiếm 2.5 phần */}

        <Card
      title='Purchase & Order'
      extra={
        <Select
          value={timeTypeSelected}
          onChange={(value) => setTimeTypeSelected(value)}
          style={{ width: 120 }}
        >
          {items.map((item) => (
            <Select.Option key={item.key} value={item.key}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      }
      style={{ height: '100%', width: '100%' }}
    >
      <Bar
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'Sales',
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
              label: 'Orders',
              data: [28, 48, 40, 19, 86, 27, 90],
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        }}
        options={options}
      />
    </Card>
        </div>
        {/* Card chứa Line Chart */}
      <div style={{ flex: "1" }}>
        <Card
          title="Sale summary"
          
          style={{ height: "100%", width: "100%" }}
        >
          <Line
            data={{
              labels: ["January", "February", "March", "April", "May", "June", "July"],
              datasets: [
                {
                  label: "Sales",
                  data: [65, 59, 80, 81, 56, 55, 40],
                  backgroundColor: "rgba(53, 162, 235, 0.5)",
                },
                {
                  label: "Orders",
                  data: [28, 48, 40, 19, 86, 27, 90],
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
              ],
            }}
            options={options}
          />
        </Card>
      </div>
      </div>
);
};
export default SalesAndPurchaseStatistic;