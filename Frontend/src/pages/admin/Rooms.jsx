import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await adminAPI.getRooms();
            setRooms(res.data.data);
        } catch (error) {
            toast.error('Không thể tải danh sách phòng');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await adminAPI.updateRoomStatus(id, { trangThai: newStatus });
            toast.success('Cập nhật trạng thái thành công');
            fetchRooms();
        } catch (error) {
            toast.error('Lỗi khi cập nhật');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa phòng này?')) return;
        try {
            await adminAPI.deleteRoom(id);
            toast.success('Xóa phòng thành công');
            fetchRooms();
        } catch (error) {
            toast.error('Lỗi khi xóa');
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'available': { label: 'Còn trống', class: 'active' },
            'empty': { label: 'Còn trống', class: 'active' },
            'rented': { label: 'Đã thuê', class: 'pending' },
            'maintenance': { label: 'Bảo trì', class: 'inactive' }
        };
        const s = statusMap[status] || { label: status, class: 'pending' };
        return <span className={`status-badge ${s.class}`}>{s.label}</span>;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="admin-rooms">
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h2>Danh sách phòng trọ ({rooms.length})</h2>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên phòng</th>
                            <th>Khu trọ</th>
                            <th>Chủ trọ</th>
                            <th>Giá thuê</th>
                            <th>Diện tích</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.maPhong}>
                                <td>{room.maPhong}</td>
                                <td>{room.tenPhong}</td>
                                <td>{room.tenKhuTro || 'N/A'}</td>
                                <td>{room.tenChuTro || 'N/A'}</td>
                                <td>{formatPrice(room.giaThue)}</td>
                                <td>{room.dienTich} m²</td>
                                <td>{getStatusBadge(room.trangThai)}</td>
                                <td>
                                    <select 
                                        value={room.trangThai === 'empty' ? 'available' : room.trangThai}
                                        onChange={(e) => handleStatusChange(room.maPhong, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="available">Còn trống</option>
                                        <option value="rented">Đã thuê</option>
                                    </select>
                                    <button 
                                        className="action-btn delete"
                                        onClick={() => handleDelete(room.maPhong)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRooms;
