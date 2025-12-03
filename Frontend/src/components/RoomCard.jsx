import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaRuler, FaStar, FaClock } from 'react-icons/fa';
import '../styles/RoomCard.css';

const RoomCard = ({ room }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' đ/tháng';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'http://localhost:5000/images/default_images.jpg';
        // Nếu là đường dẫn tương đối cũ từ PHP
        if (imagePath.startsWith('../')) {
            return `http://localhost:5000${imagePath.replace('../', '/')}`;
        }
        // Nếu là đường dẫn từ uploads
        if (imagePath.startsWith('/uploads')) {
            return `http://localhost:5000${imagePath}`;
        }
        // Nếu là đường dẫn tuyệt đối
        return imagePath;
    };

    return (
        <Link to={`/phongtro/${room.maPhongTro}`} className="room-card">
            <div className="room-image">
                <img 
                    src={getImageUrl(room.anhDaiDien)} 
                    alt={room.tenKhuTro}
                    onError={(e) => e.target.src = 'http://localhost:5000/images/default_images.jpg'}
                />
                <span className={`status-badge ${room.tinhTrang === 'empty' ? 'available' : 'rented'}`}>
                    {room.tinhTrang === 'empty' ? 'Còn trống' : 'Đã thuê'}
                </span>
            </div>

            <div className="room-info">
                <div className="price-area">
                    <span className="price">{formatPrice(room.giaPhong)}</span>
                    <span className="area"><FaRuler /> {room.dienTich} m²</span>
                </div>

                <h3 className="room-title">{room.tenKhuTro}</h3>

                <p className="room-address">
                    <FaMapMarkerAlt />
                    {room.diaChi?.length > 50 ? room.diaChi.substring(0, 50) + '...' : room.diaChi}
                </p>

                <div className="room-meta">
                    <span className="rating">
                        <FaStar className="star" />
                        {room.diemTrungBinh?.toFixed(1) || '0.0'}
                        <small>({room.soLuongDanhGia || 0})</small>
                    </span>
                    <span className="date">
                        <FaClock /> {formatDate(room.ngayDang)}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default RoomCard;
