import express from 'express';

const router = express.Router();

// Ví dụ về một route
router.get('/', (req, res) => {
    res.send('Supplier Route is working!');
});

export default router;
