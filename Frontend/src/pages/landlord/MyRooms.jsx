import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSyncAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { landlordAPI } from '../../services/api';
import '../../styles/landlord/MyRooms.css';

const MyRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRooms();
    }, []);

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
        <div className="my-rooms-page">
            <div className="page-header">
                <Link to="/landlord/add-room" className="btn-add">
                    <FaPlus /> Đăng tin mới
                </Link>
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
                                <div className="room-actions">
                                    <button className="btn-edit" title="Sửa">
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="btn-toggle" 
                                        title="Đổi trạng thái"
                                        onClick={() => handleToggleStatus(room.maPhongTro, room.tinhTrang)}
                                    >
                                        <FaSyncAlt />
                                    </button>
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
        </div>
    );
};

export default MyRooms;
