const { pool } = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Đăng ký
const register = async (req, res) => {
    try {
        const { fullname, username, password, email, phone, vaiTro } = req.body;

        // Kiểm tra dữ liệu
        if (!fullname || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        // Kiểm tra username đã tồn tại
        const [existing] = await pool.query(
            'SELECT * FROM nguoidung WHERE tenDangNhap = ?',
            [username]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập đã tồn tại'
            });
        }

        // Tạo mã người dùng mới
        const [maxId] = await pool.query(
            "SELECT MAX(CAST(SUBSTRING(maNguoiDung, 3) AS UNSIGNED)) as maxId FROM nguoidung"
        );
        const nextId = (maxId[0].maxId || 0) + 1;
        const maNguoiDung = 'ND' + String(nextId).padStart(5, '0');

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm người dùng
        const role = vaiTro === 'landlord' ? 'landlord' : 'user';
        await pool.query(
            `INSERT INTO nguoidung (maNguoiDung, tenNguoiDung, matKhau, tenDangNhap, sdtNguoiDung, emailNguoiDung, vaiTro) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [maNguoiDung, fullname, hashedPassword, username, phone || '', email || '', role]
        );

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công'
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
};

// Đăng nhập
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập tên đăng nhập và mật khẩu'
            });
        }

        // Tìm user
        const [users] = await pool.query(
            'SELECT * FROM nguoidung WHERE tenDangNhap = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        const user = users[0];

        // Kiểm tra password (hỗ trợ cả password cũ chưa hash)
        let isValidPassword = false;
        if (user.matKhau.startsWith('$2')) {
            isValidPassword = await bcrypt.compare(password, user.matKhau);
        } else {
            isValidPassword = password === user.matKhau;
        }

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            {
                maNguoiDung: user.maNguoiDung,
                tenNguoiDung: user.tenNguoiDung,
                tenDangNhap: user.tenDangNhap,
                vaiTro: user.vaiTro
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            user: {
                maNguoiDung: user.maNguoiDung,
                tenNguoiDung: user.tenNguoiDung,
                tenDangNhap: user.tenDangNhap,
                email: user.emailNguoiDung,
                phone: user.sdtNguoiDung,
                vaiTro: user.vaiTro
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
};

// Lấy thông tin user hiện tại
const getMe = async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT maNguoiDung, tenNguoiDung, tenDangNhap, emailNguoiDung, sdtNguoiDung, vaiTro FROM nguoidung WHERE maNguoiDung = ?',
            [req.user.maNguoiDung]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
};

module.exports = { register, login, getMe };
