import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await login(formData.username, formData.password);
            toast.success('Đăng nhập thành công!');
            
            // Chuyển hướng theo vai trò
            if (result.user.vaiTro === 'landlord') {
                navigate('/landlord');
            } else {
                navigate(from);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Đăng Nhập</h2>
                <p className="auth-subtitle">Chào mừng bạn quay trở lại!</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label><FaUser /> Tên đăng nhập</label>
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
                        <label><FaLock /> Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        <FaSignInAlt /> {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
