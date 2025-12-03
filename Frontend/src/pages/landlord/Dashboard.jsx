import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaDoorOpen, FaCheckCircle, FaBell, FaPlus } from 'react-icons/fa';
import { landlordAPI } from '../../services/api';
import '../../styles/landlord/Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalKhuTro: 0,
        totalPhongTro: 0,
        totalPhongTrong: 0,
        totalYeuCauMoi: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await landlordAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="dashboard-page">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon blue"><FaBuilding /></div>
                    <div className="stat-info">
                        <h3>{stats.totalKhuTro}</h3>
                        <p>Khu trọ</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green"><FaDoorOpen /></div>
                    <div className="stat-info">
                        <h3>{stats.totalPhongTro}</h3>
                        <p>Tổng phòng</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange"><FaCheckCircle /></div>
                    <div className="stat-info">
                        <h3>{stats.totalPhongTrong}</h3>
                        <p>Phòng trống</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple"><FaBell /></div>
                    <div className="stat-info">
                        <h3>{stats.totalYeuCauMoi}</h3>
                        <p>Yêu cầu mới</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2>Thao tác nhanh</h2>
                <div className="actions-grid">
                    <Link to="/landlord/add-room" className="action-card">
                        <FaPlus />
                        <span>Đăng tin mới</span>
                    </Link>
                    <Link to="/landlord/rooms" className="action-card">
                        <FaDoorOpen />
                        <span>Quản lý phòng</span>
                    </Link>
                    <Link to="/landlord/requests" className="action-card">
                        <FaBell />
                        <span>Xem yêu cầu</span>
                    </Link>
                </div>
            </div>

            <div className="guide-section">
                <h2>Hướng dẫn nhanh</h2>
                <div className="guide-steps">
                    <div className="guide-step">
                        <span className="step-number">1</span>
                        <div>
                            <h4>Tạo khu trọ</h4>
                            <p>Thêm thông tin khu trọ của bạn</p>
                        </div>
                    </div>
                    <div className="guide-step">
                        <span className="step-number">2</span>
                        <div>
                            <h4>Đăng tin phòng</h4>
                            <p>Thêm phòng trọ với hình ảnh và mô tả</p>
                        </div>
                    </div>
                    <div className="guide-step">
                        <span className="step-number">3</span>
                        <div>
                            <h4>Nhận yêu cầu</h4>
                            <p>Xem và phản hồi yêu cầu thuê phòng</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
