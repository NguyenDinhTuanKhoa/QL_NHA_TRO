const express = require('express');
const router = express.Router();
const {
    getConversations,
    getMessages,
    sendMessage,
    sendYeuCau,
    getMyYeuCau
} = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');

// Tất cả routes cần đăng nhập
router.use(authenticateToken);

// Tin nhắn
router.get('/conversations', getConversations);
router.get('/:partnerId', getMessages);
router.post('/send', sendMessage);

// Yêu cầu thuê
router.post('/yeucau', sendYeuCau);
router.get('/yeucau/my', getMyYeuCau);

module.exports = router;
