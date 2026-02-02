const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const phongtroRoutes = require('./routes/phongtro');
const landlordRoutes = require('./routes/landlord');
const messageRoutes = require('./routes/message');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notification');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files cho uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Static files cho images cũ (từ PHP)
app.use('/images', express.static(path.join(__dirname, '../images')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/phongtro', phongtroRoutes);
app.use('/api/landlord', landlordRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notification', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server đang chạy' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Lỗi server'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Không tìm thấy API'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    await testConnection();
});
