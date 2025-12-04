import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        tenNguoiDung: '',
        tenDangNhap: '',
        matKhau: '',
        emailNguoiDung: '',
        sdtNguoiDung: '',
        vaiTro: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await adminAPI.getUsers();
            setUsers(res.data.data);
        } catch (error) {
            toast.error('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openAddModal = () => {
        setEditingUser(null);
        setFormData({
            tenNguoiDung: '',
            tenDangNhap: '',
            matKhau: '',
            emailNguoiDung: '',
            sdtNguoiDung: '',
            vaiTro: 'user'
        });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            tenNguoiDung: user.tenNguoiDung || '',
            tenDangNhap: user.tenDangNhap || '',
            matKhau: '',
            emailNguoiDung: user.email || '',
            sdtNguoiDung: user.soDienThoai || '',
            vaiTro: user.vaiTro || 'user'
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await adminAPI.updateUser(editingUser.maNguoiDung, formData);
                toast.success('Cập nhật người dùng thành công');
            } else {
                await adminAPI.addUser(formData);
                toast.success('Thêm người dùng thành công');
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await adminAPI.updateUserRole(id, { vaiTro: newRole });
            toast.success('Cập nhật vai trò thành công');
            fetchUsers();
        } catch (error) {
            toast.error('Lỗi khi cập nhật');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;
        try {
            await adminAPI.deleteUser(id);
            toast.success('Xóa người dùng thành công');
            fetchUsers();
        } catch (error) {
            toast.error('Lỗi khi xóa');
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="admin-users">
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h2>Danh sách người dùng ({users.length})</h2>
                    <button className="btn-add" onClick={openAddModal}>
                        <FaPlus /> Thêm người dùng
                    </button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>SĐT</th>
                            <th>Vai trò</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.maNguoiDung}>
                                <td>{user.maNguoiDung}</td>
                                <td>{user.tenNguoiDung}</td>
                                <td>{user.email}</td>
                                <td>{user.soDienThoai}</td>
                                <td>
                                    <select 
                                        value={user.vaiTro} 
                                        onChange={(e) => handleRoleChange(user.maNguoiDung, e.target.value)}
                                        className="role-select"
                                    >
                                        <option value="user">Người dùng</option>
                                        <option value="landlord">Chủ trọ</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>{user.ngayTao ? new Date(user.ngayTao).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                <td>
                                    <button className="action-btn edit" onClick={() => openEditModal(user)}>
                                        <FaEdit />
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDelete(user.maNguoiDung)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Thêm/Sửa */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Họ tên *</label>
                                <input
                                    type="text"
                                    name="tenNguoiDung"
                                    value={formData.tenNguoiDung}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Tên đăng nhập *</label>
                                <input
                                    type="text"
                                    name="tenDangNhap"
                                    value={formData.tenDangNhap}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!!editingUser}
                                />
                            </div>
                            <div className="form-group">
                                <label>{editingUser ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu *'}</label>
                                <input
                                    type="password"
                                    name="matKhau"
                                    value={formData.matKhau}
                                    onChange={handleInputChange}
                                    required={!editingUser}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="emailNguoiDung"
                                    value={formData.emailNguoiDung}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    name="sdtNguoiDung"
                                    value={formData.sdtNguoiDung}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Vai trò</label>
                                <select name="vaiTro" value={formData.vaiTro} onChange={handleInputChange}>
                                    <option value="user">Người dùng</option>
                                    <option value="landlord">Chủ trọ</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="btn-submit">
                                    {editingUser ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
