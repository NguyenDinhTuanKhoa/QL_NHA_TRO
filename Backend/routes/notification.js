const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// Lấy danh sách thông báo
router.get('/', async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;
        const [notifications] = await pool.query(`
            SELECT * FROM thongbao 
            WHERE maNguoiNhan = ? 
            ORDER BY ngayGui DESC
            LIMIT 50
        `, [userId]);
        
        const [unreadCount] = await pool.query(`
            SELECT COUNT(*) as count FROM thongbao 
            WHERE maNguoiNhan = ? AND daXem = 0
        `, [userId]);

        res.json({ 
            success: true, 
            data: notifications,
            unreadCount: unreadCount[0].count
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Đánh dấu đã xem một thông báo
router.patch('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.maNguoiDung;
        
        await pool.query(`
            UPDATE thongbao SET daXem = 1 
            WHERE id = ? AND maNguoiNhan = ?
        `, [id, userId]);

        res.json({ success: true, message: 'Đã đánh dấu đã xem' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Đánh dấu tất cả đã xem
router.patch('/read-all', async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;
        
        await pool.query(`
            UPDATE thongbao SET daXem = 1 
            WHERE maNguoiNhan = ?
        `, [userId]);

        res.json({ success: true, message: 'Đã đánh dấu tất cả đã xem' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Kiểm tra và gửi thông báo đóng tiền (chạy định kỳ hoặc khi load trang)
router.post('/check-payment', async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;
        
        // Lấy các phòng đã thuê của chủ trọ mà chưa đóng tiền quá 25 ngày
        const [rooms] = await pool.query(`
            SELECT pt.maPhongTro, pt.trangThaiDongTien, pt.ngayCapNhatDongTien,
                   kt.tenKhuTro, lp.tenLoaiPhong,
                   DATEDIFF(NOW(), COALESCE(pt.ngayCapNhatDongTien, pt.ngayDang)) as soNgay
            FROM phongtro pt
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            WHERE kt.maNguoiDang = ? 
              AND pt.tinhTrang = 'rented'
              AND pt.trangThaiDongTien = 'chua_dong'
              AND DATEDIFF(NOW(), COALESCE(pt.ngayCapNhatDongTien, pt.ngayDang)) >= 25
        `, [userId]);

        // Tạo thông báo cho các phòng chưa đóng tiền
        for (const room of rooms) {
            // Kiểm tra đã có thông báo trong tháng này chưa
            const [existing] = await pool.query(`
                SELECT id FROM thongbao 
                WHERE maNguoiNhan = ? AND maPhongTro = ? AND loaiThongBao = 'dong_tien'
                  AND MONTH(ngayGui) = MONTH(NOW()) AND YEAR(ngayGui) = YEAR(NOW())
            `, [userId, room.maPhongTro]);

            if (existing.length === 0) {
                await pool.query(`
                    INSERT INTO thongbao (maNguoiNhan, tieuDe, noiDung, loaiThongBao, maPhongTro)
                    VALUES (?, ?, ?, 'dong_tien', ?)
                `, [
                    userId,
                    'Nhắc nhở đóng tiền phòng trọ',
                    `Phòng ${room.tenLoaiPhong} tại ${room.tenKhuTro} đã quá ${room.soNgay} ngày chưa đóng tiền. Vui lòng cập nhật trạng thái đóng tiền.`,
                    room.maPhongTro
                ]);
            }
        }

        res.json({ success: true, message: 'Đã kiểm tra và gửi thông báo' });
    } catch (error) {
        console.error('Check payment error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
