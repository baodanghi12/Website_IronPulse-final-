import express from 'express';
import multer from 'multer';
import path from 'path';

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


export default router;
