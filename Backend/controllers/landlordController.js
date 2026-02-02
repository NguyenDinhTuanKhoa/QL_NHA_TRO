const { pool } = require('../config/database');

// Helper function để gửi thông báo
const sendNotification = async (maNguoiNhan, tieuDe, noiDung, loaiThongBao, maPhongTro = null) => {
    try {
        await pool.query(`
            INSERT INTO thongbao (maNguoiNhan, tieuDe, noiDung, loaiThongBao, maPhongTro)
            VALUES (?, ?, ?, ?, ?)
        `, [maNguoiNhan, tieuDe, noiDung, loaiThongBao, maPhongTro]);
    } catch (error) {
        console.error('Send notification error:', error);
    }
};

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
            SELECT pt.*, pt.trangThaiDongTien, pt.ngayCapNhatDongTien,
                   pt.ngayBatDauThue, pt.ngayHetHan,
                   kt.tenKhuTro, kt.diaChi, lp.giaPhong, lp.tenLoaiPhong, hp.anhDaiDien,
                   yc.maNguoiThue, nd.tenNguoiDung as tenNguoiThue, nd.sdtNguoiDung as sdtNguoiThue
            FROM phongtro pt 
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro 
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            LEFT JOIN hinhanhphong hp ON pt.maPhongTro = hp.maPhongTro
            LEFT JOIN yeucauthue yc ON pt.maPhongTro = yc.maPhongTro AND yc.trangThai = 'approved'
            LEFT JOIN nguoidung nd ON yc.maNguoiThue = nd.maNguoiDung
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

// Cập nhật trạng thái đóng tiền
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { trangThaiDongTien } = req.body;
        const userId = req.user.maNguoiDung;

        // Lấy trạng thái cũ
        const [oldStatus] = await pool.query(`
            SELECT pt.trangThaiDongTien, kt.tenKhuTro, lp.tenLoaiPhong, yc.maNguoiThue
            FROM phongtro pt
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            LEFT JOIN yeucauthue yc ON pt.maPhongTro = yc.maPhongTro AND yc.trangThai = 'approved'
            WHERE pt.maPhongTro = ? AND kt.maNguoiDang = ?
        `, [id, userId]);

        if (oldStatus.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });
        }

        // Chỉ cập nhật trạng thái đóng tiền (KHÔNG thay đổi ngày)
        await pool.query(`
            UPDATE phongtro pt 
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro 
            SET pt.trangThaiDongTien = ?, pt.ngayCapNhatDongTien = NOW()
            WHERE pt.maPhongTro = ? AND kt.maNguoiDang = ?
        `, [trangThaiDongTien, id, userId]);

        // Gửi thông báo cho người thuê
        if (oldStatus[0].maNguoiThue) {
            if (trangThaiDongTien === 'da_dong' && oldStatus[0].trangThaiDongTien === 'chua_dong') {
                // Chuyển sang đã đóng -> thông báo xác nhận
                await sendNotification(
                    oldStatus[0].maNguoiThue,
                    'Xác nhận đã đóng tiền phòng',
                    `Chủ trọ đã xác nhận bạn đã đóng tiền phòng ${oldStatus[0].tenLoaiPhong} tại ${oldStatus[0].tenKhuTro}. Cảm ơn bạn!`,
                    'dong_tien',
                    id
                );
            } else if (trangThaiDongTien === 'chua_dong' && oldStatus[0].trangThaiDongTien === 'da_dong') {
                // Chuyển sang chưa đóng -> thông báo nhắc đóng tiền
                await sendNotification(
                    oldStatus[0].maNguoiThue,
                    'Nhắc nhở đóng tiền phòng trọ',
                    `Bạn cần đóng tiền phòng ${oldStatus[0].tenLoaiPhong} tại ${oldStatus[0].tenKhuTro}. Vui lòng đóng tiền đúng hạn để tránh bị gián đoạn dịch vụ.`,
                    'dong_tien',
                    id
                );
            }
        }

        res.json({ success: true, message: 'Cập nhật trạng thái đóng tiền thành công' });

    } catch (error) {
        console.error('UpdatePaymentStatus error:', error);
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

        // Nếu duyệt, cập nhật trạng thái phòng và ngày thuê
        if (trangThai === 'approved') {
            // Tính ngày hết hạn (mặc định 1 tháng)
            const ngayBatDau = new Date();
            const ngayHetHan = new Date();
            ngayHetHan.setMonth(ngayHetHan.getMonth() + 1);

            await pool.query(`
                UPDATE phongtro pt
                JOIN yeucauthue yc ON yc.maPhongTro = pt.maPhongTro
                SET pt.tinhTrang = 'rented',
                    pt.ngayBatDauThue = ?,
                    pt.ngayHetHan = ?,
                    pt.trangThaiDongTien = 'chua_dong'
                WHERE yc.maYeuCau = ?
            `, [ngayBatDau, ngayHetHan, id]);

            // Gửi thông báo cho người thuê
            const [yeuCau] = await pool.query(`
                SELECT yc.maNguoiThue, pt.maPhongTro, kt.tenKhuTro, lp.tenLoaiPhong
                FROM yeucauthue yc
                JOIN phongtro pt ON yc.maPhongTro = pt.maPhongTro
                JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
                JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
                WHERE yc.maYeuCau = ?
            `, [id]);

            if (yeuCau.length > 0) {
                await sendNotification(
                    yeuCau[0].maNguoiThue,
                    'Yêu cầu thuê phòng được duyệt',
                    `Yêu cầu thuê phòng ${yeuCau[0].tenLoaiPhong} tại ${yeuCau[0].tenKhuTro} đã được chấp nhận. Hạn thuê đến ${ngayHetHan.toLocaleDateString('vi-VN')}.`,
                    'yeu_cau',
                    yeuCau[0].maPhongTro
                );
            }
        }

        res.json({ success: true, message: 'Cập nhật thành công' });

    } catch (error) {
        console.error('UpdateYeuCauStatus error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Gia hạn thuê phòng
const extendRental = async (req, res) => {
    try {
        const { id } = req.params;
        const { soThang } = req.body; // Số tháng gia hạn
        const userId = req.user.maNguoiDung;

        // Lấy thông tin phòng hiện tại
        const [room] = await pool.query(`
            SELECT pt.*, kt.tenKhuTro, lp.tenLoaiPhong, yc.maNguoiThue
            FROM phongtro pt
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            LEFT JOIN yeucauthue yc ON pt.maPhongTro = yc.maPhongTro AND yc.trangThai = 'approved'
            WHERE pt.maPhongTro = ? AND kt.maNguoiDang = ?
        `, [id, userId]);

        if (room.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });
        }

        if (room[0].tinhTrang !== 'rented') {
            return res.status(400).json({ success: false, message: 'Phòng chưa được thuê' });
        }

        // Ngày bắt đầu thuê mới = ngày hết hạn cũ (hoặc ngày hiện tại nếu chưa có)
        const ngayBatDauThueMoi = room[0].ngayHetHan ? new Date(room[0].ngayHetHan) : new Date();
        // Ngày hết hạn mới = ngày bắt đầu thuê mới + số tháng gia hạn
        const ngayHetHanMoi = new Date(ngayBatDauThueMoi);
        ngayHetHanMoi.setMonth(ngayHetHanMoi.getMonth() + (soThang || 1));

        // Lưu lịch sử gia hạn
        await pool.query(`
            INSERT INTO lichsu_giahan (maPhongTro, ngayGiaHanCu, ngayGiaHanMoi, ghiChu)
            VALUES (?, ?, ?, ?)
        `, [id, ngayBatDauThueMoi, ngayHetHanMoi, `Gia hạn thêm ${soThang || 1} tháng`]);

        // Cập nhật ngày bắt đầu thuê mới, ngày hết hạn mới và trạng thái đã đóng tiền
        await pool.query(`
            UPDATE phongtro 
            SET ngayBatDauThue = ?,
                ngayHetHan = ?,
                trangThaiDongTien = 'da_dong',
                ngayCapNhatDongTien = NOW()
            WHERE maPhongTro = ?
        `, [ngayBatDauThueMoi, ngayHetHanMoi, id]);

        // Gửi thông báo cho người thuê
        if (room[0].maNguoiThue) {
            await sendNotification(
                room[0].maNguoiThue,
                'Gia hạn thuê phòng thành công',
                `Phòng ${room[0].tenLoaiPhong} tại ${room[0].tenKhuTro} đã được gia hạn thêm ${soThang || 1} tháng. Thời hạn thuê mới: ${ngayBatDauThueMoi.toLocaleDateString('vi-VN')} - ${ngayHetHanMoi.toLocaleDateString('vi-VN')}.`,
                'gia_han',
                id
            );
        }

        res.json({ 
            success: true, 
            message: 'Gia hạn thành công',
            data: {
                ngayBatDauThueMoi: ngayBatDauThueMoi,
                ngayHetHanMoi: ngayHetHanMoi
            }
        });

    } catch (error) {
        console.error('ExtendRental error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Kiểm tra và cập nhật trạng thái hết hạn
const checkExpiredRentals = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;

        // Lấy các phòng cần cập nhật:
        // 1. Đã hết hạn (ngayHetHan < ngày hiện tại) VÀ trạng thái là "đã đóng"
        // 2. Hoặc ngayBatDauThue = ngayHetHan (thời hạn = 0) VÀ trạng thái là "đã đóng"
        const [expiredRooms] = await pool.query(`
            SELECT pt.maPhongTro, pt.ngayBatDauThue, pt.ngayHetHan, pt.trangThaiDongTien, kt.tenKhuTro, lp.tenLoaiPhong, yc.maNguoiThue
            FROM phongtro pt
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            LEFT JOIN yeucauthue yc ON pt.maPhongTro = yc.maPhongTro AND yc.trangThai = 'approved'
            WHERE kt.maNguoiDang = ?
              AND pt.tinhTrang = 'rented'
              AND pt.trangThaiDongTien = 'da_dong'
              AND (
                  (pt.ngayHetHan IS NOT NULL AND pt.ngayHetHan < CURDATE())
                  OR (pt.ngayBatDauThue IS NOT NULL AND pt.ngayHetHan IS NOT NULL AND pt.ngayBatDauThue = pt.ngayHetHan)
              )
        `, [userId]);

        let updatedCount = 0;

        for (const room of expiredRooms) {
            // Cập nhật trạng thái đóng tiền thành chưa đóng
            await pool.query(`
                UPDATE phongtro 
                SET trangThaiDongTien = 'chua_dong',
                    ngayCapNhatDongTien = NOW()
                WHERE maPhongTro = ?
            `, [room.maPhongTro]);

            const isDateEqual = room.ngayBatDauThue && room.ngayHetHan && 
                new Date(room.ngayBatDauThue).getTime() === new Date(room.ngayHetHan).getTime();

            // Gửi thông báo cho chủ trọ
            await sendNotification(
                userId,
                isDateEqual ? 'Thời hạn thuê phòng đã hết' : 'Phòng trọ hết hạn thuê',
                isDateEqual 
                    ? `Phòng ${room.tenLoaiPhong} tại ${room.tenKhuTro} đã hết thời hạn thuê. Trạng thái đã chuyển sang "chưa đóng tiền". Vui lòng gia hạn.`
                    : `Phòng ${room.tenLoaiPhong} tại ${room.tenKhuTro} đã hết hạn thuê vào ngày ${new Date(room.ngayHetHan).toLocaleDateString('vi-VN')}. Trạng thái đã chuyển sang "chưa đóng tiền". Vui lòng gia hạn.`,
                'het_han',
                room.maPhongTro
            );

            // Gửi thông báo cho người thuê
            if (room.maNguoiThue) {
                await sendNotification(
                    room.maNguoiThue,
                    isDateEqual ? 'Thời hạn thuê phòng đã hết' : 'Hợp đồng thuê phòng hết hạn',
                    isDateEqual
                        ? `Thời hạn thuê phòng ${room.tenLoaiPhong} tại ${room.tenKhuTro} đã hết. Vui lòng liên hệ chủ trọ để gia hạn và đóng tiền.`
                        : `Hợp đồng thuê phòng ${room.tenLoaiPhong} tại ${room.tenKhuTro} đã hết hạn vào ngày ${new Date(room.ngayHetHan).toLocaleDateString('vi-VN')}. Vui lòng liên hệ chủ trọ để gia hạn và đóng tiền.`,
                    'het_han',
                    room.maPhongTro
                );
            }

            updatedCount++;
        }

        res.json({ 
            success: true, 
            message: updatedCount > 0 ? `Đã cập nhật ${updatedCount} phòng sang trạng thái chưa đóng tiền` : 'Không có phòng nào cần cập nhật',
            expiredCount: updatedCount
        });

    } catch (error) {
        console.error('CheckExpiredRentals error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Gửi thông báo nhắc đóng tiền cho người thuê chưa đóng
const sendPaymentReminder = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;

        // Lấy các phòng chưa đóng tiền
        const [unpaidRooms] = await pool.query(`
            SELECT pt.maPhongTro, pt.ngayHetHan, kt.tenKhuTro, lp.tenLoaiPhong, lp.giaPhong, yc.maNguoiThue
            FROM phongtro pt
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            LEFT JOIN yeucauthue yc ON pt.maPhongTro = yc.maPhongTro AND yc.trangThai = 'approved'
            WHERE kt.maNguoiDang = ?
              AND pt.tinhTrang = 'rented'
              AND pt.trangThaiDongTien = 'chua_dong'
              AND yc.maNguoiThue IS NOT NULL
        `, [userId]);

        let sentCount = 0;

        for (const room of unpaidRooms) {
            // Gửi thông báo nhắc đóng tiền
            await sendNotification(
                room.maNguoiThue,
                'Nhắc nhở đóng tiền phòng trọ',
                `Bạn chưa đóng tiền phòng ${room.tenLoaiPhong} tại ${room.tenKhuTro}. Số tiền: ${new Intl.NumberFormat('vi-VN').format(room.giaPhong)} đ. Vui lòng đóng tiền đúng hạn.`,
                'dong_tien',
                room.maPhongTro
            );
            sentCount++;
        }

        res.json({ 
            success: true, 
            message: `Đã gửi ${sentCount} thông báo nhắc đóng tiền`,
            sentCount
        });

    } catch (error) {
        console.error('SendPaymentReminder error:', error);
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
    updatePaymentStatus,
    deletePhongTro,
    getLoaiPhong,
    addLoaiPhong,
    getYeuCauThue,
    updateYeuCauStatus,
    extendRental,
    checkExpiredRentals,
    sendPaymentReminder
};
