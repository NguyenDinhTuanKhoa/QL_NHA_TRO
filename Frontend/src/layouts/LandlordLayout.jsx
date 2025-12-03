import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaHome, FaPlusCircle, FaClipboardList, FaComments, FaSignOutAlt, FaGlobe, FaBars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/LandlordLayout.css';

const LandlordLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { path: '/landlord', icon: <FaTachometerAlt />, label: 'Tổng quan' },
        { path: '/landlord/rooms', icon: <FaHome />, label: 'Quản lý phòng' },
        { path: '/landlord/add-room', icon: <FaPlusCircle />, label: 'Đăng tin mới' },
        { path: '/landlord/requests', icon: <FaClipboardList />, label: 'Yêu cầu thuê' },
        { path: '/landlord/messages', icon: <FaComments />, label: 'Tin nhắn' }
    ];

    return (
        <div className="landlord-layout">
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <img src="http://localhost:5000/images/logo.png" alt="Logo" className="sidebar-logo" />
                    <h2>Chủ Trọ</h2>
                </div>

                <div className="user-box">
                    <i className="fas fa-user-circle"></i>
                    <span>{user?.tenNguoiDung}</span>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={location.pathname === item.path ? 'active' : ''}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.icon} {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="btn-back">
                        <FaGlobe /> Xem trang web
                    </Link>
                    <button onClick={handleLogout} className="btn-logout">
                        <FaSignOutAlt /> Đăng xuất
                    </button>
                </div>
            </aside>

            <main className="landlord-main">
                <header className="landlord-header">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <FaBars />
                    </button>
                    <h1>{menuItems.find(m => m.path === location.pathname)?.label || 'Tổng quan'}</h1>
                    <span className="current-date">
                        {new Date().toLocaleDateString('vi-VN')}
                    </span>
                </header>

                <div className="landlord-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default LandlordLayout;
