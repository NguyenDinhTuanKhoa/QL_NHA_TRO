import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaComments, FaUser, FaCalendarAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { messageAPI } from '../../services/api';
import '../../styles/MyRentals.css';

const MyRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            const response = await messageAPI.getMyYeuCau();
            // Lọc chỉ lấy các yêu cầu đã được duyệt
            const approvedRentals = response.data.data.filter(r => r.trangThai === 'approved');
            setRentals(approvedRentals);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price);

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const isExpired = (dateString) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    const isSameDate = (date1, date2) => {
        if (!date1 || !date2) return false;
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.toDateString() === d2.toDateString();
    };

    const getDaysUntilExpiry = (startDate, endDate) => {
        if (!endDate) return null;
        const start = startDate ? new Date(startDate) : new Date();
        const end = new Date(endDate);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

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
        <div className="my-rentals-page">
            <h1>Phòng trọ đã thuê</h1>

            {rentals.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🏠</div>
                    <h3>Chưa có phòng trọ nào</h3>
                    <p>Các phòng trọ bạn đã thuê thành công sẽ hiển thị ở đây</p>
                    <Link to="/phongtro" className="btn-browse">Tìm phòng trọ</Link>
                </div>
            ) : (
                <div className="rentals-grid">
                    {rentals.map(rental => (
                        <div key={rental.maYeuCau} className="rental-card">
                            <div className="rental-image">
                                <img src={getImageUrl(rental.anhDaiDien)} alt={rental.tenKhuTro} />
                                <span className="rental-badge">Đang thuê</span>
                                <span className={`payment-badge ${rental.trangThaiDongTien === 'da_dong' ? 'paid' : 'unpaid'}`}>
                                    <FaMoneyBillWave /> {rental.trangThaiDongTien === 'da_dong' ? 'Đã đóng tiền' : 'Chưa đóng tiền'}
                                </span>
                            </div>
                            
                            <div className="rental-content">
                                <h3>{rental.tenKhuTro}</h3>
                                <p className="rental-address">
                                    <FaMapMarkerAlt /> {rental.diaChi}
                                </p>
                                <div className="rental-details">
                                    <span className="rental-area">{rental.dienTich} m²</span>
                                    <span className="rental-price">{formatPrice(rental.giaPhong)} đ/tháng</span>
                                </div>
                                
                                <div className="rental-landlord">
                                    <div className="landlord-info">
                                        <FaUser className="landlord-icon" />
                                        <div>
                                            <strong>{rental.tenChuTro || 'Chủ trọ'}</strong>
                                            {rental.sdtChuTro && (
                                                <p><FaPhone /> {rental.sdtChuTro}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="rental-dates-info">
                                    <div className="rental-date">
                                        <FaCalendarAlt /> Thuê từ: {formatDate(rental.ngayBatDauThue)}
                                    </div>
                                    {rental.ngayHetHan && (
                                        <div className={`rental-expiry ${isSameDate(rental.ngayBatDauThue, rental.ngayHetHan) || isExpired(rental.ngayHetHan) ? 'expired' : getDaysUntilExpiry(rental.ngayBatDauThue, rental.ngayHetHan) <= 7 ? 'warning' : ''}`}>
                                            <FaClock /> 
                                            {isSameDate(rental.ngayBatDauThue, rental.ngayHetHan)
                                                ? `Hết hạn: ${formatDate(rental.ngayHetHan)} (còn 0 ngày)`
                                                : isExpired(rental.ngayHetHan) 
                                                    ? `Đã hết hạn (${formatDate(rental.ngayHetHan)})` 
                                                    : `Hết hạn: ${formatDate(rental.ngayHetHan)} (còn ${getDaysUntilExpiry(rental.ngayBatDauThue, rental.ngayHetHan)} ngày)`
                                            }
                                        </div>
                                    )}
                                </div>

                                <div className="rental-actions">
                                    <Link 
                                        to={`/messages?partner=${rental.maChuTro}`} 
                                        className="btn-contact"
                                    >
                                        <FaComments /> Nhắn tin chủ trọ
                                    </Link>
                                    <Link 
                                        to={`/phongtro/${rental.maPhongTro}`} 
                                        className="btn-view"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRentals;
