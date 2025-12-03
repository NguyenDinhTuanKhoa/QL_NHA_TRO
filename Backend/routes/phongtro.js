const express = require('express');
const router = express.Router();
const { getAllPhongTro, getPhongTroById, addReview } = require('../controllers/phongtroController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// GET /api/phongtro - Lấy danh sách phòng trọ
router.get('/', optionalAuth, getAllPhongTro);

// GET /api/phongtro/:id - Chi tiết phòng trọ
router.get('/:id', optionalAuth, getPhongTroById);

// POST /api/phongtro/review - Thêm đánh giá
router.post('/review', authenticateToken, addReview);

module.exports = router;
