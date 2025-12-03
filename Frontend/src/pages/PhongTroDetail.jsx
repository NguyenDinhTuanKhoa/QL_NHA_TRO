import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaRuler, FaUser, FaPhone, FaStar, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { phongtroAPI, messageAPI } from '../services/api';
import '../styles/PhongTroDetail.css';

const PhongTroDetail = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewForm, setReviewForm] = useState({ diemSo: 5, nhanXet: '' });
    const [requestNote, setRequestNote] = useState('');

    useEffect(() => {
        fetchRoom();
    }, [id]);

    const fetchRoom = async () => {
        try {
            const response = await phongtroAPI.getById(id);
            setRoom(response.data.data);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Không tìm thấy phòng trọ');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.warning('Vui lòng đăng nhập để đánh giá');
            return;
        }
        try {
            await phongtroAPI.addReview({
                maPhongTro: id,
                ...reviewForm
            });
            toast.success('Đánh giá thành công');
            setReviewForm({ diemSo: 5, nhanXet: '' });
            fetchRoom();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        }
    };

    const handleRequest = async () => {
        if (!isAuthenticated) {
            toast.warning('Vui lòng đăng nhập để gửi yêu cầu');
            return;
        }
        try {
            await messageAPI.sendYeuCau({
                maPhongTro: id,
                ghiChu: requestNote
            });
            toast.success('Gửi yêu cầu thành công');
            setRequestNote('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
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
    if (!room) return <div className="not-found">Không tìm thấy phòng trọ</div>;

    return (
        <div className="room-detail-page">
            <div className="room-header">
                <div className="room-images">
                    <img 
                        src={getImageUrl(room.anhDaiDien)} 
                        alt={room.tenKhuTro}
                        className="main-image"
                    />
                </div>

                <div className="room-info-cards">
                    <div className="info-card price">
                        <h3>{formatPrice(room.giaPhong)} đ</h3>
                        <p>/ tháng</p>
                    </div>
                    <div className="info-card">
                        <FaRuler />
                        <h3>{room.dienTich} m²</h3>
                        <p>Diện tích</p>
                    </div>
                    <div className="info-card">
                        <FaMapMarkerAlt />
                        <p>{room.diaChi}</p>
                    </div>
                    <div className="info-card">
                        <FaUser />
                        <h3>{room.chuTro}</h3>
                        <p>Chủ trọ</p>
                    </div>
                    <div className="info-card">
                        <FaPhone />
                        <h3>{room.sdtChuTro}</h3>
                        <p>Liên hệ</p>
                    </div>
                </div>
            </div>

            <div className="room-content">
                <div className="description-section">
                    <h2>Mô tả chi tiết</h2>
                    <p>{room.moTaPhongTro}</p>
                </div>

                {/* Yêu cầu thuê */}
                <div className="request-section">
                    <h2>Gửi yêu cầu thuê phòng</h2>
                    <textarea
                        value={requestNote}
                        onChange={(e) => setRequestNote(e.target.value)}
                        placeholder="Nhập ghi chú (không bắt buộc)"
                        rows={3}
                    />
                    <button onClick={handleRequest} className="btn-request">
                        <FaPaperPlane /> Gửi yêu cầu
                    </button>
                </div>

                {/* Đánh giá */}
                <div className="reviews-section">
                    <h2>
                        Đánh giá 
                        <span className="rating-avg">
                            <FaStar /> {room.diemTrungBinh?.toFixed(1) || '0.0'}
                        </span>
                    </h2>

                    {isAuthenticated && (
                        <form onSubmit={handleReview} className="review-form">
                            <div className="form-group">
                                <label>Điểm đánh giá</label>
                                <select
                                    value={reviewForm.diemSo}
                                    onChange={(e) => setReviewForm({...reviewForm, diemSo: e.target.value})}
                                >
                                    {[5, 4, 3, 2, 1].map(n => (
                                        <option key={n} value={n}>{n} sao</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Nhận xét</label>
                                <textarea
                                    value={reviewForm.nhanXet}
                                    onChange={(e) => setReviewForm({...reviewForm, nhanXet: e.target.value})}
                                    placeholder="Viết nhận xét của bạn..."
                                    required
                                />
                            </div>
                            <button type="submit">Gửi đánh giá</button>
                        </form>
                    )}

                    <div className="reviews-list">
                        {room.danhGia?.map(review => (
                            <div key={review.maDanhGia} className="review-item">
                                <div className="review-header">
                                    <strong>{review.tenNguoiDung}</strong>
                                    <span className="review-rating">
                                        <FaStar /> {review.diemSo}
                                    </span>
                                </div>
                                <p>{review.nhanXet}</p>
                                <small>{new Date(review.ngayNhanXet).toLocaleDateString('vi-VN')}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhongTroDetail;
