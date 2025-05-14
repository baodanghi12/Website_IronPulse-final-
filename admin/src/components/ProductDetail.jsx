import React, { useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import axios from 'axios';
import { VND } from '../utils/handleCurrency';

const ProductDetail = ({ productId, visible, onClose }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!productId) return;
    const fetchDetail = async () => {
      try {
        const res = await axios.post('/api/product/single', { productId });
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
  }, [productId]);

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={700} title="Product Details">
      {!product ? (
        <Spin />
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
  {product.image?.map((img, index) => (
    <img
      key={index}
      src={img}
      alt={`product-img-${index}`}
      className="w-full h-48 object-cover rounded border"
    />
  ))}
</div>
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p><strong>Category:</strong> {product.category} / {product.subCategory}</p>
          <p><strong>Price:</strong> {VND.format(product.price)}</p>
          <div>
  <strong>Colors:</strong>
  <div className="flex gap-2 mt-1">
    {product.colors?.map((color, i) => (
      <div
        key={i}
        className="w-6 h-6 rounded-full border shadow"
        style={{ backgroundColor: color }}
        title={color}
      />
    )) || <span>None</span>}
  </div>
</div>
          <p><strong>Sizes:</strong></p>
          <ul className="list-disc list-inside">
            {product.sizes?.map((s, i) => (
              <li key={i}>{s.size}: {s.quantity}</li>
            ))}
          </ul>
          <p><strong>Description:</strong><br />{product.description}</p>
        </div>
      )}
    </Modal>
  );
};

export default ProductDetail;
