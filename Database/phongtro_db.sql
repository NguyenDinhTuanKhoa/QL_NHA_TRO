-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 02, 2026 at 03:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `phongtro_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `danhgia`
--

CREATE TABLE `danhgia` (
  `maDanhGia` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã đánh giá',
  `maNguoiDung` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã người dùng',
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã phòng trọ',
  `diemSo` float UNSIGNED NOT NULL COMMENT 'Điểm đánh giá',
  `nhanXet` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Nhận xét của người dùng',
  `ngayNhanXet` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Ngày đăng nhận xét'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `danhgia`
--

INSERT INTO `danhgia` (`maDanhGia`, `maNguoiDung`, `maPhongTro`, `diemSo`, `nhanXet`, `ngayNhanXet`) VALUES
('DG00001', 'ND00001', 'PT00001', 3.5, 'Phòng trọ vô cùng tốt, dịch vụ đầy đủ', '2024-12-27 09:30:24'),
('DG00002', 'ND00002', 'PT00001', 5, 'abc', '2024-12-27 09:45:32'),
('DG00003', 'ND00002', 'PT00001', 1, '123', '2024-12-27 09:45:46'),
('DG00004', 'ND100000', 'PT00004', 5, 'trọ đẹp\n', '2025-12-04 10:31:42');

-- --------------------------------------------------------

--
-- Table structure for table `dichvu`
--

CREATE TABLE `dichvu` (
  `maDichVu` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã dịch vụ',
  `donVi` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Đơn vị tính tiền của dịch vụ',
  `tenDichVu` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên dịch vụ',
  `moTaDichVu` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mô tả của dịch vụ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `dichvu`
--

INSERT INTO `dichvu` (`maDichVu`, `donVi`, `tenDichVu`, `moTaDichVu`) VALUES
('DV00003', 'Khối', 'Tiền Nước', 'Tiền nước sinh hoạt, đóng tiền vào cuối tháng'),
('DV00004', 'kW', 'Tiền điện', 'Tiền điện, đóng tiền theo tháng');

-- --------------------------------------------------------

--
-- Table structure for table `hinhanhphong`
--

CREATE TABLE `hinhanhphong` (
  `maHinhAnh` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã hình ảnh',
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã phòng trọ',
  `anhDaiDien` varchar(255) NOT NULL COMMENT 'Hình ảnh đại diện của phòng trọ',
  `hinhAnh` varchar(255) NOT NULL COMMENT 'Hình ảnh minh họa của phòng trọ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `hinhanhphong`
--

INSERT INTO `hinhanhphong` (`maHinhAnh`, `maPhongTro`, `anhDaiDien`, `hinhAnh`) VALUES
('', 'PT00003', '../images/phong_tro_9.jpg', '../images/phong_tro_9.jpg\r\n../images/phong_tro_10.jpg\r\n../images/phong_tro_11.jpg\r\n../images/phong_tro_12.jpg\r\n../images/phong_tro_13.jpg\r\n../images/phong_tro_14.jpg'),
('HA00001', 'PT00001', '../images/phong_tro_1.jpg', '../images/phong_tro_1.jpg\r\n../images/phong_tro_2.jpg\r\n../images/phong_tro_3.jpg\r\n../images/phong_tro_4.jpg'),
('HA00002', 'PT00002', '../images/phong_tro_5.jpg', '../images/phong_tro_5.jpg\r\n../images/phong_tro_6.jpg\r\n../images/phong_tro_7.jpg\r\n../images/phong_tro_8.jpg'),
('HA00003', 'PT00004', '/uploads/room_1764774731194.jpg', '/uploads/room_1764774731194.jpg'),
('HA00004', 'PT00005', '/uploads/room_1764837038478.jpg', '/uploads/room_1764837038478.jpg'),
('HA00005', 'PT00006', '/uploads/room_1769999958724.jpg', '/uploads/room_1769999958724.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `khutro`
--

CREATE TABLE `khutro` (
  `maKhuTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã khu trọ',
  `tenKhuTro` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên khu trọ',
  `diaChi` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Địa chỉ khu trọ',
  `chuTro` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên chủ trọ',
  `sdtChuTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Số điện thoại của chủ trọ',
  `googleMap` text NOT NULL COMMENT 'Địa chỉ Google Map',
  `maNguoiDang` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `khutro`
--

INSERT INTO `khutro` (`maKhuTro`, `tenKhuTro`, `diaChi`, `chuTro`, `sdtChuTro`, `googleMap`, `maNguoiDang`) VALUES
('KT00001', 'Phòng trọ bà Sáu Tây', 'Quán nhậu Cầu Lông Bình 3, Cầu Lông Bình 3, Xã Long Đức, Thành phố Trà Vinh, Trà Vinh', 'Thảo Uyên', '0559740592', '9.972942842412204, 106.33459978973937', NULL),
('KT00002', 'nhà. cho thuê', '  Đường Võ Văn Kiệt, Phường 1, Thành phố Trà Vinh, Trà Vinh', 'Đạt Nguyễn', '0816747257', '9.953575637185054, 106.33612417139155', NULL),
('KT00003', 'cho thuê phòng trọ phường 7 gần Tịnh Xá Ngọc Vân', 'Đường Nguyễn Thị Minh Khai, Phường 7, Thành phố Trà Vinh, Trà Vinh', 'Nhan', '070809****', '9.930203400304874, 106.3330390901221', NULL),
('KT00004', 'đường D5', 'đường D5 trà vinh ', 'tuấn khoa', '123456789', '', 'ND00006'),
('KT00005', 'gần ký trúc xá TVU', 'dường ký trúc xá tvu ', 'Tuấn Khoa', '123456789', '', 'ND00006');

-- --------------------------------------------------------

--
-- Table structure for table `khutro_dichvu`
--

CREATE TABLE `khutro_dichvu` (
  `id` int(11) NOT NULL,
  `maDichVu` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `maKhuTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `giaCa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `khutro_dichvu`
--

INSERT INTO `khutro_dichvu` (`id`, `maDichVu`, `maKhuTro`, `giaCa`) VALUES
(31, 'DV00003', 'KT00003', 3500),
(32, 'DV00004', 'KT00003', 15000);

-- --------------------------------------------------------

--
-- Table structure for table `lichsu_giahan`
--

CREATE TABLE `lichsu_giahan` (
  `id` int(11) NOT NULL,
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `ngayGiaHanCu` date NOT NULL COMMENT 'Ngày hết hạn cũ',
  `ngayGiaHanMoi` date NOT NULL COMMENT 'Ngày hết hạn mới',
  `ngayThucHien` datetime DEFAULT current_timestamp(),
  `ghiChu` text CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `lichsu_giahan`
--

INSERT INTO `lichsu_giahan` (`id`, `maPhongTro`, `ngayGiaHanCu`, `ngayGiaHanMoi`, `ngayThucHien`, `ghiChu`) VALUES
(7, 'PT00005', '2026-03-18', '2026-04-18', '2025-12-18 15:17:34', 'Gia hạn thêm 1 tháng'),
(8, 'PT00005', '2026-04-18', '2026-05-18', '2025-12-18 15:20:39', 'Gia hạn thêm 1 tháng'),
(9, 'PT00005', '2026-05-18', '2026-07-18', '2025-12-18 15:21:01', 'Gia hạn thêm 2 tháng'),
(10, 'PT00005', '2026-07-18', '2026-09-18', '2025-12-18 15:21:15', 'Gia hạn thêm 2 tháng');

-- --------------------------------------------------------

--
-- Table structure for table `loaiphong`
--

CREATE TABLE `loaiphong` (
  `maLoaiPhong` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã loại phòng',
  `tenLoaiPhong` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên loại phòng',
  `giaPhong` int(10) UNSIGNED NOT NULL COMMENT 'Giá cả phòng trọ',
  `moTaPhongTro` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mô tả phòng trọ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `loaiphong`
--

INSERT INTO `loaiphong` (`maLoaiPhong`, `tenLoaiPhong`, `giaPhong`, `moTaPhongTro`) VALUES
('LP00001', 'Loại 1', 500000, 'Phòng trọ nằm ngay chân cầu Long Bình 3 diện tích 4-5m2 phòng ở thoáng mát anh ninh tốt , chưa tính điện nước\r\nAi có nhu cầu liên hệ số\r\nSđt 0559740592'),
('LP00002', 'Loại 2', 2000000, '2 phòng ngủ, 2 phòng khách rộng rãi thoải mái. \r\nPhường 1, Võ Văn Kiệt, đèn xanh đỏ, Phú Hòa, gần karake mon. \r\n2 triệu/tháng .'),
('LP00003', 'Loại 3', 800000, 'Phòng trọ mới sữa chữa như mới sạch sẽ. Mặt tiền hẻm cao ráo. Điện 3500/kw nước 15000/khối. Còn 2p trống.');

-- --------------------------------------------------------

--
-- Table structure for table `nguoidung`
--

CREATE TABLE `nguoidung` (
  `maNguoiDung` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã người dùng',
  `tenNguoiDung` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên của người dùng',
  `matKhau` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mật khẩu đăng nhập',
  `tenDangNhap` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Tên đăng nhập của người dùng',
  `sdtNguoiDung` varchar(10) NOT NULL COMMENT 'Số điện thoại',
  `emailNguoiDung` varchar(255) NOT NULL COMMENT 'Email của người dùng',
  `vaiTro` enum('user','admin','landlord') NOT NULL COMMENT 'Vai trò của người dùng',
  `ngayDangKy` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Ngày đăng ký tài khoản'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `nguoidung`
--

INSERT INTO `nguoidung` (`maNguoiDung`, `tenNguoiDung`, `matKhau`, `tenDangNhap`, `sdtNguoiDung`, `emailNguoiDung`, `vaiTro`, `ngayDangKy`) VALUES
('0005', 'admin', '$2a$10$0P8mEgPTC0VElUh4v5EbwOrhKT5K7Sw.RyiClxbQoEo0hAqOxNudm', 'admin', '123456789', 'admin@gmail.com', 'admin', '2025-12-04 08:23:51'),
('ND00001', 'Trần Phạm', '$2a$10$0P8mEgPTC0VElUh4v5EbwOrhKT5K7Sw.RyiClxbQoEo0hAqOxNudm', 'tranpham', '0969707809', 'tranpham@gmail.com', 'user', '2024-12-28 08:58:55'),
('ND00002', 'Hà Gia Lộc', '$2a$10$0P8mEgPTC0VElUh4v5EbwOrhKT5K7Sw.RyiClxbQoEo0hAqOxNudm', 'hagialoc', '', '', 'user', '2024-12-28 08:58:55'),
('ND00006', 'nguyễn đinh Tuấn Khoa ', '$2a$10$0P8mEgPTC0VElUh4v5EbwOrhKT5K7Sw.RyiClxbQoEo0hAqOxNudm', 'khoa', '0369312522', 'nguyendinhtuankhoatt209@gmail.com', 'landlord', '2025-12-03 21:55:55'),
('ND100000', 'La Thuấn Khang', '$2a$10$0P8mEgPTC0VElUh4v5EbwOrhKT5K7Sw.RyiClxbQoEo0hAqOxNudm', 'khang ', '123456789', 'khang@gmail.com', 'user', '2025-12-04 10:12:41'),
('ND100001', 'Phạm Duy Tân', '$2a$10$0P8mEgPTC0VElUh4v5EbwOrhKT5K7Sw.RyiClxbQoEo0hAqOxNudm', 'tan', '0369312522', 'dinhlonghott496@gmail.com', 'user', '2025-12-04 15:23:56'),
('ND100002', 'Test User', '$2a$10$0P8mEgPTC0VElUh4v5EbwOrhKT5K7Sw.RyiClxbQoEo0hAqOxNudm', 'testuser', '0123456789', 'test@test.com', 'user', '2025-12-25 16:24:26'),
('ND99999', 'Administrator', '$2a$10$0P8mEgPTC0VElUh4v5EbwOrhKT5K7Sw.RyiClxbQoEo0hAqOxNudm', 'admin', '0123456789', 'admin@gmail.com', 'admin', '2025-12-04 08:20:47');

-- --------------------------------------------------------

--
-- Table structure for table `phongtro`
--

CREATE TABLE `phongtro` (
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã phòng trọ',
  `maKhuTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã khu trọ',
  `maLoaiPhong` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Mã loại phòng',
  `dienTich` int(3) NOT NULL COMMENT 'Diện tích phòng trọ',
  `tinhTrang` enum('empty','rented') NOT NULL COMMENT 'Tình trạng phòng trọ',
  `ngayDang` date NOT NULL DEFAULT current_timestamp() COMMENT 'Ngày đăng phòng trọ',
  `trangThaiDongTien` enum('da_dong','chua_dong') DEFAULT 'chua_dong',
  `ngayCapNhatDongTien` date DEFAULT NULL,
  `ngayBatDauThue` date DEFAULT NULL COMMENT 'Ngày bắt đầu thuê',
  `ngayHetHan` date DEFAULT NULL COMMENT 'Ngày hết hạn thuê'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `phongtro`
