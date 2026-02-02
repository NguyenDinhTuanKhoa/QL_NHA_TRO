import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaRuler, FaFilter, FaTimes, FaSearch } from 'react-icons/fa';
import RoomCard from '../components/RoomCard';
import { phongtroAPI } from '../services/api';
import '../styles/PhongTroList.css';

const locations = [
    'Xã Long Đức', 'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4',
    'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9'
];

const areas = [
    { value: '0-10', label: 'Dưới 10 m²' },
    { value: '10-20', label: '10 - 20 m²' },
    { value: '20-30', label: '20 - 30 m²' },
    { value: '30-40', label: '30 - 40 m²' },
    { value: '40-50', label: '40 - 50 m²' },
    { value: 'above-50', label: 'Trên 50 m²' }
];

const PhongTroList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    const [filters, setFilters] = useState({
        location: searchParams.get('location') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        area: searchParams.get('area') || '',
        status: searchParams.get('status') || ''
    });

    useEffect(() => {
        fetchRooms();
    }, [searchParams]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const params = {
                location: searchParams.get('location') || '',
                maxPrice: searchParams.get('maxPrice') || '',
                area: searchParams.get('area') || '',
                status: searchParams.get('status') || '',
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

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (filters.location) params.set('location', filters.location);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.area) params.set('area', filters.area);
        if (filters.status) params.set('status', filters.status);
        setSearchParams(params);
        setShowMobileFilter(false);
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            maxPrice: '',
            area: '',
            status: ''
        });
        setSearchParams({});
    };

    const hasActiveFilters = filters.location || filters.maxPrice || filters.area || filters.status;

    return (
        <div className="phongtro-list-page">
            {/* Mobile Filter Toggle */}
            <button className="mobile-filter-toggle" onClick={() => setShowMobileFilter(true)}>
                <FaFilter /> Bộ lọc
            </button>

            <div className="phongtro-layout">
                {/* Sidebar Filter */}
                <aside className={`filter-sidebar ${showMobileFilter ? 'show' : ''}`}>
                    <div className="filter-header">
                        <h3><FaFilter /> Bộ lọc tìm kiếm</h3>
                        <button className="close-filter" onClick={() => setShowMobileFilter(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="filter-content">
                        {/* Địa điểm */}
                        <div className="filter-group">
                            <label><FaMapMarkerAlt /> Địa điểm</label>
                            <select name="location" value={filters.location} onChange={handleFilterChange}>
                                <option value="">Tất cả địa điểm</option>
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>

                        {/* Giá tối đa */}
                        <div className="filter-group">
                            <label>Giá tối đa (VNĐ)</label>
                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder="Nhập số tiền tối đa..."
                                min="0"
                                step="100000"
                            />
                        </div>

                        {/* Diện tích */}
                        <div className="filter-group">
                            <label><FaRuler /> Diện tích</label>
                            <select name="area" value={filters.area} onChange={handleFilterChange}>
                                <option value="">Tất cả diện tích</option>
                                {areas.map(a => (
                                    <option key={a.value} value={a.value}>{a.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Trạng thái */}
                        <div className="filter-group">
                            <label>Trạng thái</label>
                            <select name="status" value={filters.status} onChange={handleFilterChange}>
                                <option value="">Tất cả</option>
                                <option value="empty">Còn trống</option>
                                <option value="rented">Đã thuê</option>
                            </select>
                        </div>

                        <div className="filter-actions">
                            <button className="btn-apply" onClick={applyFilters}>
                                <FaSearch /> Áp dụng
                            </button>
                            {hasActiveFilters && (
                                <button className="btn-clear" onClick={clearFilters}>
                                    Xóa bộ lọc
                                </button>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="rooms-main">
                    <div className="rooms-header">
                        <h1>DANH SÁCH PHÒNG TRỌ</h1>
                        <p className="results-count">Tìm thấy <strong>{pagination.total}</strong> phòng trọ</p>
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
                                                setSearchParams(params);
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
                            <div className="no-results-icon">🏠</div>
                            <h3>Không tìm thấy phòng trọ</h3>
                            <p>Thử thay đổi bộ lọc để tìm kiếm kết quả khác</p>
                        </div>
                    )}
                </main>
            </div>

            {/* Overlay for mobile */}
            {showMobileFilter && <div className="filter-overlay" onClick={() => setShowMobileFilter(false)} />}
        </div>
    );
};

export default PhongTroList;
