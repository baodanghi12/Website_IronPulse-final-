import React, { useState, useEffect } from "react";
import { Card, Spin } from "antd";
import { Link } from "react-router-dom";
import axios from 'axios';
import { VND } from '../utils/handleCurrency';
const TopSellingAndLowQuantityStatistic = () => {
  const [lowQuantityProducts, setLowQuantityProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTop, setLoadingTop] = useState(false);

  useEffect(() => {
    fetchLowQuantityProducts();
    fetchTopSellingProducts();
  }, []);

  const fetchLowQuantityProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/product/low-quantity"); 

      if (Array.isArray(res.data)) {
        setLowQuantityProducts(res.data);
      } else {
        console.warn("Expected array, got:", res.data);
        setLowQuantityProducts([]);
      }
    } catch (err) {
      console.error("Error fetching low quantity products:", err);
      setLowQuantityProducts([]); // fallback để tránh lỗi map()
    } finally {
      setLoading(false);
    }
  };
  const fetchTopSellingProducts = async () => {
    setLoadingTop(true);
    try {
      const res = await axios.get("/api/product/top-selling");
      setTopSellingProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching top selling products:", err);
      setTopSellingProducts([]);
    } finally {
      setLoadingTop(false);
    }
  };

  const getRemainQuantity = (product) => {
    if (product.countInStock !== undefined) return product.countInStock;
    if (Array.isArray(product.sizes)) {
      return product.sizes.reduce((sum, size) => sum + size.quantity, 0);
    }
    return 0;
  };

  return (
    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
       {/* Card 1: Top Selling Products */}
       <Card
        title="Top Selling Stock"
        extra={<Link to={`/bills`}>See all</Link>}
        style={{ flex: 2 }}
      >
        {loadingTop ? (
          <div className="text-center py-4">
            <Spin />
          </div>
        ) : topSellingProducts.length === 0 ? (
          <div>No top selling products found.</div>
        ) : (
          <div>
            <div style={{ fontWeight: "bold", display: "flex", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
              <div style={{ flex: 2 }}>Name</div>
              <div style={{ flex: 1 }}>Sold</div>
              <div style={{ flex: 1 }}>Remain</div>
              <div style={{ flex: 1 }}>Price</div>
            </div>
            {topSellingProducts.map((product) => (
              <div
                key={product._id}
                style={{ display: "flex", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid #f0f0f0" }}
              >
                <div style={{ flex: 2 }}>{product.name}</div>
                <div style={{ flex: 1 }}>{product.totalSold ?? 0}</div>
                <div style={{ flex: 1 }}>{getRemainQuantity(product)}</div>
                <div style={{ flex: 1 }}><span>{VND.format(product.price)}</span></div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Card 2 */}
      <Card title="Low Quantity Stock" extra={<Link to={`/inventory`}>See all</Link>} style={{ flex: 1 }}>
        {loading ? (
          <div className="text-center py-4">
            <Spin />
          </div>
        ) : (
          lowQuantityProducts.map((product) => {
            const quantity = product.countInStock ?? product.sizes?.reduce((sum, s) => sum + s.quantity, 0);
            const isLowQuantity = quantity < 10;

            return (
              <div key={product._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                {/* Render ảnh sản phẩm */}
                <img
                  src={product.image && product.image.length > 0 ? product.image[0] : '/images/default.jpg'}
                  alt={product.name}
                  style={{ width: '50px', height: 'auto', marginRight: '1rem' }}
                />

                {/* Render tên sản phẩm và số lượng */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div><strong>{product.name}</strong></div>
                    <div>Quantity: {quantity}</div>
                  </div>

                  {/* Hiển thị trạng thái "LOW" nếu số lượng ít */}
                    <div
                      style={{
                        color: 'red',
                        fontWeight: 'bold',
                        backgroundColor: 'yellow',
                        padding: '0.4rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        whiteSpace: 'nowrap', // Ngăn văn bản xuống dòng
                        minWidth: '50px', // Đảm bảo "LOW" có kích thước tối thiểu
                      }}
                    >
                      LOW
                    </div>
                  
                </div>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
};

export default TopSellingAndLowQuantityStatistic;
