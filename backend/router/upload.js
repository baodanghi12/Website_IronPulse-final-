import express from 'express';
import multer from 'multer';
import path from 'path';
import authUser from '../middleware/auth.js';
import userModel from '../models/userModel.js'; 
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve('public/uploads')),

  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  try {
    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({ imageURL: filePath });
  } catch (err) {
    console.error('[UPLOAD ERROR]', err); // Thêm log để thấy lỗi cụ thể
    res.status(500).json({ message: 'Lỗi khi upload file', error: err.message });
  }
});
// ✅ thêm route mới cho avatar
router.post('/avatar', authUser, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có file' });
    }

    const avatarPath = `uploads/${req.file.filename}`;

    await userModel.findByIdAndUpdate(req.userId, {
      avatar: avatarPath,
    });

    res.status(200).json({ success: true, filename: avatarPath });
  } catch (err) {
    console.error('[UPLOAD AVATAR ERROR]', err);
    res.status(500).json({ success: false, message: 'Lỗi khi upload avatar', error: err.message });
  }
});

export default router;
