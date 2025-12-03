const jwt = require('jsonwebtoken');

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Vui lòng đăng nhập' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Token không hợp lệ hoặc đã hết hạn' 
            });
        }
        req.user = user;
        next();
    });
};

// Middleware kiểm tra vai trò
const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Vui lòng đăng nhập' 
            });
        }

        if (!roles.includes(req.user.vaiTro)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Bạn không có quyền truy cập' 
            });
        }
        next();
    };
};

// Middleware tùy chọn - không bắt buộc đăng nhập
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
            }
        });
    }
    next();
};

module.exports = { authenticateToken, checkRole, optionalAuth };
