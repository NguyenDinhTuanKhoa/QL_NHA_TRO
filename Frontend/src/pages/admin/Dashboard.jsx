import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserTie, FaHome, FaClipboardList, FaClock } from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalLandlords: 0,
        totalRooms: 0,
        totalRequests: 0,
        pendingRequests: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await adminAPI.getStats();
            setStats(res.data.data);
        } catch (error) {
            toast.error('Không thể tải thống kê');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-stats">
                <div className="stat-card">
                    <div className="stat-icon users">
                        <FaUsers />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Tổng người dùng</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon landlords">
                        <FaUserTie />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalLandlords}</h3>
                        <p>Chủ trọ</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon rooms">
                        <FaHome />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalRooms}</h3>
                        <p>Phòng trọ</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon requests">
                        <FaClipboardList />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalRequests}</h3>
                        <p>Tổng yêu cầu</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon pending">
                        <FaClock />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.pendingRequests}</h3>
                        <p>Yêu cầu chờ duyệt</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
