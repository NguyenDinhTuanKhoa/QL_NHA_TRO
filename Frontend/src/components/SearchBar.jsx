import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaRuler } from 'react-icons/fa';
import '../styles/SearchBar.css';

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

const SearchBar = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        location: searchParams.get('location') || '',
        minPrice: searchParams.get('minPrice') || '0',
        maxPrice: searchParams.get('maxPrice') || '5000000',
        area: searchParams.get('area') || ''
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (filters.location) params.set('location', filters.location);
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.area) params.set('area', filters.area);
        navigate(`/phongtro?${params.toString()}`);
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-field">
                    <FaMapMarkerAlt className="field-icon" />
                    <select name="location" value={filters.location} onChange={handleChange}>
                        <option value="">Tất cả địa điểm</option>
                        {locations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                <div className="search-field price-field">
                    <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleChange}
                        placeholder="Giá từ"
                        min="0"
                        step="100000"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        placeholder="Giá đến"
                        min="0"
                        step="100000"
                    />
                </div>

                <div className="search-field">
                    <FaRuler className="field-icon" />
                    <select name="area" value={filters.area} onChange={handleChange}>
                        <option value="">Diện tích</option>
                        {areas.map(a => (
                            <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn-search">
                    <FaSearch /> Tìm kiếm
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
