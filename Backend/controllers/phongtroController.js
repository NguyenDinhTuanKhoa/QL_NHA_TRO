const { pool } = require('../config/database');

// Lấy danh sách phòng trọ
const getAllPhongTro = async (req, res) => {
    try {
        const { location, maxPrice, area, status, page = 1, limit = 12 } = req.query;
        const offset = (page - 1) * limit;

        let sql = `
            SELECT 
                pt.maPhongTro, pt.dienTich, pt.tinhTrang, pt.ngayDang,
                lp.giaPhong, lp.tenLoaiPhong, lp.moTaPhongTro,
                kt.maKhuTro, kt.tenKhuTro, kt.diaChi, kt.chuTro, kt.sdtChuTro, kt.googleMap,
                hp.anhDaiDien,
                COALESCE(AVG(dg.diemSo), 0) as diemTrungBinh,
                COUNT(dg.maDanhGia) as soLuongDanhGia
            FROM phongtro pt
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            LEFT JOIN hinhanhphong hp ON pt.maPhongTro = hp.maPhongTro
            LEFT JOIN danhgia dg ON pt.maPhongTro = dg.maPhongTro
            WHERE 1=1
        `;

        const params = [];

        // Filter theo địa điểm
        if (location) {
            sql += ` AND kt.diaChi LIKE ?`;
            params.push(`%${location}%`);
        }

        // Filter theo giá (nhỏ hơn hoặc bằng)
        if (maxPrice) {
            sql += ` AND lp.giaPhong <= ?`;
            params.push(parseInt(maxPrice));
        }

        // Filter theo diện tích
        if (area) {
            const [min, max] = area.split('-');
            if (max === undefined || area === 'above-50') {
                sql += ` AND pt.dienTich >= ?`;
                params.push(50);
            } else {
                sql += ` AND pt.dienTich >= ? AND pt.dienTich < ?`;
                params.push(parseInt(min), parseInt(max));
            }
        }

        // Filter theo trạng thái
        if (status) {
            sql += ` AND pt.tinhTrang = ?`;
            params.push(status);
        }

        sql += ` GROUP BY pt.maPhongTro ORDER BY pt.ngayDang DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.query(sql, params);

        // Đếm tổng số với cùng điều kiện filter
        let countSql = `
            SELECT COUNT(DISTINCT pt.maPhongTro) as total
            FROM phongtro pt
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            WHERE 1=1
        `;
        
        const countParams = [];
        if (location) {
            countSql += ` AND kt.diaChi LIKE ?`;
            countParams.push(`%${location}%`);
        }
        if (maxPrice) {
            countSql += ` AND lp.giaPhong <= ?`;
            countParams.push(parseInt(maxPrice));
        }
        if (area) {
            const [min, max] = area.split('-');
            if (max === undefined || area === 'above-50') {
                countSql += ` AND pt.dienTich >= ?`;
                countParams.push(50);
            } else {
                countSql += ` AND pt.dienTich >= ? AND pt.dienTich < ?`;
                countParams.push(parseInt(min), parseInt(max));
            }
        }
        if (status) {
            countSql += ` AND pt.tinhTrang = ?`;
            countParams.push(status);
        }
        
        const [countResult] = await pool.query(countSql, countParams);

        res.json({
            success: true,
            data: rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: countResult[0]?.total || 0,
                totalPages: Math.ceil((countResult[0]?.total || 0) / limit)
            }
        });

    } catch (error) {
        console.error('GetAllPhongTro error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Lấy chi tiết phòng trọ
const getPhongTroById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(`
            SELECT 
                pt.*, 
                lp.giaPhong, lp.tenLoaiPhong, lp.moTaPhongTro,
                kt.*, 
                hp.anhDaiDien, hp.hinhAnh,
                COALESCE(AVG(dg.diemSo), 0) as diemTrungBinh,
                COUNT(dg.maDanhGia) as soLuongDanhGia
            FROM phongtro pt
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            LEFT JOIN hinhanhphong hp ON pt.maPhongTro = hp.maPhongTro
            LEFT JOIN danhgia dg ON pt.maPhongTro = dg.maPhongTro
            WHERE pt.maPhongTro = ?
            GROUP BY pt.maPhongTro
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phòng trọ'
            });
        }

        // Lấy danh sách đánh giá
        const [reviews] = await pool.query(`
            SELECT dg.*, nd.tenNguoiDung
            FROM danhgia dg
            JOIN nguoidung nd ON dg.maNguoiDung = nd.maNguoiDung
            WHERE dg.maPhongTro = ?
            ORDER BY dg.ngayNhanXet DESC
        `, [id]);

        // Lấy dịch vụ
        const [services] = await pool.query(`
            SELECT dv.*, kd.giaCa
            FROM dichvu dv
            JOIN khutro_dichvu kd ON dv.maDichVu = kd.maDichVu
            JOIN khutro kt ON kd.maKhuTro = kt.maKhuTro
            JOIN phongtro pt ON pt.maKhuTro = kt.maKhuTro
            WHERE pt.maPhongTro = ?
        `, [id]);

        const room = rows[0];
        // Parse hình ảnh
        if (room.hinhAnh) {
            room.danhSachHinhAnh = room.hinhAnh.split('\r\n').filter(img => img);
        }

        res.json({
            success: true,
            data: {
                ...room,
                danhGia: reviews,
                dichVu: services
            }
        });

    } catch (error) {
        console.error('GetPhongTroById error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Thêm đánh giá
const addReview = async (req, res) => {
    try {
        const { maPhongTro, diemSo, nhanXet } = req.body;
        const maNguoiDung = req.user.maNguoiDung;

        // Tạo mã đánh giá
        const [maxId] = await pool.query(
            "SELECT MAX(CAST(SUBSTRING(maDanhGia, 3) AS UNSIGNED)) as maxId FROM danhgia"
        );
        const nextId = (maxId[0].maxId || 0) + 1;
        const maDanhGia = 'DG' + String(nextId).padStart(5, '0');

        await pool.query(
            `INSERT INTO danhgia (maDanhGia, maNguoiDung, maPhongTro, diemSo, nhanXet) 
             VALUES (?, ?, ?, ?, ?)`,
            [maDanhGia, maNguoiDung, maPhongTro, diemSo, nhanXet]
        );

        res.status(201).json({
            success: true,
            message: 'Đánh giá thành công'
        });

    } catch (error) {
        console.error('AddReview error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = { getAllPhongTro, getPhongTroById, addReview };
