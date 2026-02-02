const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getStats,
    getKhuTro,
    addKhuTro,
    getMyPhongTro,
    addPhongTro,
    updatePhongTroStatus,
    updatePaymentStatus,
    deletePhongTro,
    getLoaiPhong,
    addLoaiPhong,
    getYeuCauThue,
    updateYeuCauStatus,
    extendRental,
    checkExpiredRentals,
    sendPaymentReminder
} = require('../controllers/landlordController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Cấu hình multer cho upload hình ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `room_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Chỉ chấp nhận file hình ảnh!'));
    }
});

// Middleware kiểm tra landlord
const landlordAuth = [authenticateToken, checkRole('landlord', 'admin')];

// Dashboard
router.get('/stats', landlordAuth, getStats);

// Khu trọ
router.get('/khutro', landlordAuth, getKhuTro);
router.post('/khutro', landlordAuth, addKhuTro);

// Phòng trọ
router.get('/phongtro', landlordAuth, getMyPhongTro);
router.post('/phongtro', landlordAuth, upload.array('hinhAnh', 10), addPhongTro);
router.patch('/phongtro/:id/status', landlordAuth, updatePhongTroStatus);
router.patch('/phongtro/:id/payment', landlordAuth, updatePaymentStatus);
router.delete('/phongtro/:id', landlordAuth, deletePhongTro);

// Loại phòng
router.get('/loaiphong', landlordAuth, getLoaiPhong);
router.post('/loaiphong', landlordAuth, addLoaiPhong);

// Yêu cầu thuê
router.get('/yeucau', landlordAuth, getYeuCauThue);
router.patch('/yeucau/:id', landlordAuth, updateYeuCauStatus);

// Gia hạn và kiểm tra hết hạn
router.post('/phongtro/:id/extend', landlordAuth, extendRental);
router.post('/check-expired', landlordAuth, checkExpiredRentals);
router.post('/send-payment-reminder', landlordAuth, sendPaymentReminder);

module.exports = router;
