const { pool } = require('../config/database');

// Lấy thống kê dashboard
const getStats = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;

        // Đếm khu trọ
        const [khuTro] = await pool.query(
            'SELECT COUNT(*) as total FROM khutro WHERE maNguoiDang = ?',
            [userId]
        );

        // Đếm phòng trọ
        const [phongTro] = await pool.query(`
            SELECT COUNT(*) as total FROM phongtro pt 
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro 
            WHERE kt.maNguoiDang = ?
        `, [userId]);

        // Đếm phòng trống
        const [phongTrong] = await pool.query(`
            SELECT COUNT(*) as total FROM phongtro pt 
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro 
            WHERE kt.maNguoiDang = ? AND pt.tinhTrang = 'empty'
        `, [userId]);

        // Đếm yêu cầu mới
        const [yeuCau] = await pool.query(`
            SELECT COUNT(*) as total FROM yeucauthue yc 
            JOIN phongtro pt ON yc.maPhongTro = pt.maPhongTro
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro 
            WHERE kt.maNguoiDang = ? AND yc.trangThai = 'pending'
        `, [userId]);

        res.json({
            success: true,
            data: {
                totalKhuTro: khuTro[0].total,
                totalPhongTro: phongTro[0].total,
                totalPhongTrong: phongTrong[0].total,
                totalYeuCauMoi: yeuCau[0].total
            }
        });

    } catch (error) {
        console.error('GetStats error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Lấy danh sách khu trọ
const getKhuTro = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;
        const [rows] = await pool.query(
            'SELECT * FROM khutro WHERE maNguoiDang = ?',
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('GetKhuTro error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Thêm khu trọ
const addKhuTro = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;
        const { tenKhuTro, diaChi, chuTro, sdtChuTro, googleMap } = req.body;

        const [maxId] = await pool.query(
            "SELECT MAX(CAST(SUBSTRING(maKhuTro, 3) AS UNSIGNED)) as maxId FROM khutro"
        );
        const nextId = (maxId[0].maxId || 0) + 1;
        const maKhuTro = 'KT' + String(nextId).padStart(5, '0');

        await pool.query(
            `INSERT INTO khutro (maKhuTro, tenKhuTro, diaChi, chuTro, sdtChuTro, googleMap, maNguoiDang) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [maKhuTro, tenKhuTro, diaChi, chuTro, sdtChuTro, googleMap || '', userId]
        );

        res.status(201).json({
            success: true,
            message: 'Thêm khu trọ thành công',
            data: { maKhuTro }
        });

    } catch (error) {
        console.error('AddKhuTro error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Lấy danh sách phòng trọ của chủ trọ
const getMyPhongTro = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;

        const [rows] = await pool.query(`
            SELECT pt.*, kt.tenKhuTro, kt.diaChi, lp.giaPhong, lp.tenLoaiPhong, hp.anhDaiDien
            FROM phongtro pt 
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro 
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            LEFT JOIN hinhanhphong hp ON pt.maPhongTro = hp.maPhongTro
            WHERE kt.maNguoiDang = ?
            ORDER BY pt.ngayDang DESC
        `, [userId]);

        res.json({ success: true, data: rows });

    } catch (error) {
        console.error('GetMyPhongTro error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Thêm phòng trọ
const addPhongTro = async (req, res) => {
    try {
        const { maKhuTro, maLoaiPhong, dienTich, tinhTrang } = req.body;

        // Tạo mã phòng trọ
        const [maxId] = await pool.query(
            "SELECT MAX(CAST(SUBSTRING(maPhongTro, 3) AS UNSIGNED)) as maxId FROM phongtro"
        );
        const nextId = (maxId[0].maxId || 0) + 1;
        const maPhongTro = 'PT' + String(nextId).padStart(5, '0');

        await pool.query(
            `INSERT INTO phongtro (maPhongTro, maKhuTro, maLoaiPhong, dienTich, tinhTrang) 
             VALUES (?, ?, ?, ?, ?)`,
            [maPhongTro, maKhuTro, maLoaiPhong, dienTich, tinhTrang || 'empty']
        );

        // Xử lý hình ảnh nếu có
        if (req.files && req.files.length > 0) {
            const [maxHAId] = await pool.query(
                "SELECT MAX(CAST(SUBSTRING(maHinhAnh, 3) AS UNSIGNED)) as maxId FROM hinhanhphong"
            );
            const nextHAId = (maxHAId[0].maxId || 0) + 1;
            const maHinhAnh = 'HA' + String(nextHAId).padStart(5, '0');

            const imagePaths = req.files.map(f => `/uploads/${f.filename}`);
            const anhDaiDien = imagePaths[0];
            const hinhAnh = imagePaths.join('\r\n');

            await pool.query(
                `INSERT INTO hinhanhphong (maHinhAnh, maPhongTro, anhDaiDien, hinhAnh) 
                 VALUES (?, ?, ?, ?)`,
                [maHinhAnh, maPhongTro, anhDaiDien, hinhAnh]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Đăng phòng trọ thành công',
            data: { maPhongTro }
        });

    } catch (error) {
        console.error('AddPhongTro error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Cập nhật trạng thái phòng
const updatePhongTroStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { tinhTrang } = req.body;
        const userId = req.user.maNguoiDung;

        await pool.query(`
            UPDATE phongtro pt 
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro 
            SET pt.tinhTrang = ? 
            WHERE pt.maPhongTro = ? AND kt.maNguoiDang = ?
        `, [tinhTrang, id, userId]);

        res.json({ success: true, message: 'Cập nhật thành công' });

    } catch (error) {
        console.error('UpdateStatus error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Xóa phòng trọ
const deletePhongTro = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.maNguoiDung;

        // Kiểm tra quyền
        const [check] = await pool.query(`
            SELECT pt.maPhongTro FROM phongtro pt 
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro 
            WHERE pt.maPhongTro = ? AND kt.maNguoiDang = ?
        `, [id, userId]);

        if (check.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xóa phòng này'
            });
        }

        // Xóa các bản ghi liên quan
        await pool.query('DELETE FROM hinhanhphong WHERE maPhongTro = ?', [id]);
        await pool.query('DELETE FROM danhgia WHERE maPhongTro = ?', [id]);
        await pool.query('DELETE FROM yeucauthue WHERE maPhongTro = ?', [id]);
        await pool.query('DELETE FROM phongtro WHERE maPhongTro = ?', [id]);

        res.json({ success: true, message: 'Xóa phòng trọ thành công' });

    } catch (error) {
        console.error('DeletePhongTro error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Lấy danh sách loại phòng
const getLoaiPhong = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM loaiphong');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('GetLoaiPhong error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Thêm loại phòng
const addLoaiPhong = async (req, res) => {
    try {
        const { tenLoaiPhong, giaPhong, moTaPhongTro } = req.body;

        const [maxId] = await pool.query(
            "SELECT MAX(CAST(SUBSTRING(maLoaiPhong, 3) AS UNSIGNED)) as maxId FROM loaiphong"
        );
        const nextId = (maxId[0].maxId || 0) + 1;
        const maLoaiPhong = 'LP' + String(nextId).padStart(5, '0');

        await pool.query(
            `INSERT INTO loaiphong (maLoaiPhong, tenLoaiPhong, giaPhong, moTaPhongTro) 
             VALUES (?, ?, ?, ?)`,
            [maLoaiPhong, tenLoaiPhong, giaPhong, moTaPhongTro || '']
        );

        res.status(201).json({
            success: true,
            message: 'Thêm loại phòng thành công',
            data: { maLoaiPhong }
        });

    } catch (error) {
        console.error('AddLoaiPhong error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Lấy yêu cầu thuê
const getYeuCauThue = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;

        const [rows] = await pool.query(`
            SELECT yc.*, nd.tenNguoiDung, nd.sdtNguoiDung, nd.emailNguoiDung,
                   pt.maPhongTro, pt.dienTich, kt.tenKhuTro, kt.diaChi, lp.giaPhong
            FROM yeucauthue yc
            JOIN nguoidung nd ON yc.maNguoiThue = nd.maNguoiDung
            JOIN phongtro pt ON yc.maPhongTro = pt.maPhongTro
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            WHERE kt.maNguoiDang = ?
            ORDER BY yc.ngayYeuCau DESC
        `, [userId]);

        res.json({ success: true, data: rows });

    } catch (error) {
        console.error('GetYeuCauThue error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Cập nhật trạng thái yêu cầu
const updateYeuCauStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { trangThai } = req.body;
        const userId = req.user.maNguoiDung;

        await pool.query(`
            UPDATE yeucauthue yc 
            JOIN phongtro pt ON yc.maPhongTro = pt.maPhongTro
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            SET yc.trangThai = ?
            WHERE yc.maYeuCau = ? AND kt.maNguoiDang = ?
        `, [trangThai, id, userId]);

        // Nếu duyệt, cập nhật trạng thái phòng
        if (trangThai === 'approved') {
            await pool.query(`
                UPDATE phongtro pt
                JOIN yeucauthue yc ON yc.maPhongTro = pt.maPhongTro
                SET pt.tinhTrang = 'rented'
                WHERE yc.maYeuCau = ?
            `, [id]);
        }

        res.json({ success: true, message: 'Cập nhật thành công' });

    } catch (error) {
        console.error('UpdateYeuCauStatus error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = {
    getStats,
    getKhuTro,
    addKhuTro,
    getMyPhongTro,
    addPhongTro,
    updatePhongTroStatus,
    deletePhongTro,
    getLoaiPhong,
    addLoaiPhong,
    getYeuCauThue,
    updateYeuCauStatus
};
