import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarPlus, FaBell, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { landlordAPI } from '../../services/api';
import '../../styles/landlord/MyRooms.css';

const MyRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showExtendModal, setShowExtendModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [extendMonths, setExtendMonths] = useState(1);

    useEffect(() => {
        fetchRooms();
        checkExpiredRooms();
    }, []);

    const checkExpiredRooms = async () => {
        try {
            await landlordAPI.checkExpired();
        } catch (error) {
            console.error('Check expired error:', error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await landlordAPI.getPhongTro();
            setRooms(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'empty' ? 'rented' : 'empty';
            await landlordAPI.updateStatus(id, { tinhTrang: newStatus });
            toast.success('Cập nhật trạng thái thành công');
            fetchRooms();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleTogglePayment = async (id, currentPaymentStatus) => {
        try {
            const newStatus = currentPaymentStatus === 'da_dong' ? 'chua_dong' : 'da_dong';
            await landlordAPI.updatePaymentStatus(id, { trangThaiDongTien: newStatus });
            toast.success(newStatus === 'da_dong' ? 'Đã xác nhận đóng tiền' : 'Đã đánh dấu chưa đóng tiền');
            fetchRooms();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa phòng này?')) return;
        try {
            await landlordAPI.deletePhongTro(id);
            toast.success('Xóa phòng thành công');
            fetchRooms();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleExtendClick = (room) => {
        setSelectedRoom(room);
        setExtendMonths(1);
        setShowExtendModal(true);
    };

    const handleExtendSubmit = async () => {
        if (!selectedRoom) return;
        try {
            await landlordAPI.extendRental(selectedRoom.maPhongTro, { soThang: extendMonths });
            toast.success(`Gia hạn thêm ${extendMonths} tháng thành công`);
            setShowExtendModal(false);
            setSelectedRoom(null);
            fetchRooms();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi gia hạn');
        }
    };

    const handleSendReminder = async () => {
        try {
            const response = await landlordAPI.sendPaymentReminder();
            toast.success(response.data.message);
        } catch (error) {
            toast.error('Có lỗi xảy ra');
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
        <div className="my-rooms-page">
            <div className="page-header">
                <Link to="/landlord/add-room" className="btn-add">
                    <FaPlus /> Đăng tin mới
                </Link>
                <button className="btn-reminder" onClick={handleSendReminder}>
                    <FaBell /> Gửi nhắc đóng tiền
                </button>
            </div>

            {rooms.length === 0 ? (
                <div className="empty-state">
                    <h3>Chưa có phòng trọ nào</h3>
                    <p>Bắt đầu đăng tin để tiếp cận khách thuê</p>
                    <Link to="/landlord/add-room" className="btn-primary">
                        <FaPlus /> Đăng tin ngay
                    </Link>
                </div>
            ) : (
                <div className="rooms-grid">
                    {rooms.map(room => (
                        <div key={room.maPhongTro} className="room-card">
                            <div className="room-image">
                                <img src={getImageUrl(room.anhDaiDien)} alt="" />
                                <span className={`status ${room.tinhTrang}`}>
                                    {room.tinhTrang === 'empty' ? 'Còn trống' : 'Đã thuê'}
                                </span>
                                {room.tinhTrang === 'rented' && (
                                    <>
                                        <span className={`payment-status ${room.trangThaiDongTien || 'chua_dong'}`}>
                                            {room.trangThaiDongTien === 'da_dong' ? '💰 Đã đóng tiền' : '⚠️ Chưa đóng tiền'}
                                        </span>
                                        {room.ngayHetHan && (
                                            <span className={`expiry-status ${isSameDate(room.ngayBatDauThue, room.ngayHetHan) || isExpired(room.ngayHetHan) ? 'expired' : getDaysUntilExpiry(room.ngayBatDauThue, room.ngayHetHan) <= 7 ? 'warning' : ''}`}>
                                                <FaClock /> {isSameDate(room.ngayBatDauThue, room.ngayHetHan) ? 'Còn 0 ngày' : isExpired(room.ngayHetHan) ? 'Đã hết hạn' : `Còn ${getDaysUntilExpiry(room.ngayBatDauThue, room.ngayHetHan)} ngày`}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="room-info">
                                <h3>{room.tenKhuTro}</h3>
                                <p className="address">
                                    <FaMapMarkerAlt />
                                    {room.diaChi?.substring(0, 40)}...
                                </p>
                                <div className="room-details">
                                    <span>{room.dienTich} m²</span>
                                    <span>{room.tenLoaiPhong}</span>
                                </div>
                                <p className="price">{formatPrice(room.giaPhong)} đ/tháng</p>
                                {room.tinhTrang === 'rented' && (
                                    <div className="rental-info">
                                        {room.tenNguoiThue && (
                                            <p className="tenant-name">👤 {room.tenNguoiThue}</p>
                                        )}
                                        <p className="rental-dates">
                                            📅 Thuê: {formatDate(room.ngayBatDauThue)} - {formatDate(room.ngayHetHan)}
                                        </p>
                                    </div>
                                )}
                                <div className="room-actions">
                                    <button className="btn-edit" title="Sửa">
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="btn-toggle" 
                                        title="Đổi trạng thái phòng"
                                        onClick={() => handleToggleStatus(room.maPhongTro, room.tinhTrang)}
                                    >
                                        <FaSyncAlt />
                                    </button>
                                    {room.tinhTrang === 'rented' && (
                                        <>
                                            <button 
                                                className={`btn-payment ${room.trangThaiDongTien === 'da_dong' ? 'paid' : 'unpaid'}`}
                                                title={room.trangThaiDongTien === 'da_dong' ? 'Đánh dấu chưa đóng' : 'Xác nhận đã đóng tiền'}
                                                onClick={() => handleTogglePayment(room.maPhongTro, room.trangThaiDongTien)}
                                            >
                                                <FaMoneyBillWave />
                                            </button>
                                            <button 
                                                className="btn-extend"
                                                title="Gia hạn thuê"
                                                onClick={() => handleExtendClick(room)}
                                            >
                                                <FaCalendarPlus />
                                            </button>
                                        </>
                                    )}
                                    <button 
                                        className="btn-delete" 
                                        title="Xóa"
                                        onClick={() => handleDelete(room.maPhongTro)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal gia hạn */}
            {showExtendModal && selectedRoom && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Gia hạn thuê phòng</h3>
                        <p><strong>Phòng:</strong> {selectedRoom.tenLoaiPhong} - {selectedRoom.tenKhuTro}</p>
                        <p><strong>Người thuê:</strong> {selectedRoom.tenNguoiThue || 'Chưa xác định'}</p>
                        <p><strong>Ngày hết hạn hiện tại:</strong> {formatDate(selectedRoom.ngayHetHan)}</p>
                        
                        <div className="form-group">
                            <label>Số tháng gia hạn:</label>
                            <select 
                                value={extendMonths} 
                                onChange={(e) => setExtendMonths(Number(e.target.value))}
                            >
                                {[1, 2, 3, 6, 12].map(m => (
                                    <option key={m} value={m}>{m} tháng</option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowExtendModal(false)}>
                                Hủy
                            </button>
                            <button className="btn-confirm" onClick={handleExtendSubmit}>
                                Xác nhận gia hạn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRooms;
