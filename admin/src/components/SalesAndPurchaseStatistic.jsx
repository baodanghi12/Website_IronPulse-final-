import React, { useEffect, useState } from "react";
import { Card, Select } from "antd";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";

const SalesAndPurchaseStatistic = () => {
  const [timeTypeSelected, setTimeTypeSelected] = useState("weekly");
  const [chartData, setChartData] = useState({
    labels: [],
    sales: [],
    orders: [],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  const items = [
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ];

  const getChartData = () => {
    return {
      labels: chartData.labels,
      datasets: [
        {
          label: "Sales",
          data: chartData.sales,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgba(53, 162, 235, 1)",
        },
        {
          label: "Orders",
          data: chartData.orders,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
        },
      ],
    };
  };
  

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(`/api/statistics/chart?type=${timeTypeSelected}`);
        setChartData({
          labels: res.data.labels || [],
          sales: res.data.sales || [],
          orders: res.data.orders || [],
        });
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, [timeTypeSelected]);

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        marginTop: "1rem",
        flexWrap: "wrap",
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
