# Database - Phòng Trọ Trà Vinh

## Hướng dẫn cài đặt

### 1. Sử dụng XAMPP
1. Mở XAMPP Control Panel
2. Start MySQL
3. Mở phpMyAdmin (http://localhost/phpmyadmin)

### 2. Tạo Database
1. Tạo database mới tên: `phongtro_db`
2. Import file `phongtro_db.sql`

### 3. Hoặc chạy lệnh MySQL
```sql
CREATE DATABASE phongtro_db;
USE phongtro_db;
SOURCE phongtro_db.sql;
```

## Cấu trúc Database

| Bảng | Mô tả |
|------|-------|
| nguoidung | Thông tin người dùng (user, landlord, admin) |
| khutro | Thông tin khu trọ |
| phongtro | Thông tin phòng trọ |
| loaiphong | Loại phòng và giá |
| hinhanhphong | Hình ảnh phòng trọ |
| dichvu | Dịch vụ (điện, nước) |
| khutro_dichvu | Liên kết khu trọ - dịch vụ |
| danhgia | Đánh giá phòng trọ |
| tinnhan | Tin nhắn chat |
| yeucauthue | Yêu cầu thuê phòng |

## Vai trò người dùng

- `user`: Người tìm trọ
- `landlord`: Chủ trọ
- `admin`: Quản trị viên