--

INSERT INTO `phongtro` (`maPhongTro`, `maKhuTro`, `maLoaiPhong`, `dienTich`, `tinhTrang`, `ngayDang`, `trangThaiDongTien`, `ngayCapNhatDongTien`, `ngayBatDauThue`, `ngayHetHan`) VALUES
('PT00001', 'KT00001', 'LP00001', 12, 'empty', '2024-12-24', 'da_dong', NULL, NULL, NULL),
('PT00002', 'KT00002', 'LP00002', 80, 'empty', '2024-12-24', 'chua_dong', NULL, NULL, NULL),
('PT00003', 'KT00003', 'LP00003', 20, 'empty', '2024-12-29', 'da_dong', NULL, NULL, NULL),
('PT00004', 'KT00004', 'LP00001', 50, 'rented', '2025-12-03', 'chua_dong', '2025-12-18', NULL, NULL),
('PT00005', 'KT00004', 'LP00003', 70, 'rented', '2025-12-04', 'da_dong', '2025-12-18', '2026-07-18', '2026-09-18'),
('PT00006', 'KT00005', 'LP00002', 50, 'empty', '2026-02-02', 'chua_dong', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `thongbao`
--

CREATE TABLE `thongbao` (
  `id` int(11) NOT NULL,
  `maNguoiNhan` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `tieuDe` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `noiDung` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `loaiThongBao` enum('dong_tien','he_thong','yeu_cau','het_han','gia_han') DEFAULT 'he_thong',
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `ngayGui` datetime DEFAULT current_timestamp(),
  `daXem` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `thongbao`
--

INSERT INTO `thongbao` (`id`, `maNguoiNhan`, `tieuDe`, `noiDung`, `loaiThongBao`, `maPhongTro`, `ngayGui`, `daXem`) VALUES
(1, 'ND100001', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 3 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00005', '2025-12-04 15:37:19', 1),
(2, 'ND100001', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 3 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00005', '2025-12-04 15:40:53', 1),
(3, 'ND100001', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 3 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00005', '2025-12-18 14:08:00', 1),
(4, 'ND100000', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn chưa đóng tiền phòng Loại 1 tại đường D5. Số tiền: 500.000 đ. Vui lòng đóng tiền đúng hạn.', 'dong_tien', 'PT00004', '2025-12-18 14:08:53', 0),
(5, 'ND100001', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 3 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00005', '2025-12-18 14:09:21', 1),
(6, 'ND100001', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 3 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00005', '2025-12-18 14:24:06', 1),
(7, 'ND100001', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 3 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00005', '2025-12-18 14:25:29', 1),
(8, 'ND100001', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 3 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00005', '2025-12-18 14:28:55', 1),
(9, 'ND100001', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn cần đóng tiền phòng Loại 3 tại đường D5. Vui lòng đóng tiền đúng hạn để tránh bị gián đoạn dịch vụ.', 'dong_tien', 'PT00005', '2025-12-18 14:29:03', 1),
(10, 'ND100001', 'Gia hạn thuê phòng thành công', 'Phòng Loại 3 tại đường D5 đã được gia hạn. Hạn thuê mới đến 18/1/2026.', 'gia_han', 'PT00005', '2025-12-18 14:29:38', 1),
(11, 'ND100001', 'Gia hạn thuê phòng thành công', 'Phòng Loại 3 tại đường D5 đã được gia hạn. Thời hạn thuê: 18/1/2026 - 18/2/2026.', 'gia_han', 'PT00005', '2025-12-18 14:32:56', 1),
(12, 'ND100001', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn cần đóng tiền phòng Loại 3 tại đường D5. Vui lòng đóng tiền đúng hạn để tránh bị gián đoạn dịch vụ.', 'dong_tien', 'PT00005', '2025-12-18 14:33:13', 1),
(13, 'ND100001', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 3 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00005', '2025-12-18 14:33:21', 1),
(14, 'ND100001', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn cần đóng tiền phòng Loại 3 tại đường D5. Vui lòng đóng tiền đúng hạn để tránh bị gián đoạn dịch vụ.', 'dong_tien', 'PT00005', '2025-12-18 14:33:28', 1),
(15, 'ND100001', 'Gia hạn thuê phòng thành công', 'Phòng Loại 3 tại đường D5 đã được gia hạn. Thời hạn thuê: 18/2/2026 - 18/3/2026.', 'gia_han', 'PT00005', '2025-12-18 14:33:43', 1),
(16, 'ND100000', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 1 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00004', '2025-12-18 14:34:00', 0),
(17, 'ND100000', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn cần đóng tiền phòng Loại 1 tại đường D5. Vui lòng đóng tiền đúng hạn để tránh bị gián đoạn dịch vụ.', 'dong_tien', 'PT00004', '2025-12-18 14:34:02', 0),
(18, 'ND100000', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn chưa đóng tiền phòng Loại 1 tại đường D5. Số tiền: 500.000 đ. Vui lòng đóng tiền đúng hạn.', 'dong_tien', 'PT00004', '2025-12-18 14:36:52', 0),
(19, 'ND100001', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn cần đóng tiền phòng Loại 3 tại đường D5. Vui lòng đóng tiền đúng hạn để tránh bị gián đoạn dịch vụ.', 'dong_tien', 'PT00005', '2025-12-18 14:37:27', 1),
(20, 'ND100000', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn chưa đóng tiền phòng Loại 1 tại đường D5. Số tiền: 500.000 đ. Vui lòng đóng tiền đúng hạn.', 'dong_tien', 'PT00004', '2025-12-18 14:37:32', 0),
(21, 'ND100001', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn chưa đóng tiền phòng Loại 3 tại đường D5. Số tiền: 800.000 đ. Vui lòng đóng tiền đúng hạn.', 'dong_tien', 'PT00005', '2025-12-18 14:37:32', 1),
(22, 'ND100000', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn chưa đóng tiền phòng Loại 1 tại đường D5. Số tiền: 500.000 đ. Vui lòng đóng tiền đúng hạn.', 'dong_tien', 'PT00004', '2025-12-18 14:37:49', 0),
(23, 'ND100001', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn chưa đóng tiền phòng Loại 3 tại đường D5. Số tiền: 800.000 đ. Vui lòng đóng tiền đúng hạn.', 'dong_tien', 'PT00005', '2025-12-18 14:37:49', 1),
(24, 'ND100001', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 3 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00005', '2025-12-18 14:39:44', 1),
(25, 'ND100001', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn cần đóng tiền phòng Loại 3 tại đường D5. Vui lòng đóng tiền đúng hạn để tránh bị gián đoạn dịch vụ.', 'dong_tien', 'PT00005', '2025-12-18 14:48:44', 1),
(26, 'ND100001', 'Gia hạn thuê phòng thành công', 'Phòng Loại 3 tại đường D5 đã được gia hạn. Thời hạn thuê: 18/3/2026 - 18/4/2026.', 'gia_han', 'PT00005', '2025-12-18 14:53:12', 1),
(27, 'ND100001', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn cần đóng tiền phòng Loại 3 tại đường D5. Vui lòng đóng tiền đúng hạn để tránh bị gián đoạn dịch vụ.', 'dong_tien', 'PT00005', '2025-12-18 14:53:40', 1),
(28, 'ND100001', 'Gia hạn thuê phòng thành công', 'Phòng Loại 3 tại đường D5 đã được gia hạn. Thời hạn thuê: 18/3/2026 - 18/5/2026.', 'gia_han', 'PT00005', '2025-12-18 14:53:57', 1),
(29, 'ND100001', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn cần đóng tiền phòng Loại 3 tại đường D5. Vui lòng đóng tiền đúng hạn để tránh bị gián đoạn dịch vụ.', 'dong_tien', 'PT00005', '2025-12-18 14:59:03', 1),
(30, 'ND100001', 'Gia hạn thuê phòng thành công', 'Phòng Loại 3 tại đường D5 đã được gia hạn. Thời hạn thuê: 18/3/2026 - 18/7/2026.', 'gia_han', 'PT00005', '2025-12-18 14:59:37', 1),
(31, 'ND100001', 'Nhắc nhở đóng tiền phòng trọ', 'Bạn cần đóng tiền phòng Loại 3 tại đường D5. Vui lòng đóng tiền đúng hạn để tránh bị gián đoạn dịch vụ.', 'dong_tien', 'PT00005', '2025-12-18 15:02:10', 1),
(32, 'ND100001', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 3 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00005', '2025-12-18 15:09:26', 1),
(33, 'ND00006', 'Thời hạn thuê phòng đã hết', 'Phòng Loại 3 tại đường D5 đã hết thời hạn thuê. Trạng thái đã chuyển sang \"chưa đóng tiền\". Vui lòng gia hạn.', 'het_han', 'PT00005', '2025-12-18 15:09:36', 0),
(34, 'ND00006', 'Thời hạn thuê phòng đã hết', 'Phòng Loại 3 tại đường D5 đã hết thời hạn thuê. Trạng thái đã chuyển sang \"chưa đóng tiền\". Vui lòng gia hạn.', 'het_han', 'PT00005', '2025-12-18 15:09:36', 0),
(35, 'ND100001', 'Thời hạn thuê phòng đã hết', 'Thời hạn thuê phòng Loại 3 tại đường D5 đã hết. Vui lòng liên hệ chủ trọ để gia hạn và đóng tiền.', 'het_han', 'PT00005', '2025-12-18 15:09:36', 1),
(36, 'ND100001', 'Thời hạn thuê phòng đã hết', 'Thời hạn thuê phòng Loại 3 tại đường D5 đã hết. Vui lòng liên hệ chủ trọ để gia hạn và đóng tiền.', 'het_han', 'PT00005', '2025-12-18 15:09:36', 1),
(37, 'ND100001', 'Xác nhận đã đóng tiền phòng', 'Chủ trọ đã xác nhận bạn đã đóng tiền phòng Loại 3 tại đường D5. Cảm ơn bạn!', 'dong_tien', 'PT00005', '2025-12-18 15:10:44', 1),
(38, 'ND00006', 'Thời hạn thuê phòng đã hết', 'Phòng Loại 3 tại đường D5 đã hết thời hạn thuê. Trạng thái đã chuyển sang \"chưa đóng tiền\". Vui lòng gia hạn.', 'het_han', 'PT00005', '2025-12-18 15:10:45', 0),
(39, 'ND00006', 'Thời hạn thuê phòng đã hết', 'Phòng Loại 3 tại đường D5 đã hết thời hạn thuê. Trạng thái đã chuyển sang \"chưa đóng tiền\". Vui lòng gia hạn.', 'het_han', 'PT00005', '2025-12-18 15:10:45', 0),
(40, 'ND100001', 'Thời hạn thuê phòng đã hết', 'Thời hạn thuê phòng Loại 3 tại đường D5 đã hết. Vui lòng liên hệ chủ trọ để gia hạn và đóng tiền.', 'het_han', 'PT00005', '2025-12-18 15:10:45', 1),
(41, 'ND100001', 'Thời hạn thuê phòng đã hết', 'Thời hạn thuê phòng Loại 3 tại đường D5 đã hết. Vui lòng liên hệ chủ trọ để gia hạn và đóng tiền.', 'het_han', 'PT00005', '2025-12-18 15:10:45', 1),
(42, 'ND100001', 'Gia hạn thuê phòng thành công', 'Phòng Loại 3 tại đường D5 đã được gia hạn thêm 1 tháng. Thời hạn thuê mới: 18/3/2026 - 18/4/2026.', 'gia_han', 'PT00005', '2025-12-18 15:17:34', 1),
(43, 'ND100001', 'Gia hạn thuê phòng thành công', 'Phòng Loại 3 tại đường D5 đã được gia hạn thêm 1 tháng. Thời hạn thuê mới: 18/4/2026 - 18/5/2026.', 'gia_han', 'PT00005', '2025-12-18 15:20:39', 1),
(44, 'ND100001', 'Gia hạn thuê phòng thành công', 'Phòng Loại 3 tại đường D5 đã được gia hạn thêm 2 tháng. Thời hạn thuê mới: 18/5/2026 - 18/7/2026.', 'gia_han', 'PT00005', '2025-12-18 15:21:01', 1),
(45, 'ND100001', 'Gia hạn thuê phòng thành công', 'Phòng Loại 3 tại đường D5 đã được gia hạn thêm 2 tháng. Thời hạn thuê mới: 18/7/2026 - 18/9/2026.', 'gia_han', 'PT00005', '2025-12-18 15:21:15', 1),
(46, 'ND00006', 'Nhắc nhở đóng tiền phòng trọ', 'Phòng Loại 1 tại đường D5 đã quá 35 ngày chưa đóng tiền. Vui lòng cập nhật trạng thái đóng tiền.', 'dong_tien', 'PT00004', '2026-01-22 10:33:18', 0),
(47, 'ND00006', 'Nhắc nhở đóng tiền phòng trọ', 'Phòng Loại 1 tại đường D5 đã quá 46 ngày chưa đóng tiền. Vui lòng cập nhật trạng thái đóng tiền.', 'dong_tien', 'PT00004', '2026-02-02 09:27:51', 0),
(48, 'ND00006', 'Nhắc nhở đóng tiền phòng trọ', 'Phòng Loại 1 tại đường D5 đã quá 46 ngày chưa đóng tiền. Vui lòng cập nhật trạng thái đóng tiền.', 'dong_tien', 'PT00004', '2026-02-02 09:27:51', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tinnhan`
--

CREATE TABLE `tinnhan` (
  `maTinNhan` int(11) NOT NULL,
  `maNguoiGui` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `maNguoiNhan` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `noiDung` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `thoiGian` datetime NOT NULL DEFAULT current_timestamp(),
  `daDoc` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tinnhan`
--

INSERT INTO `tinnhan` (`maTinNhan`, `maNguoiGui`, `maNguoiNhan`, `maPhongTro`, `noiDung`, `thoiGian`, `daDoc`) VALUES
(1, 'ND100000', 'ND00006', NULL, 'ê cho  thuê gì mắc quá z', '2025-12-04 10:46:41', 1),
(2, 'ND00006', 'ND100000', NULL, 'mắc đâu ọk mà ', '2025-12-04 10:47:05', 1),
(3, 'ND00006', 'ND100000', NULL, 'không ở thì cút ra ngoài đường ở ', '2025-12-04 10:52:59', 1),
(4, 'ND100000', 'ND00006', NULL, 'hello', '2025-12-04 13:00:02', 1),
(5, 'ND00006', 'ND100000', NULL, 'chuyện gì?', '2025-12-04 13:59:23', 1),
(6, 'ND00006', 'ND100000', NULL, 'hihi', '2026-01-22 10:41:09', 0);

-- --------------------------------------------------------

--
-- Table structure for table `yeucauthue`
--

CREATE TABLE `yeucauthue` (
  `maYeuCau` int(11) NOT NULL,
  `maNguoiThue` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `maPhongTro` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `trangThai` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `ghiChu` text CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
  `ngayYeuCau` datetime NOT NULL DEFAULT current_timestamp(),
  `ngayCapNhat` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `yeucauthue`
--

INSERT INTO `yeucauthue` (`maYeuCau`, `maNguoiThue`, `maPhongTro`, `trangThai`, `ghiChu`, `ngayYeuCau`, `ngayCapNhat`) VALUES
(1, 'ND100000', 'PT00004', 'approved', 'tôi muốn thuê phòng\n', '2025-12-04 10:14:17', '2025-12-04 10:32:11'),
(2, 'ND100001', 'PT00003', 'pending', 'tôi muốn thuê trọ này', '2025-12-04 15:24:58', NULL),
(3, 'ND100001', 'PT00005', 'approved', 'tôi muốn thuê trọ \n', '2025-12-04 15:31:57', '2025-12-04 15:35:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD PRIMARY KEY (`maDanhGia`),
  ADD KEY `fk_danhgia-nguoidung` (`maNguoiDung`),
  ADD KEY `fk_danhgia-phongtro` (`maPhongTro`);

--
-- Indexes for table `dichvu`
--
ALTER TABLE `dichvu`
  ADD PRIMARY KEY (`maDichVu`);

--
-- Indexes for table `hinhanhphong`
--
ALTER TABLE `hinhanhphong`
  ADD PRIMARY KEY (`maHinhAnh`),
  ADD KEY `fk_hinhanhphong-phongtro` (`maPhongTro`);

--
-- Indexes for table `khutro`
--
ALTER TABLE `khutro`
  ADD PRIMARY KEY (`maKhuTro`),
  ADD KEY `fk_khutro_nguoidang` (`maNguoiDang`);

--
-- Indexes for table `khutro_dichvu`
--
ALTER TABLE `khutro_dichvu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_khuTro_dichVu-dichVu` (`maDichVu`),
  ADD KEY `FK_khuTro_dichVu-khuTro` (`maKhuTro`);

--
-- Indexes for table `lichsu_giahan`
--
ALTER TABLE `lichsu_giahan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_phongtro` (`maPhongTro`);

--
-- Indexes for table `loaiphong`
--
ALTER TABLE `loaiphong`
  ADD PRIMARY KEY (`maLoaiPhong`);

--
-- Indexes for table `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`maNguoiDung`);

--
-- Indexes for table `phongtro`
--
ALTER TABLE `phongtro`
  ADD PRIMARY KEY (`maPhongTro`),
  ADD KEY `fk_phongtro-khutro` (`maKhuTro`),
  ADD KEY `fk_phongtro-loaiphong` (`maLoaiPhong`);

--
-- Indexes for table `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tinnhan`
--
ALTER TABLE `tinnhan`
  ADD PRIMARY KEY (`maTinNhan`),
  ADD KEY `fk_tinnhan_nguoigui` (`maNguoiGui`),
  ADD KEY `fk_tinnhan_nguoinhan` (`maNguoiNhan`),
  ADD KEY `fk_tinnhan_phongtro` (`maPhongTro`);

--
-- Indexes for table `yeucauthue`
--
ALTER TABLE `yeucauthue`
  ADD PRIMARY KEY (`maYeuCau`),
  ADD KEY `fk_yeucau_nguoithue` (`maNguoiThue`),
  ADD KEY `fk_yeucau_phongtro` (`maPhongTro`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `khutro_dichvu`
--
ALTER TABLE `khutro_dichvu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `lichsu_giahan`
--
ALTER TABLE `lichsu_giahan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `thongbao`
--
ALTER TABLE `thongbao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `tinnhan`
--
ALTER TABLE `tinnhan`
  MODIFY `maTinNhan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `yeucauthue`
--
ALTER TABLE `yeucauthue`
  MODIFY `maYeuCau` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD CONSTRAINT `fk_danhgia-nguoidung` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_danhgia-phongtro` FOREIGN KEY (`maPhongTro`) REFERENCES `phongtro` (`maPhongTro`) ON UPDATE CASCADE;

--
-- Constraints for table `hinhanhphong`
--
ALTER TABLE `hinhanhphong`
  ADD CONSTRAINT `fk_hinhanhphong-phongtro` FOREIGN KEY (`maPhongTro`) REFERENCES `phongtro` (`maPhongTro`) ON UPDATE CASCADE;

--
-- Constraints for table `khutro`
--
ALTER TABLE `khutro`
  ADD CONSTRAINT `fk_khutro_nguoidang` FOREIGN KEY (`maNguoiDang`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE;

--
-- Constraints for table `khutro_dichvu`
--
ALTER TABLE `khutro_dichvu`
  ADD CONSTRAINT `FK_khuTro_dichVu-dichVu` FOREIGN KEY (`maDichVu`) REFERENCES `dichvu` (`maDichVu`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_khuTro_dichVu-khuTro` FOREIGN KEY (`maKhuTro`) REFERENCES `khutro` (`maKhuTro`);

--
-- Constraints for table `phongtro`
--
ALTER TABLE `phongtro`
  ADD CONSTRAINT `fk_phongtro-khutro` FOREIGN KEY (`maKhuTro`) REFERENCES `khutro` (`maKhuTro`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phongtro-loaiphong` FOREIGN KEY (`maLoaiPhong`) REFERENCES `loaiphong` (`maLoaiPhong`) ON UPDATE CASCADE;

--
-- Constraints for table `tinnhan`
--
ALTER TABLE `tinnhan`
  ADD CONSTRAINT `fk_tinnhan_nguoigui` FOREIGN KEY (`maNguoiGui`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tinnhan_nguoinhan` FOREIGN KEY (`maNguoiNhan`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tinnhan_phongtro` FOREIGN KEY (`maPhongTro`) REFERENCES `phongtro` (`maPhongTro`) ON UPDATE CASCADE;

--
-- Constraints for table `yeucauthue`
--
ALTER TABLE `yeucauthue`
  ADD CONSTRAINT `fk_yeucau_nguoithue` FOREIGN KEY (`maNguoiThue`) REFERENCES `nguoidung` (`maNguoiDung`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_yeucau_phongtro` FOREIGN KEY (`maPhongTro`) REFERENCES `phongtro` (`maPhongTro`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
