import React from "react";
import { Card, Select } from "antd";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

const SalesAndPurchaseStatistic = () => {
  
  const [timeTypeSelected, setTimeTypeSelected] = React.useState("weekly");

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  const items = [
    {
      key: "weekly",
      label: "Weekly",
    },
    {
      key: "monthly",
      label: "Monthly",
    },
    {
      key: "yearly",
      label: "Yearly",
    },
  ];

  const getChartData = () => {
    if (timeTypeSelected === "weekly") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Sales",
            data: [12, 19, 3, 5, 2, 3, 7],
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          {
            label: "Orders",
            data: [2, 3, 20, 5, 1, 4, 6],
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
    } else if (timeTypeSelected === "monthly") {
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Sales",
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          {
            label: "Orders",
            data: [28, 48, 40, 19, 86, 27],
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
    } else {
      // yearly
      return {
        labels: ["2020", "2021", "2022", "2023", "2024"],
        datasets: [
          {
            label: "Sales",
            data: [200, 300, 400, 350, 500],
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          {
            label: "Orders",
            data: [150, 250, 320, 290, 450],
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        marginTop: "1rem",
        flexWrap: "wrap", // responsive khi màn hình nhỏ
      }}
    >
      {/* Bar Chart */}
      <div style={{ flex: "1.2", minWidth: "300px" }}>
        <Card
          title="Purchase & Order"
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
          style={{ height: "100%", width: "100%" }}
        >
          <Bar data={getChartData()} options={options} />
        </Card>
      </div>

      {/* Line Chart */}
      <div style={{ flex: "1", minWidth: "300px" }}>
        <Card title="Sale summary" style={{ height: "100%", width: "100%" }}>
          <Line data={getChartData()} options={options} />
        </Card>
      </div>
    </div>
  );
};

export default SalesAndPurchaseStatistic;
