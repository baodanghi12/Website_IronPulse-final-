import flashSaleModel from "../models/flashSaleModel.js";



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
        productId: p.productId,
        salePrice: p.salePrice,
        discountPercent: p.discountPercent,
      }));

    if (cleanProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products provided.",
      });
    }

    const now = new Date();

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
          // ✅ Update giá và phần trăm nếu đã có
          existingItem.salePrice = newItem.salePrice;
          existingItem.discountPercent = newItem.discountPercent;
        } else {
          // ✅ Thêm mới nếu chưa có
          existing.products.push(newItem);
        }
      });

      await existing.save();
      return res.json({ success: true, message: "Flash Sale updated." });
    } else {
      // ✅ Tạo Flash Sale mới
      const flashSale = await flashSaleModel.create({
        title,
        startTime,
        endTime,
        isActive,
        products: cleanProducts,
      });

      return res.json({ success: true, flashSale });
    }
  } catch (err) {
    console.error("❌ Flash Sale Create Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + err.message });
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

    const enrichedProducts = sale.products.map((item) => {
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
        isFlashSale: true, // ✅ để đánh dấu rõ ràng
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
  
      if (!flashSale) {
        return res.status(404).json({ success: false, message: 'Product not in flash sale' });
      }
  
      flashSale.products = flashSale.products.filter(
        (p) => p.productId.toString() !== productId
      );
  
      await flashSale.save();
      res.json({ success: true, message: 'Product removed from flash sale' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  // Xoá toàn bộ flash sale
  export const clearAllFlashSale = async (req, res) => {
    try {
      await flashSaleModel.deleteMany({ isActive: true });
      res.json({ success: true, message: 'All flash sale entries removed' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };