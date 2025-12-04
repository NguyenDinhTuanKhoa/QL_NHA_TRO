const { pool } = require('../config/database');

// Lấy danh sách cuộc hội thoại
const getConversations = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;

        const [rows] = await pool.query(`
            SELECT DISTINCT 
                nd.maNguoiDung as partnerId,
                nd.tenNguoiDung as partnerName,
                nd.vaiTro as partnerRole
            FROM tinnhan tn
            JOIN nguoidung nd ON nd.maNguoiDung = 
                CASE WHEN tn.maNguoiGui = ? THEN tn.maNguoiNhan ELSE tn.maNguoiGui END
            WHERE tn.maNguoiGui = ? OR tn.maNguoiNhan = ?
        `, [userId, userId, userId]);

        // Lấy tin nhắn cuối và số chưa đọc cho mỗi cuộc hội thoại
        for (let conv of rows) {
            const [lastMsg] = await pool.query(`
                SELECT noiDung, thoiGian FROM tinnhan 
                WHERE (maNguoiGui = ? AND maNguoiNhan = ?) OR (maNguoiGui = ? AND maNguoiNhan = ?)
                ORDER BY thoiGian DESC LIMIT 1
            `, [userId, conv.partnerId, conv.partnerId, userId]);

            const [unread] = await pool.query(`
                SELECT COUNT(*) as count FROM tinnhan 
                WHERE maNguoiGui = ? AND maNguoiNhan = ? AND daDoc = 0
            `, [conv.partnerId, userId]);

            conv.lastMessage = lastMsg[0]?.noiDung || '';
            conv.lastTime = lastMsg[0]?.thoiGian || null;
            conv.unreadCount = unread[0]?.count || 0;
        }

        // Sắp xếp theo thời gian tin nhắn cuối
        rows.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime));

        res.json({ success: true, data: rows });

    } catch (error) {
        console.error('GetConversations error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Lấy tin nhắn với một người
const getMessages = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;
        const { partnerId } = req.params;

        // Đánh dấu đã đọc
        await pool.query(`
            UPDATE tinnhan SET daDoc = 1 
            WHERE maNguoiGui = ? AND maNguoiNhan = ?
        `, [partnerId, userId]);

        // Lấy tin nhắn
        const [rows] = await pool.query(`
            SELECT tn.*, nd.tenNguoiDung as senderName
            FROM tinnhan tn
            JOIN nguoidung nd ON nd.maNguoiDung = tn.maNguoiGui
            WHERE (tn.maNguoiGui = ? AND tn.maNguoiNhan = ?) 
               OR (tn.maNguoiGui = ? AND tn.maNguoiNhan = ?)
            ORDER BY tn.thoiGian ASC
        `, [userId, partnerId, partnerId, userId]);

        // Lấy thông tin partner
        const [partner] = await pool.query(`
            SELECT maNguoiDung, tenNguoiDung, sdtNguoiDung, vaiTro 
            FROM nguoidung WHERE maNguoiDung = ?
        `, [partnerId]);

        res.json({
            success: true,
            data: {
                messages: rows,
                partner: partner[0] || null
            }
        });

    } catch (error) {
        console.error('GetMessages error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Gửi tin nhắn
const sendMessage = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;
        const { maNguoiNhan, noiDung, maPhongTro } = req.body;

        if (!maNguoiNhan || !noiDung) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin'
            });
        }

        await pool.query(`
            INSERT INTO tinnhan (maNguoiGui, maNguoiNhan, maPhongTro, noiDung) 
            VALUES (?, ?, ?, ?)
        `, [userId, maNguoiNhan, maPhongTro || null, noiDung]);

        res.status(201).json({
            success: true,
            message: 'Gửi tin nhắn thành công'
        });

    } catch (error) {
        console.error('SendMessage error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Gửi yêu cầu thuê phòng
const sendYeuCau = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;
        const { maPhongTro, ghiChu } = req.body;

        // Kiểm tra đã gửi yêu cầu chưa
        const [existing] = await pool.query(`
            SELECT * FROM yeucauthue 
            WHERE maNguoiThue = ? AND maPhongTro = ? AND trangThai = 'pending'
        `, [userId, maPhongTro]);

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã gửi yêu cầu cho phòng này rồi'
            });
        }

        await pool.query(`
            INSERT INTO yeucauthue (maNguoiThue, maPhongTro, ghiChu) 
            VALUES (?, ?, ?)
        `, [userId, maPhongTro, ghiChu || '']);

        res.status(201).json({
            success: true,
            message: 'Gửi yêu cầu thành công'
        });

    } catch (error) {
        console.error('SendYeuCau error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// Lấy yêu cầu của tôi
const getMyYeuCau = async (req, res) => {
    try {
        const userId = req.user.maNguoiDung;

        const [rows] = await pool.query(`
            SELECT yc.*, pt.maPhongTro, pt.dienTich, 
                   kt.tenKhuTro, kt.diaChi, kt.maNguoiDang as maChuTro,
                   lp.giaPhong, hp.anhDaiDien,
                   nd.tenNguoiDung as tenChuTro, nd.sdtNguoiDung as sdtChuTro
            FROM yeucauthue yc
            JOIN phongtro pt ON yc.maPhongTro = pt.maPhongTro
            JOIN khutro kt ON pt.maKhuTro = kt.maKhuTro
            JOIN loaiphong lp ON pt.maLoaiPhong = lp.maLoaiPhong
            LEFT JOIN hinhanhphong hp ON pt.maPhongTro = hp.maPhongTro
            LEFT JOIN nguoidung nd ON kt.maNguoiDang = nd.maNguoiDung
            WHERE yc.maNguoiThue = ?
            ORDER BY yc.ngayYeuCau DESC
        `, [userId]);

        res.json({ success: true, data: rows });

    } catch (error) {
        console.error('GetMyYeuCau error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

module.exports = {
    getConversations,
    getMessages,
    sendMessage,
    sendYeuCau,
    getMyYeuCau
};
