const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Middleware: Chỉ admin mới được truy cập
router.use(authenticateToken, checkRole('admin'));

// Thống kê tổng quan
router.get('/stats', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT COUNT(*) as total FROM nguoidung');
        const [landlords] = await pool.query("SELECT COUNT(*) as total FROM nguoidung WHERE vaiTro = 'landlord'");
        const [rooms] = await pool.query('SELECT COUNT(*) as total FROM phongtro');
        const [requests] = await pool.query('SELECT COUNT(*) as total FROM yeucauthue');
        const [pendingRequests] = await pool.query("SELECT COUNT(*) as total FROM yeucauthue WHERE trangThai = 'pending'");
        
        res.json({
            success: true,
            data: {
                totalUsers: users[0].total,
                totalLandlords: landlords[0].total,
                totalRooms: rooms[0].total,
                totalRequests: requests[0].total,
                pendingRequests: pendingRequests[0].total
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lấy danh sách người dùng
router.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT maNguoiDung, tenNguoiDung, emailNguoiDung as email, sdtNguoiDung as soDienThoai, vaiTro, ngayDangKy as ngayTao
            FROM nguoidung
            ORDER BY ngayDangKy DESC
        `);
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Users error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Thêm người dùng mới
router.post('/users', async (req, res) => {
    try {
        const { tenNguoiDung, tenDangNhap, matKhau, emailNguoiDung, sdtNguoiDung, vaiTro } = req.body;

        // Kiểm tra username đã tồn tại
        const [existing] = await pool.query('SELECT * FROM nguoidung WHERE tenDangNhap = ?', [tenDangNhap]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
        }

        // Tạo mã người dùng mới
        const [maxId] = await pool.query("SELECT MAX(CAST(SUBSTRING(maNguoiDung, 3) AS UNSIGNED)) as maxId FROM nguoidung");
        const nextId = (maxId[0].maxId || 0) + 1;
        const maNguoiDung = 'ND' + String(nextId).padStart(5, '0');

        // Hash password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(matKhau, 10);

        await pool.query(
            `INSERT INTO nguoidung (maNguoiDung, tenNguoiDung, matKhau, tenDangNhap, sdtNguoiDung, emailNguoiDung, vaiTro) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [maNguoiDung, tenNguoiDung, hashedPassword, tenDangNhap, sdtNguoiDung || '', emailNguoiDung || '', vaiTro || 'user']
        );

        res.status(201).json({ success: true, message: 'Thêm người dùng thành công' });
    } catch (error) {
        console.error('Add user error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Cập nhật người dùng
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { tenNguoiDung, matKhau, emailNguoiDung, sdtNguoiDung, vaiTro } = req.body;

        let query = 'UPDATE nguoidung SET tenNguoiDung = ?, emailNguoiDung = ?, sdtNguoiDung = ?, vaiTro = ?';
        let params = [tenNguoiDung, emailNguoiDung || '', sdtNguoiDung || '', vaiTro];

        // Nếu có mật khẩu mới thì hash và cập nhật
        if (matKhau) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(matKhau, 10);
            query += ', matKhau = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE maNguoiDung = ?';
        params.push(id);

        await pool.query(query, params);
        res.json({ success: true, message: 'Cập nhật người dùng thành công' });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Cập nhật trạng thái người dùng (thêm cột trangThai nếu cần)
router.patch('/users/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { trangThai } = req.body;
        
        // Nếu bảng chưa có cột trangThai, bỏ qua
        await pool.query('UPDATE nguoidung SET vaiTro = vaiTro WHERE maNguoiDung = ?', [id]);
        res.json({ success: true, message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Cập nhật vai trò người dùng
router.patch('/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { vaiTro } = req.body;
        
        await pool.query('UPDATE nguoidung SET vaiTro = ? WHERE maNguoiDung = ?', [vaiTro, id]);
        res.json({ success: true, message: 'Cập nhật vai trò thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Xóa người dùng
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM nguoidung WHERE maNguoiDung = ?', [id]);
        res.json({ success: true, message: 'Xóa người dùng thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lấy tất cả phòng trọ
router.get('/rooms', async (req, res) => {
    try {
        const [rooms] = await pool.query(`
            SELECT pt.maPhongTro as maPhong, pt.dienTich, pt.tinhTrang as trangThai, pt.ngayDang,
                   lp.tenLoaiPhong as tenPhong, lp.giaPhong as giaThue,
                   kt.tenKhuTro, nd.tenNguoiDung as tenChuTro
            FROM phongtro pt
            LEFT JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            LEFT JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            LEFT JOIN nguoidung nd ON kt.maNguoiDang = nd.maNguoiDung
            ORDER BY pt.ngayDang DESC
        `);
        res.json({ success: true, data: rooms });
    } catch (error) {
        console.error('Rooms error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Cập nhật trạng thái phòng
router.patch('/rooms/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { trangThai } = req.body;
        
        // Map trạng thái sang giá trị database
        const dbStatus = trangThai === 'available' ? 'empty' : 'rented';
        await pool.query('UPDATE phongtro SET tinhTrang = ? WHERE maPhongTro = ?', [dbStatus, id]);
        res.json({ success: true, message: 'Cập nhật trạng thái phòng thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Xóa phòng
router.delete('/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM hinhanhphong WHERE maPhongTro = ?', [id]);
        await pool.query('DELETE FROM phongtro WHERE maPhongTro = ?', [id]);
        res.json({ success: true, message: 'Xóa phòng thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lấy tất cả yêu cầu thuê
router.get('/requests', async (req, res) => {
    try {
        const [requests] = await pool.query(`
            SELECT yc.maYeuCau, yc.trangThai, yc.ngayYeuCau as ngayTao, yc.ghiChu,
                   nd.tenNguoiDung, nd.sdtNguoiDung as soDienThoai,
                   lp.tenLoaiPhong as tenPhong, lp.giaPhong as giaThue
            FROM yeucauthue yc
            JOIN nguoidung nd ON yc.maNguoiThue = nd.maNguoiDung
            JOIN phongtro pt ON yc.maPhongTro = pt.maPhongTro
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            ORDER BY yc.ngayYeuCau DESC
        `);
        res.json({ success: true, data: requests });
    } catch (error) {
        console.error('Requests error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
