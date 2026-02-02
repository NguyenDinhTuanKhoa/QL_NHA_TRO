import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>TRA CỨU PHÒNG TRỌ</h3>
                    <p>Trang tra cứu thông tin phòng trọ ở Thành Phố Trà Vinh.</p>
                </div>

                <div className="footer-section">
                    <h3>LIÊN HỆ</h3>
                    <p><FaMapMarkerAlt /> Đường Mậu Thân, Châu Thành, Trà Vinh</p>
                    <p><FaPhone /> 0969 707 708</p>
                    <p><FaEnvelope /> kainennet2023@gmail.com</p>
                </div>

                <div className="footer-section">
                    <h3>THEO DÕI CHÚNG TÔI</h3>
                    <div className="social-links">
                        <a href="#"><FaFacebook /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaYoutube /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2025 Nhà Trọ Tân Khoa. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
