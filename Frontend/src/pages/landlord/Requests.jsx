import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaCheck, FaTimes, FaComments, FaUser, FaPhone, FaEnvelope, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { landlordAPI } from '../../services/api';
import '../../styles/landlord/Requests.css';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await landlordAPI.getYeuCau();
            setRequests(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        const confirmMsg = status === 'approved' ? 'Duyệt yêu cầu này?' : 'Từ chối yêu cầu này?';
        if (!window.confirm(confirmMsg)) return;

        try {
            await landlordAPI.updateYeuCau(id, { trangThai: status });
            toast.success(status === 'approved' ? 'Đã duyệt yêu cầu' : 'Đã từ chối yêu cầu');
            fetchRequests();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);

    const stats = {
        pending: requests.filter(r => r.trangThai === 'pending').length,
        approved: requests.filter(r => r.trangThai === 'approved').length,
        rejected: requests.filter(r => r.trangThai === 'rejected').length
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="requests-page">
            <div className="stats-row">
                <div className="stat-item pending">
                    <span className="stat-number">{stats.pending}</span>
                    <span className="stat-label">Chờ duyệt</span>
                </div>
                <div className="stat-item approved">
                    <span className="stat-number">{stats.approved}</span>
                    <span className="stat-label">Đã duyệt</span>
                </div>
                <div className="stat-item rejected">
                    <span className="stat-number">{stats.rejected}</span>
                    <span className="stat-label">Từ chối</span>
                </div>
            </div>

            {requests.length === 0 ? (
                <div className="empty-state">
                    <h3>Chưa có yêu cầu thuê phòng</h3>
                    <p>Các yêu cầu từ người thuê sẽ hiển thị ở đây</p>
                </div>
            ) : (
                <div className="requests-list">
                    {requests.map(req => (
                        <div key={req.maYeuCau} className={`request-card ${req.trangThai}`}>
                            <div className="request-header">
                                <div className="status-badge">
                                    {req.trangThai === 'pending' && <span className="badge pending"><FaClock /> Chờ duyệt</span>}
                                    {req.trangThai === 'approved' && <span className="badge approved"><FaCheck /> Đã duyệt</span>}
                                    {req.trangThai === 'rejected' && <span className="badge rejected"><FaTimes /> Từ chối</span>}
                                </div>
                                <span className="request-date">
                                    {new Date(req.ngayYeuCau).toLocaleString('vi-VN')}
                                </span>
                            </div>

                            <div className="request-body">
                                <div className="room-info">
                                    <h4><FaHome /> {req.tenKhuTro}</h4>
                                    <p>{req.diaChi}</p>
                                    <p>{req.dienTich} m² - <strong>{formatPrice(req.giaPhong)} đ/tháng</strong></p>
                                </div>

                                <div className="tenant-info">
                                    <h4><FaUser /> Thông tin người thuê</h4>
                                    <p><strong>{req.tenNguoiDung}</strong></p>
                                    <p><FaPhone /> {req.sdtNguoiDung}</p>
                                    {req.emailNguoiDung && <p><FaEnvelope /> {req.emailNguoiDung}</p>}
                                </div>

                                {req.ghiChu && (
                                    <div className="request-note">
                                        <h4>Ghi chú</h4>
                                        <p>{req.ghiChu}</p>
                                    </div>
                                )}
                            </div>

                            {req.trangThai === 'pending' && (
                                <div className="request-actions">
                                    <button 
                                        className="btn-approve"
                                        onClick={() => handleUpdateStatus(req.maYeuCau, 'approved')}
                                    >
                                        <FaCheck /> Duyệt
                                    </button>
                                    <button 
                                        className="btn-reject"
                                        onClick={() => handleUpdateStatus(req.maYeuCau, 'rejected')}
                                    >
                                        <FaTimes /> Từ chối
                                    </button>
                                    <Link to={`/landlord/messages?partner=${req.maNguoiThue}`} className="btn-chat">
                                        <FaComments /> Nhắn tin
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Requests;
