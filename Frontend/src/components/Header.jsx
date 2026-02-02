import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import '../styles/Header.css';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="header-container">
            <header className="header">
                <Link to="/" className="logo">
                    <img src="http://localhost:5000/images/logo.png" alt="Logo" />
                </Link>

                <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>TRANG CHỦ</Link>
                    <Link to="/phongtro" onClick={() => setMenuOpen(false)}>PHÒNG TRỌ</Link>
                    {isAuthenticated && user?.vaiTro === 'landlord' && (
                        <Link to="/landlord" onClick={() => setMenuOpen(false)}>QUẢN LÝ</Link>
                    )}
                    {!isAuthenticated && (
                        <Link to="/landlord" onClick={() => setMenuOpen(false)}>CHỦ TRỌ</Link>
                    )}
                </nav>

                <div className="auth-buttons">
                    {isAuthenticated ? (
                        <>
                            <NotificationBell />
                            <div className="user-menu">
                                <span className="user-name">
                                    <FaUser /> <span className="user-name-text">{user?.tenNguoiDung}</span>
                                </span>
                            <div className="user-dropdown">
                                <Link to="/my-requests">Yêu cầu của tôi</Link>
                                <Link to="/my-rentals">Phòng đã thuê</Link>
                                <Link to="/messages">Tin nhắn</Link>
                                {user?.vaiTro === 'admin' && (
                                    <Link to="/admin" className="admin-link">Trang Admin</Link>
                                )}
                                <button onClick={handleLogout} className="dropdown-logout">
                                    <FaSignOutAlt /> Đăng xuất
                                </button>
                            </div>
                        </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-login">Đăng nhập</Link>
                            <Link to="/register" className="btn-register">Đăng ký</Link>
                        </>
                    )}
                </div>

                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </header>
        </div>
    );
};

export default Header;
