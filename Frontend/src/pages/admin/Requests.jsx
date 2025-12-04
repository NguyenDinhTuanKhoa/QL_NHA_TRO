import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await adminAPI.getRequests();
            setRequests(res.data.data);
        } catch (error) {
            toast.error('Không thể tải danh sách yêu cầu');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { label: 'Chờ duyệt', class: 'pending' },
            'approved': { label: 'Đã duyệt', class: 'approved' },
            'rejected': { label: 'Từ chối', class: 'rejected' }
        };
        const s = statusMap[status] || { label: status, class: 'pending' };
        return <span className={`status-badge ${s.class}`}>{s.label}</span>;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="admin-requests">
            <div className="admin-table-container">
                <div className="admin-table-header">
                    <h2>Danh sách yêu cầu thuê ({requests.length})</h2>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Người thuê</th>
                            <th>SĐT</th>
                            <th>Phòng</th>
                            <th>Giá thuê</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.maYeuCau}>
                                <td>{req.maYeuCau}</td>
                                <td>{req.tenNguoiDung}</td>
                                <td>{req.soDienThoai}</td>
                                <td>{req.tenPhong}</td>
                                <td>{formatPrice(req.giaThue)}</td>
                                <td>{getStatusBadge(req.trangThai)}</td>
                                <td>{new Date(req.ngayTao).toLocaleDateString('vi-VN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRequests;
