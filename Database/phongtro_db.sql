-- phpMyAdmin SQL Dump
-- Database: `phongtro_db`

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Cấu trúc bảng `nguoidung`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `nguoidung` (
  `maNguoiDung` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã người dùng',
  `tenNguoiDung` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên của người dùng',
  `matKhau` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mật khẩu đăng nhập',
  `tenDangNhap` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên đăng nhập của người dùng',
  `sdtNguoiDung` varchar(10) NOT NULL COMMENT 'Số điện thoại',
  `emailNguoiDung` varchar(255) NOT NULL COMMENT 'Email của người dùng',
  `vaiTro` enum('user','admin','landlord') NOT NULL DEFAULT 'user' COMMENT 'Vai trò của người dùng',
  `ngayDangKy` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Ngày đăng ký tài khoản',
  PRIMARY KEY (`maNguoiDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng `khutro`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `khutro` (
  `maKhuTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã khu trọ',
  `tenKhuTro` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên khu trọ',
  `diaChi` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Địa chỉ khu trọ',
  `chuTro` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên chủ trọ',
  `sdtChuTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Số điện thoại của chủ trọ',
  `googleMap` text NOT NULL COMMENT 'Địa chỉ Google Map',
  `maNguoiDang` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'Mã người đăng',
  PRIMARY KEY (`maKhuTro`),
  KEY `fk_khutro_nguoidang` (`maNguoiDang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng `loaiphong`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `loaiphong` (
  `maLoaiPhong` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã loại phòng',
  `tenLoaiPhong` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên loại phòng',
  `giaPhong` int(10) UNSIGNED NOT NULL COMMENT 'Giá cả phòng trọ',
  `moTaPhongTro` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mô tả phòng trọ',
  PRIMARY KEY (`maLoaiPhong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng `phongtro`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `phongtro` (
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã phòng trọ',
  `maKhuTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã khu trọ',
  `maLoaiPhong` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã loại phòng',
  `dienTich` int(3) NOT NULL COMMENT 'Diện tích phòng trọ',
  `tinhTrang` enum('empty','rented') NOT NULL COMMENT 'Tình trạng phòng trọ',
  `ngayDang` date NOT NULL DEFAULT current_timestamp() COMMENT 'Ngày đăng phòng trọ',
  PRIMARY KEY (`maPhongTro`),
  KEY `fk_phongtro-khutro` (`maKhuTro`),
  KEY `fk_phongtro-loaiphong` (`maLoaiPhong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng `hinhanhphong`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hinhanhphong` (
  `maHinhAnh` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã hình ảnh',
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã phòng trọ',
  `anhDaiDien` varchar(255) NOT NULL COMMENT 'Hình ảnh đại diện của phòng trọ',
  `hinhAnh` varchar(255) NOT NULL COMMENT 'Hình ảnh minh họa của phòng trọ',
  PRIMARY KEY (`maHinhAnh`),
  KEY `fk_hinhanhphong-phongtro` (`maPhongTro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng `dichvu`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `dichvu` (
  `maDichVu` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã dịch vụ',
  `donVi` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Đơn vị tính tiền của dịch vụ',
  `tenDichVu` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên dịch vụ',
  `moTaDichVu` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mô tả của dịch vụ',
  PRIMARY KEY (`maDichVu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng `khutro_dichvu`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `khutro_dichvu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `maDichVu` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `maKhuTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `giaCa` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_khuTro_dichVu-dichVu` (`maDichVu`),
  KEY `FK_khuTro_dichVu-khuTro` (`maKhuTro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng `danhgia`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `danhgia` (
  `maDanhGia` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã đánh giá',
  `maNguoiDung` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã người dùng',
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã phòng trọ',
  `diemSo` float UNSIGNED NOT NULL COMMENT 'Điểm đánh giá',
  `nhanXet` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Nhận xét của người dùng',
  `ngayNhanXet` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Ngày đăng nhận xét',
  PRIMARY KEY (`maDanhGia`),
  KEY `fk_danhgia-nguoidung` (`maNguoiDung`),
  KEY `fk_danhgia-phongtro` (`maPhongTro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng `tinnhan`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tinnhan` (
  `maTinNhan` int(11) NOT NULL AUTO_INCREMENT,
  `maNguoiGui` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `maNguoiNhan` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `noiDung` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `thoiGian` datetime NOT NULL DEFAULT current_timestamp(),
  `daDoc` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`maTinNhan`),
  KEY `fk_tinnhan_nguoigui` (`maNguoiGui`),
  KEY `fk_tinnhan_nguoinhan` (`maNguoiNhan`),
  KEY `fk_tinnhan_phongtro` (`maPhongTro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng `yeucauthue`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `yeucauthue` (
  `maYeuCau` int(11) NOT NULL AUTO_INCREMENT,
  `maNguoiThue` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `trangThai` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `ghiChu` text CHARACTER SET utf8 COLLATE utf8_bin,
  `ngayYeuCau` datetime NOT NULL DEFAULT current_timestamp(),
  `ngayCapNhat` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`maYeuCau`),
  KEY `fk_yeucau_nguoithue` (`maNguoiThue`),
  KEY `fk_yeucau_phongtro` (`maPhongTro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Ràng buộc khóa ngoại
-- --------------------------------------------------------
ALTER TABLE `khutro`
  ADD CONSTRAINT `fk_khutro_nguoidang` FOREIGN KEY (`maNguoiDang`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE;

ALTER TABLE `phongtro`
  ADD CONSTRAINT `fk_phongtro-khutro` FOREIGN KEY (`maKhuTro`) REFERENCES `khutro` (`maKhuTro`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phongtro-loaiphong` FOREIGN KEY (`maLoaiPhong`) REFERENCES `loaiphong` (`maLoaiPhong`) ON UPDATE CASCADE;

ALTER TABLE `hinhanhphong`
  ADD CONSTRAINT `fk_hinhanhphong-phongtro` FOREIGN KEY (`maPhongTro`) REFERENCES `phongtro` (`maPhongTro`) ON UPDATE CASCADE;

ALTER TABLE `khutro_dichvu`
  ADD CONSTRAINT `FK_khuTro_dichVu-dichVu` FOREIGN KEY (`maDichVu`) REFERENCES `dichvu` (`maDichVu`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_khuTro_dichVu-khuTro` FOREIGN KEY (`maKhuTro`) REFERENCES `khutro` (`maKhuTro`);

ALTER TABLE `danhgia`
  ADD CONSTRAINT `fk_danhgia-nguoidung` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_danhgia-phongtro` FOREIGN KEY (`maPhongTro`) REFERENCES `phongtro` (`maPhongTro`) ON UPDATE CASCADE;

ALTER TABLE `tinnhan`
  ADD CONSTRAINT `fk_tinnhan_nguoigui` FOREIGN KEY (`maNguoiGui`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tinnhan_nguoinhan` FOREIGN KEY (`maNguoiNhan`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tinnhan_phongtro` FOREIGN KEY (`maPhongTro`) REFERENCES `phongtro` (`maPhongTro`) ON UPDATE CASCADE;

ALTER TABLE `yeucauthue`
  ADD CONSTRAINT `fk_yeucau_nguoithue` FOREIGN KEY (`maNguoiThue`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_yeucau_phongtro` FOREIGN KEY (`maPhongTro`) REFERENCES `phongtro` (`maPhongTro`) ON UPDATE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
