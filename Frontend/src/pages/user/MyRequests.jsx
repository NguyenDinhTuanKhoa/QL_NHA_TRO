import React, { useState, useEffect } from 'react';
import { FaClock, FaCheck, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { messageAPI } from '../../services/api';
import '../../styles/MyRequests.css';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await messageAPI.getMyYeuCau();
            setRequests(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="badge pending"><FaClock /> Chờ duyệt</span>;
            case 'approved':
                return <span className="badge approved"><FaCheck /> Đã duyệt</span>;
            case 'rejected':
                return <span className="badge rejected"><FaTimes /> Từ chối</span>;
            default:
                return null;
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'http://localhost:5000/images/default_images.jpg';
        if (imagePath.startsWith('../')) {
            return `http://localhost:5000${imagePath.replace('../', '/')}`;
        }
        if (imagePath.startsWith('/uploads')) {
            return `http://localhost:5000${imagePath}`;
        }
        return imagePath;
    };

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="my-requests-page">
            <h1>Yêu cầu thuê phòng của tôi</h1>

            {requests.length === 0 ? (
                <div className="empty-state">
                    <p>Bạn chưa gửi yêu cầu thuê phòng nào</p>
                </div>
            ) : (
                <div className="requests-list">
                    {requests.map(req => (
                        <div key={req.maYeuCau} className={`request-card ${req.trangThai}`}>
                            <div className="request-image">
                                <img src={getImageUrl(req.anhDaiDien)} alt="" />
                            </div>
                            <div className="request-info">
                                <h3>{req.tenKhuTro}</h3>
                                <p className="address"><FaMapMarkerAlt /> {req.diaChi}</p>
                                <p className="details">
                                    {req.dienTich} m² - <strong>{formatPrice(req.giaPhong)} đ/tháng</strong>
                                </p>
                                {req.ghiChu && <p className="note">Ghi chú: {req.ghiChu}</p>}
                            </div>
                            <div className="request-status">
                                {getStatusBadge(req.trangThai)}
                                <small>{new Date(req.ngayYeuCau).toLocaleDateString('vi-VN')}</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRequests;
