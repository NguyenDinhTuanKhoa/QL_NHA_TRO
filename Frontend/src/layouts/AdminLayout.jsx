import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaHome, FaClipboardList, FaSignOutAlt, FaGlobe, FaBars, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminLayout.css';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { path: '/admin', icon: <FaTachometerAlt />, label: 'Tổng quan' },
        { path: '/admin/users', icon: <FaUsers />, label: 'Quản lý người dùng' },
        { path: '/admin/rooms', icon: <FaHome />, label: 'Quản lý phòng trọ' },
        { path: '/admin/requests', icon: <FaClipboardList />, label: 'Yêu cầu thuê' }
    ];

    return (
        <div className="admin-layout">
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <FaShieldAlt className="admin-icon" />
                    <h2>Admin Panel</h2>
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

            <main className="admin-main">
                <header className="admin-header">
                    <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <FaBars />
                    </button>
                    <h1>{menuItems.find(m => m.path === location.pathname)?.label || 'Tổng quan'}</h1>
                    <span className="current-date">
                        {new Date().toLocaleDateString('vi-VN')}
                    </span>
                </header>

                <div className="admin-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
