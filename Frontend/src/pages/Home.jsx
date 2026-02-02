import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import RoomCard from '../components/RoomCard';
import { phongtroAPI } from '../services/api';
import '../styles/Home.css';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await phongtroAPI.getAll({ limit: 8 });
            setRooms(response.data.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/phongtro?location=${searchQuery}`);
        } else {
            navigate('/phongtro');
        }
    };

    return (
        <div className="home-page">
            {/* Hero Banner Section */}
            <section className="hero-banner">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Tìm Phòng Trọ <span className="highlight">Ưng Ý</span>
                            <br />
                            Tại Trà Vinh
                        </h1>
                        <p className="hero-subtitle">
                            Hàng nghìn phòng trọ chất lượng, giá cả hợp lý, vị trí đẹp
                        </p>
                        
                        {/* Search Box */}
                        <form className="hero-search-box" onSubmit={handleSearch}>
                            <div className="search-input-wrapper">
                                <FaMapMarkerAlt className="search-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Nhập địa điểm bạn muốn tìm..." 
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="search-btn">
                                <FaSearch /> Tìm kiếm
                            </button>
                        </form>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="hero-decoration">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                </div>
            </section>

            <section className="rooms-section">
                <h2 className="section-title">PHÒNG TRỌ MỚI ĐĂNG</h2>

                {loading ? (
                    <div className="loading">Đang tải...</div>
                ) : (
                    <div className="rooms-grid">
                        {rooms.map(room => (
                            <RoomCard key={room.maPhongTro} room={room} />
                        ))}
                    </div>
                )}

                <div className="see-all">
                    <Link to="/phongtro" className="btn-see-all">
                        Xem tất cả <FaArrowRight />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
