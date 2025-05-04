import userModel from "../models/userModel.js";

// Lấy giỏ hàng của user
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const cartData = user.cartData || {};
    

    res.json({ success: true, cartData });
  } catch (error) {
    console.error('❌ Error getUserCart:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  try {
    const { itemId, size, color, quantity = 1 } = req.body;
    const userId = req.userId;

    console.log('🟢 addToCart → userId:', userId);
    console.log('🛍 itemId:', itemId, 'size:', size, 'color:', color, 'qty:', quantity);

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ KHÔNG sửa trực tiếp user.cartData → clone ra rồi gán lại
    const cartData = structuredClone(user.cartData || {});
    const key = size + (color ? `-${color}` : '');

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][key] = (cartData[itemId][key] || 0) + quantity;

    // ✅ Gán lại toàn bộ object mới
    user.cartData = cartData;
    user.markModified('cartData');

    await user.save();

    console.log('✅ Cart saved to DB:', JSON.stringify(user.cartData, null, 2));
    return res.json({ success: true, cartData: user.cartData });
  } catch (error) {
    console.error('❌ Error addToCart:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};



// Update số lượng sản phẩm trong giỏ hàng
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity, color, oldSize, oldColor, cartData: fullCartFromClient } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Nếu có fullCartFromClient (merge từ localStorage)
    if (fullCartFromClient && typeof fullCartFromClient === 'object') {
      user.cartData = fullCartFromClient;
      user.markModified('cartData');
      await user.save();

      console.log('✅ Full cart merged from guestCart into user.cartData');
      return res.json({ success: true, cartData: user.cartData });
    }

    // ✅ Logic cũ cho update từng sản phẩm
    const cartData = structuredClone(user.cartData || {});

    const buildKey = (s, c) => (c ? `${s}-${c}` : s);
    const newKey = buildKey(size, color);
    const oldKey = buildKey(oldSize, oldColor);

    cartData[itemId] = cartData[itemId] || {};

    if (oldKey !== newKey && cartData[itemId][oldKey] !== undefined) {
      delete cartData[itemId][oldKey];
    }

    cartData[itemId][newKey] = quantity;

    if (Object.keys(cartData[itemId]).length === 0) {
      delete cartData[itemId];
    }

    user.cartData = cartData;
    user.markModified('cartData');
    await user.save();

    console.log('✅ cartData updated:', JSON.stringify(cartData, null, 2));

    res.json({ success: true, cartData });
  } catch (error) {
    console.error('❌ Error updateCart:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};







export { getUserCart, addToCart, updateCart };
