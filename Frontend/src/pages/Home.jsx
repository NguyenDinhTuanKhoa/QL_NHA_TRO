import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import RoomCard from '../components/RoomCard';
import { phongtroAPI } from '../services/api';
import '../styles/Home.css';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="home-page">
            <div className="hero-section">
                <img src="http://localhost:5000/images/introduction_img.png" alt="Banner" className="hero-image" />
            </div>

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
