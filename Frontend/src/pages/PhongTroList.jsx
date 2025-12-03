import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { phongtroAPI } from '../services/api';
import '../styles/PhongTroList.css';

const PhongTroList = () => {
    const [searchParams] = useSearchParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    useEffect(() => {
        fetchRooms();
    }, [searchParams]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const params = {
                location: searchParams.get('location') || '',
                minPrice: searchParams.get('minPrice') || '',
                maxPrice: searchParams.get('maxPrice') || '',
                area: searchParams.get('area') || '',
                page: searchParams.get('page') || 1
            };

            const response = await phongtroAPI.getAll(params);
            setRooms(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="phongtro-list-page">
            <h1 className="page-title">DANH SÁCH PHÒNG TRỌ</h1>

            <div className="results-info">
                Tìm thấy <strong>{pagination.total}</strong> phòng trọ
            </div>

            {loading ? (
                <div className="loading">Đang tải...</div>
            ) : rooms.length > 0 ? (
                <>
                    <div className="rooms-grid">
                        {rooms.map(room => (
                            <RoomCard key={room.maPhongTro} room={room} />
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: pagination.totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={pagination.page === i + 1 ? 'active' : ''}
                                    onClick={() => {
                                        const params = new URLSearchParams(searchParams);
                                        params.set('page', i + 1);
                                        window.location.search = params.toString();
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="no-results">
                    <p>Không tìm thấy phòng trọ phù hợp</p>
                </div>
            )}
        </div>
    );
};

export default PhongTroList;
