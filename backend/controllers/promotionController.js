// promotionController.js
import Promotion from '../models/promotionModel.js';

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
    res.status(201).json({ message: 'Created', promotion: savedPromo });
  } catch (err) {
    console.error('createPromotion error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// [DELETE] /api/promotions/:id
// promotionController.js
// promotionController.js
export const deletePromotion = async (req, res) => {
  try {
    console.log('Trying to delete promotion with ID:', req.params.id); // Log để xem ID
    const deleted = await Promotion.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
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
    res.json({ message: `Updated promotion ${id}`, data: updated });
  } catch (err) {
    console.error('updatePromotion error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};
