import flashSaleModel from "../models/flashSaleModel.js";
import mongoose from "mongoose"; 
import Notification from "../models/notificationModel.js";
import productModel from '../models/productModel.js';
export const createFlashSale = async (req, res) => {
  try {
    const { title, startTime, endTime, isActive, products } = req.body;

    const cleanProducts = products
      .filter(
        (p) =>
          p.productId &&
          p.salePrice > 0 &&
          typeof p.discountPercent === "number" &&
          p.discountPercent >= 0
      )
      .map((p) => ({
        productId: new mongoose.Types.ObjectId(p.productId), // ✅ ép kiểu ObjectId
        salePrice: p.salePrice,
        discountPercent: p.discountPercent,
      }));

    if (cleanProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products provided.",
      });
    }

    const existing = await flashSaleModel.findOne({
      isActive: true,
      startTime: { $lte: new Date(endTime) },
      endTime: { $gte: new Date(startTime) },
    });

    if (existing) {
      cleanProducts.forEach((newItem) => {
        const existingItem = existing.products.find(
          (p) => p.productId.toString() === newItem.productId.toString()
        );

        if (existingItem) {
          existingItem.salePrice = newItem.salePrice;
          existingItem.discountPercent = newItem.discountPercent;
        } else {
          existing.products.push(newItem);
        }
      });

      await existing.save();
      await Notification.create({
        type: 'flashsale',
        title: `Cập nhật Flash Sale đang chạy`,
        content: `${cleanProducts.length} sản phẩm đã được thêm hoặc sửa`,
        isRead: false,
        link: '/admin/flashsale',
      });
      return res.json({ success: true, message: "Flash Sale updated." });
    } else {
      const flashSale = await flashSaleModel.create({
        title,
        startTime,
        endTime,
        isActive,
        products: cleanProducts,
      });
      await Notification.create({
        type: 'flashsale',
        title: 'Đã tạo Flash Sale mới',
        content: `Từ ${new Date(startTime).toLocaleDateString()} đến ${new Date(endTime).toLocaleDateString()} – ${cleanProducts.length} sản phẩm`,
        isRead: false,
        link: '/admin/flashsale'
      });


      return res.json({ success: true, flashSale });
    }
  } catch (err) {
    console.error("❌ Flash Sale Create Error:", err);
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
};
export const getActiveFlashSale = async (req, res) => {
  try {
    const now = new Date();
    const sale = await flashSaleModel.findOne({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
    }).populate('products.productId');

    if (!sale) {
      return res.json({ success: true, products: [] });
    }


    const enrichedProducts = sale.products
      .filter(item => item.productId) // để tránh lỗi populate null
      .map((item) => {
        const p = item.productId;
        return {
          _id: p._id,
          name: p.name,
          image: p.image,
          category: p.category,
          price: item.salePrice,
          priceBeforeSale: p.price,
          discountPercent: item.discountPercent,
          sizes: p.sizes,
          isFlashSale: true,
        };
      });

    res.json({
      success: true,
      products: enrichedProducts,
      startTime: sale.startTime,
      endTime: sale.endTime,
    });
  } catch (err) {
    console.error("❌ Error in getActiveFlashSale:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


// ✅ Bật / tắt flash sale
export const toggleFlashSaleStatus = async (req, res) => {
  try {
    const { id, isActive } = req.body;
    await flashSaleModel.findByIdAndUpdate(id, { isActive });
    res.json({ success: true, message: "Flash Sale status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Xoá 1 sản phẩm khỏi flash sale
export const removeProductFromSale = async (req, res) => {
    try {
      const { productId } = req.params;
  
      const flashSale = await flashSaleModel.findOne({
        isActive: true,
        'products.productId': productId,
      });
      const removedProduct = await productModel.findById(productId);
  
      if (!flashSale) {
        return res.status(404).json({ success: false, message: 'Product not in flash sale' });
      }
  
      flashSale.products = flashSale.products.filter(
        (p) => p.productId.toString() !== productId
      );
  
      await flashSale.save();
      await Notification.create({
        type: 'flashsale',
        title: `Đã gỡ sản phẩm khỏi Flash Sale`,
         content: `Tên: ${removedProduct?.name || 'Không rõ'} | Danh mục: ${removedProduct?.category || '---'}`,
        isRead: false,
        link: '/admin/flashsale',
      });
      res.json({ success: true, message: 'Product removed from flash sale' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  // Xoá toàn bộ flash sale
  export const clearAllFlashSale = async (req, res) => {
    try {
      await flashSaleModel.updateMany(
        { isActive: true },
        {
          $set: {
            products: [],
            isActive: false, // ✅ không còn hiệu lực để hiển thị
          },
        }
      );
            await Notification.create({
        type: 'flashsale',
        title: 'Đã xóa toàn bộ sản phẩm khỏi Flash Sale',
        content: 'Tất cả sản phẩm flash sale đã được gỡ và vô hiệu hóa',
        isRead: false,
        link: '/admin/flashsale',
      });
      res.json({ success: true, message: 'All flash sale entries removed' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };