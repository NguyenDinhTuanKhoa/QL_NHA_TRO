import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaBuilding, FaTags, FaRuler, FaImages, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { landlordAPI } from '../../services/api';
import '../../styles/landlord/AddRoom.css';

const AddRoom = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('phongtro');
    const [khuTroList, setKhuTroList] = useState([]);
    const [loaiPhongList, setLoaiPhongList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [phongtroForm, setPhongtroForm] = useState({
        maKhuTro: '',
        maLoaiPhong: '',
        dienTich: '',
        tinhTrang: 'empty'
    });

    const [khutroForm, setKhutroForm] = useState({
        tenKhuTro: '',
        diaChi: '',
        chuTro: '',
        sdtChuTro: '',
        googleMap: ''
    });

    const [loaiphongForm, setLoaiphongForm] = useState({
        tenLoaiPhong: '',
        giaPhong: '',
        moTaPhongTro: ''
    });

    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [khuTroRes, loaiPhongRes] = await Promise.all([
                landlordAPI.getKhuTro(),
                landlordAPI.getLoaiPhong()
            ]);
            setKhuTroList(khuTroRes.data.data);
            setLoaiPhongList(loaiPhongRes.data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleSubmitPhongtro = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            Object.keys(phongtroForm).forEach(key => {
                formData.append(key, phongtroForm[key]);
            });
            images.forEach(img => {
                formData.append('hinhAnh', img);
            });

            await landlordAPI.addPhongTro(formData);
            toast.success('Đăng tin thành công!');
            navigate('/landlord/rooms');
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitKhutro = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await landlordAPI.addKhuTro(khutroForm);
            toast.success('Thêm khu trọ thành công!');
            setKhutroForm({ tenKhuTro: '', diaChi: '', chuTro: '', sdtChuTro: '', googleMap: '' });
            fetchData();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitLoaiphong = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await landlordAPI.addLoaiPhong(loaiphongForm);
            toast.success('Thêm loại phòng thành công!');
            setLoaiphongForm({ tenLoaiPhong: '', giaPhong: '', moTaPhongTro: '' });
            fetchData();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-room-page">
            <div className="tabs">
                <button className={activeTab === 'phongtro' ? 'active' : ''} onClick={() => setActiveTab('phongtro')}>
                    <FaHome /> Đăng phòng trọ
                </button>
                <button className={activeTab === 'khutro' ? 'active' : ''} onClick={() => setActiveTab('khutro')}>
                    <FaBuilding /> Thêm khu trọ
                </button>
                <button className={activeTab === 'loaiphong' ? 'active' : ''} onClick={() => setActiveTab('loaiphong')}>
                    <FaTags /> Thêm loại phòng
                </button>
            </div>

            {activeTab === 'phongtro' && (
                <form onSubmit={handleSubmitPhongtro} className="form-card">
                    <div className="form-row">
                        <div className="form-group">
                            <label><FaBuilding /> Khu trọ *</label>
                            <select
                                value={phongtroForm.maKhuTro}
                                onChange={(e) => setPhongtroForm({...phongtroForm, maKhuTro: e.target.value})}
                                required
                            >
                                <option value="">-- Chọn khu trọ --</option>
                                {khuTroList.map(kt => (
                                    <option key={kt.maKhuTro} value={kt.maKhuTro}>
                                        {kt.tenKhuTro} - {kt.diaChi}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label><FaTags /> Loại phòng *</label>
                            <select
                                value={phongtroForm.maLoaiPhong}
                                onChange={(e) => setPhongtroForm({...phongtroForm, maLoaiPhong: e.target.value})}
                                required
                            >
                                <option value="">-- Chọn loại phòng --</option>
                                {loaiPhongList.map(lp => (
                                    <option key={lp.maLoaiPhong} value={lp.maLoaiPhong}>
                                        {lp.tenLoaiPhong} - {new Intl.NumberFormat('vi-VN').format(lp.giaPhong)}đ
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label><FaRuler /> Diện tích (m²) *</label>
                            <input
                                type="number"
                                value={phongtroForm.dienTich}
                                onChange={(e) => setPhongtroForm({...phongtroForm, dienTich: e.target.value})}
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tình trạng *</label>
                            <select
                                value={phongtroForm.tinhTrang}
                                onChange={(e) => setPhongtroForm({...phongtroForm, tinhTrang: e.target.value})}
                            >
                                <option value="empty">Còn trống</option>
                                <option value="rented">Đã cho thuê</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label><FaImages /> Hình ảnh</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                        {images.length > 0 && (
                            <div className="image-preview">
                                {images.map((img, idx) => (
                                    <img key={idx} src={URL.createObjectURL(img)} alt="" />
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        <FaPlus /> {loading ? 'Đang xử lý...' : 'Đăng tin'}
                    </button>
                </form>
            )}

            {activeTab === 'khutro' && (
                <form onSubmit={handleSubmitKhutro} className="form-card">
                    <div className="form-group">
                        <label>Tên khu trọ *</label>
                        <input
                            type="text"
                            value={khutroForm.tenKhuTro}
                            onChange={(e) => setKhutroForm({...khutroForm, tenKhuTro: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ *</label>
                        <textarea
                            value={khutroForm.diaChi}
                            onChange={(e) => setKhutroForm({...khutroForm, diaChi: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tên chủ trọ *</label>
                            <input
                                type="text"
                                value={khutroForm.chuTro}
                                onChange={(e) => setKhutroForm({...khutroForm, chuTro: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại *</label>
                            <input
                                type="tel"
                                value={khutroForm.sdtChuTro}
                                onChange={(e) => setKhutroForm({...khutroForm, sdtChuTro: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Tọa độ Google Map</label>
                        <input
                            type="text"
                            value={khutroForm.googleMap}
                            onChange={(e) => setKhutroForm({...khutroForm, googleMap: e.target.value})}
                            placeholder="VD: 9.972942, 106.334599"
                        />
                    </div>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        <FaPlus /> {loading ? 'Đang xử lý...' : 'Thêm khu trọ'}
                    </button>
                </form>
            )}

            {activeTab === 'loaiphong' && (
                <form onSubmit={handleSubmitLoaiphong} className="form-card">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tên loại phòng *</label>
                            <input
                                type="text"
                                value={loaiphongForm.tenLoaiPhong}
                                onChange={(e) => setLoaiphongForm({...loaiphongForm, tenLoaiPhong: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Giá phòng (VNĐ/tháng) *</label>
                            <input
                                type="number"
                                value={loaiphongForm.giaPhong}
                                onChange={(e) => setLoaiphongForm({...loaiphongForm, giaPhong: e.target.value})}
                                min="100000"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Mô tả</label>
                        <textarea
                            value={loaiphongForm.moTaPhongTro}
                            onChange={(e) => setLoaiphongForm({...loaiphongForm, moTaPhongTro: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        <FaPlus /> {loading ? 'Đang xử lý...' : 'Thêm loại phòng'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default AddRoom;
