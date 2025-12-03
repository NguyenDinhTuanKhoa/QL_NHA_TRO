import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaUserPlus, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        vaiTro: 'user'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await register(formData);
            toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card register-card">
                <h2>Đăng Ký Tài Khoản</h2>
                <p className="auth-subtitle">Tạo tài khoản để sử dụng đầy đủ tính năng</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><FaUser /> Họ và tên *</label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaUser /> Tên đăng nhập *</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaLock /> Mật khẩu *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><FaEnvelope /> Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                        />
                    </div>

                    <div className="form-group">
                        <label><FaPhone /> Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            pattern="[0-9]{10}"
                        />
                    </div>

                    <div className="form-group">
                        <label>Bạn là *</label>
                        <div className="role-selection">
                            <label className={`role-option ${formData.vaiTro === 'user' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="vaiTro"
                                    value="user"
                                    checked={formData.vaiTro === 'user'}
                                    onChange={handleChange}
                                />
                                <div className="role-card">
                                    <FaUser />
                                    <strong>Người tìm trọ</strong>
                                    <small>Tìm kiếm và thuê phòng</small>
                                </div>
                            </label>
                            <label className={`role-option ${formData.vaiTro === 'landlord' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="vaiTro"
                                    value="landlord"
                                    checked={formData.vaiTro === 'landlord'}
                                    onChange={handleChange}
                                />
                                <div className="role-card">
                                    <FaHome />
                                    <strong>Chủ trọ</strong>
                                    <small>Đăng tin cho thuê</small>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        <FaUserPlus /> {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
