// promotionController.js
import Promotion from '../models/promotionModel.js';
import Notification from '../models/notificationModel.js';

// [GET] /api/promotions
export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json(promotions);
  } catch (err) {
    console.error('getPromotions error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// [POST] /api/promotions
export const createPromotion = async (req, res) => {
  try {
    const newPromo = new Promotion(req.body);
    const savedPromo = await newPromo.save();

    await Notification.create({
      type: 'success',
      title: `🎁 Tạo khuyến mãi mới: ${newPromo.title}`,
      content: `Code: ${newPromo.code} - Giá trị: ${newPromo.value}${newPromo.type === 'percent' ? '%' : 'đ'}`,
      link: '/admin/promotions',
      isRead: false,
    });

    res.status(201).json({ message: 'Created', promotion: savedPromo });
  } catch (err) {
    console.error('createPromotion error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// [DELETE] /api/promotions/:id
export const deletePromotion = async (req, res) => {
  try {
    console.log('Trying to delete promotion with ID:', req.params.id);
    const deleted = await Promotion.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    await Notification.create({
      type: 'warning',
      title: `🗑️ Đã xoá khuyến mãi: ${deleted.title}`,
      content: `Code: ${deleted.code}`,
      link: '/admin/promotions',
      isRead: false,
    });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('deletePromotion error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// [PUT] /api/promotions/:id
export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Promotion.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    await Notification.create({
      type: 'success',
      title: `✏️ Cập nhật khuyến mãi: ${updated.title}`,
      content: `Code: ${updated.code} - Trạng thái: ${updated.isActive ? 'Đang hoạt động' : 'Đã tắt'}`,
      link: '/admin/promotions',
      isRead: false,
    });

    res.json({ message: `Updated promotion ${id}`, data: updated });
  } catch (err) {
    console.error('updatePromotion error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

export const checkPromotion = async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await Promotion.findOne({ code });

    if (!promo || promo.numOfAvailable <= 0) {
      return res.status(404).json({ success: false, message: 'Mã không hợp lệ hoặc đã hết lượt dùng' });
    }

    res.json({ success: true, promotion: promo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
  }
};