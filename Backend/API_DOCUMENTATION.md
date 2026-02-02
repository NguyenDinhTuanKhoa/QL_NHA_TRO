# TÀI LIỆU API BACKEND - HỆ THỐNG QUẢN LÝ PHÒNG TRỌ TRÀ VINH

## 🔧 Cấu hình Server
- **Base URL**: `http://localhost:5000/api`
- **Database**: MySQL (phongtro_db)
- **Authentication**: JWT Bearer Token
- **Port**: 5000

## 🔐 Authentication Header
Các endpoint yêu cầu đăng nhập cần header:
```
Authorization: Bearer <token>
```

---

## 📋 DANH SÁCH API ENDPOINTS

### 1️⃣ AUTH APIs (`/api/auth`)

#### 1.1 Đăng ký
```http
POST /api/auth/register
```
**Body:**
```json
{
  "fullname": "string (required)",
  "username": "string (required)",
  "password": "string (required)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "vaiTro": "user | landlord (default: user)"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công"
}
```

#### 1.2 Đăng nhập
```http
POST /api/auth/login
```
**Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "jwt_token",
  "user": {
    "maNguoiDung": "ND00001",
    "tenNguoiDung": "Trần Văn A",
    "tenDangNhap": "tranvana",
    "email": "tranvana@gmail.com",
    "phone": "0123456789",
    "vaiTro": "user | landlord | admin"
  }
}
```

#### 1.3 Lấy thông tin user hiện tại
```http
GET /api/auth/me
```
**Auth:** Required  
**Response:**
```json
{
  "success": true,
  "user": {
    "maNguoiDung": "ND00001",
    "tenNguoiDung": "Trần Văn A",
    "tenDangNhap": "tranvana",
    "emailNguoiDung": "tranvana@gmail.com",
    "sdtNguoiDung": "0123456789",
    "vaiTro": "user"
  }
}
```

---

### 2️⃣ PHÒNG TRỌ APIs (`/api/phongtro`)

#### 2.1 Lấy danh sách phòng trọ
```http
GET /api/phongtro
```
**Auth:** Optional  
**Query Params:**
- `location`: Địa điểm (tìm kiếm trong địa chỉ)
- `maxPrice`: Giá tối đa
- `area`: Diện tích (`0-20`, `20-50`, `above-50`)
- `status`: Trạng thái (`empty`, `rented`)
- `page`: Trang (default: 1)
- `limit`: Số lượng/trang (default: 12)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "maPhongTro": "PT00001",
      "dienTich": 12,
      "tinhTrang": "empty",
      "ngayDang": "2024-12-24",
      "giaPhong": 500000,
      "tenLoaiPhong": "Loại 1",
      "moTaPhongTro": "Mô tả...",
      "maKhuTro": "KT00001",
      "tenKhuTro": "Phòng trọ bà Sáu Tây",
      "diaChi": "Quán nhậu Cầu Lông Bình 3...",
      "chuTro": "Thảo Uyên",
      "sdtChuTro": "0559740592",
      "googleMap": "9.972942842412204, 106.33459978973937",
      "anhDaiDien": "../images/phong_tro_1.jpg",
      "diemTrungBinh": 4.5,
      "soLuongDanhGia": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

#### 2.2 Lấy chi tiết phòng trọ
```http
GET /api/phongtro/:id
```
**Auth:** Optional  
**Response:**
```json
{
  "success": true,
  "data": {
    "maPhongTro": "PT00001",
    "dienTich": 12,
    "tinhTrang": "empty",
    "ngayDang": "2024-12-24",
    "giaPhong": 500000,
    "tenLoaiPhong": "Loại 1",
    "moTaPhongTro": "Mô tả chi tiết...",
    "tenKhuTro": "Phòng trọ bà Sáu Tây",
    "diaChi": "Quán nhậu Cầu Lông Bình 3...",
    "chuTro": "Thảo Uyên",
    "sdtChuTro": "0559740592",
    "googleMap": "9.972942842412204, 106.33459978973937",
    "anhDaiDien": "../images/phong_tro_1.jpg",
    "hinhAnh": "image1.jpg\r\nimage2.jpg",
    "danhSachHinhAnh": ["image1.jpg", "image2.jpg"],
    "diemTrungBinh": 4.5,
    "soLuongDanhGia": 3,
    "danhGia": [
      {
        "maDanhGia": "DG00001",
        "maNguoiDung": "ND00001",
        "tenNguoiDung": "Trần Văn A",
        "maPhongTro": "PT00001",
        "diemSo": 5,
        "nhanXet": "Phòng trọ rất tốt",
        "ngayNhanXet": "2024-12-27 09:30:24"
      }
    ],
    "dichVu": [
      {
        "maDichVu": "DV00003",
        "tenDichVu": "Tiền Nước",
        "donVi": "Khối",
        "moTaDichVu": "Tiền nước sinh hoạt",
        "giaCa": 3500
      }
    ]
  }
}
```

#### 2.3 Thêm đánh giá
```http
POST /api/phongtro/review
```
**Auth:** Required  
**Body:**
```json
{
  "maPhongTro": "PT00001",
  "diemSo": 5,
  "nhanXet": "Phòng trọ rất tốt, sạch sẽ"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Đánh giá thành công"
}
```

---

### 3️⃣ LANDLORD APIs (`/api/landlord`)
**Auth:** Required (Vai trò: landlord hoặc admin)

#### 3.1 Thống kê Dashboard
```http
GET /api/landlord/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalKhuTro": 5,
    "totalPhongTro": 25,
    "totalPhongTrong": 10,
    "totalYeuCauMoi": 3
  }
}
```

#### 3.2 Lấy danh sách khu trọ
```http
GET /api/landlord/khutro
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "maKhuTro": "KT00001",
      "tenKhuTro": "Phòng trọ bà Sáu Tây",
      "diaChi": "Quán nhậu Cầu Lông Bình 3...",
      "chuTro": "Thảo Uyên",
      "sdtChuTro": "0559740592",
      "googleMap": "9.972942842412204, 106.33459978973937",
      "maNguoiDang": "ND00006"
    }
  ]
}
```

#### 3.3 Thêm khu trọ
```http
POST /api/landlord/khutro
```
**Body:**
```json
{
  "tenKhuTro": "Khu trọ mới",
  "diaChi": "123 Đường ABC",
  "chuTro": "Nguyễn Văn A",
  "sdtChuTro": "0123456789",
  "googleMap": "9.972942, 106.334599"
}
```

#### 3.4 Lấy danh sách phòng trọ của chủ trọ
```http
GET /api/landlord/phongtro
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "maPhongTro": "PT00001",
      "dienTich": 12,
      "tinhTrang": "empty",
      "ngayDang": "2024-12-24",
      "trangThaiDongTien": "chua_dong",
      "ngayCapNhatDongTien": "2025-12-18",
      "ngayBatDauThue": "2026-01-01",
      "ngayHetHan": "2026-02-01",
      "tenKhuTro": "Khu trọ ABC",
      "diaChi": "123 Đường ABC",
      "giaPhong": 500000,
      "tenLoaiPhong": "Loại 1",
      "anhDaiDien": "/uploads/room.jpg",
      "maNguoiThue": "ND00001",
      "tenNguoiThue": "Trần Văn A",
      "sdtNguoiThue": "0123456789"
    }
  ]
}
```

#### 3.5 Thêm phòng trọ
```http
POST /api/landlord/phongtro
```
**Content-Type:** multipart/form-data  
**Body:**
```
maKhuTro: KT00001
maLoaiPhong: LP00001
dienTich: 25
tinhTrang: empty (optional, default: empty)
hinhAnh: [file1, file2, ...] (max 10 files)
```

#### 3.6 Cập nhật trạng thái phòng
```http
PATCH /api/landlord/phongtro/:id/status
```
**Body:**
```json
{
  "tinhTrang": "empty | rented"
}
```

#### 3.7 Cập nhật trạng thái đóng tiền
```http
PATCH /api/landlord/phongtro/:id/payment
```
**Body:**
```json
{
  "trangThaiDongTien": "da_dong | chua_dong"
}
```
**Note:** Tự động gửi thông báo cho người thuê

#### 3.8 Xóa phòng trọ
```http
DELETE /api/landlord/phongtro/:id
```

#### 3.9 Lấy danh sách loại phòng
```http
GET /api/landlord/loaiphong
```

#### 3.10 Thêm loại phòng
```http
POST /api/landlord/loaiphong
```
**Body:**
```json
{
  "tenLoaiPhong": "Loại VIP",
  "giaPhong": 3000000,
  "moTaPhongTro": "Phòng cao cấp..."
}
```

#### 3.11 Lấy yêu cầu thuê phòng
```http
GET /api/landlord/yeucau
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "maYeuCau": 1,
      "maNguoiThue": "ND00001",
      "maPhongTro": "PT00001",
      "trangThai": "pending | approved | rejected",
      "ghiChu": "Tôi muốn thuê phòng này",
      "ngayYeuCau": "2025-12-04 10:14:17",
      "ngayCapNhat": null,
      "tenNguoiDung": "Trần Văn A",
      "sdtNguoiDung": "0123456789",
      "emailNguoiDung": "tranvana@gmail.com",
      "tenKhuTro": "Khu trọ ABC",
      "diaChi": "123 Đường ABC",
      "dienTich": 25,
      "giaPhong": 500000
    }
  ]
}
```

#### 3.12 Cập nhật trạng thái yêu cầu
```http
PATCH /api/landlord/yeucau/:id
```
**Body:**
```json
{
  "trangThai": "approved | rejected"
}
```
**Note:** 
- Nếu approved: Tự động cập nhật phòng thành `rented`, set ngày bắt đầu thuê và hết hạn (mặc định 1 tháng)
- Gửi thông báo cho người thuê

#### 3.13 Gia hạn thuê phòng
```http
POST /api/landlord/phongtro/:id/extend
```
**Body:**
```json
{
  "soThang": 2
}
```
**Response:**
```json
{
  "success": true,
  "message": "Gia hạn thành công",
  "data": {
    "ngayBatDauThueMoi": "2026-02-01",
    "ngayHetHanMoi": "2026-04-01"
  }
}
```
**Note:** 
- Lưu lịch sử gia hạn vào bảng `lichsu_giahan`
- Cập nhật trạng thái đóng tiền thành `da_dong`
- Gửi thông báo cho người thuê

#### 3.14 Kiểm tra phòng hết hạn
```http
POST /api/landlord/check-expired
```
**Response:**
```json
{
  "success": true,
  "message": "Đã cập nhật 3 phòng sang trạng thái chưa đóng tiền",
  "expiredCount": 3
}
```
**Note:** 
- Tự động chuyển trạng thái phòng hết hạn thành `chua_dong`
- Gửi thông báo cho chủ trọ và người thuê

#### 3.15 Gửi nhắc nhở đóng tiền
```http
POST /api/landlord/send-payment-reminder
```
**Response:**
```json
{
  "success": true,
  "message": "Đã gửi 5 thông báo nhắc đóng tiền",
  "sentCount": 5
}
```
**Note:** Gửi thông báo cho tất cả người thuê chưa đóng tiền

---

### 4️⃣ MESSAGE APIs (`/api/message`)
**Auth:** Required

#### 4.1 Lấy danh sách cuộc hội thoại
```http
GET /api/message/conversations
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "partnerId": "ND00006",
      "partnerName": "Nguyễn Văn B",
      "partnerRole": "landlord",
      "lastMessage": "Phòng còn trống không?",
      "lastTime": "2025-12-04 13:00:02",
      "unreadCount": 2
    }
  ]
}
```

#### 4.2 Lấy tin nhắn với một người
```http
GET /api/message/:partnerId
```
**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "maTinNhan": 1,
        "maNguoiGui": "ND00001",
        "maNguoiNhan": "ND00006",
        "maPhongTro": null,
        "noiDung": "Xin chào!",
        "thoiGian": "2025-12-04 10:46:41",
        "daDoc": 1,
        "senderName": "Trần Văn A"
      }
    ],
    "partner": {
      "maNguoiDung": "ND00006",
      "tenNguoiDung": "Nguyễn Văn B",
      "sdtNguoiDung": "0123456789",
      "vaiTro": "landlord"
    }
  }
}
```
**Note:** Tự động đánh dấu tin nhắn đã đọc

#### 4.3 Gửi tin nhắn
```http
POST /api/message/send
```
**Body:**
```json
{
  "maNguoiNhan": "ND00006",
  "noiDung": "Xin chào, phòng còn trống không?",
  "maPhongTro": "PT00001" (optional)
}
```

#### 4.4 Gửi yêu cầu thuê phòng
```http
POST /api/message/yeucau
```
**Body:**
```json
{
  "maPhongTro": "PT00001",
  "ghiChu": "Tôi muốn thuê phòng này từ ngày 1/2/2026"
}
```

#### 4.5 Lấy yêu cầu của tôi
```http
GET /api/message/yeucau/my
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "maYeuCau": 1,
      "maNguoiThue": "ND00001",
      "maPhongTro": "PT00001",
      "trangThai": "pending",
      "ghiChu": "Tôi muốn thuê...",
      "ngayYeuCau": "2025-12-04 10:14:17",
      "ngayCapNhat": null,
      "dienTich": 25,
      "ngayBatDauThue": null,
      "ngayHetHan": null,
      "trangThaiDongTien": "chua_dong",
      "tenKhuTro": "Khu trọ ABC",
      "diaChi": "123 Đường ABC",
      "giaPhong": 500000,
      "tenLoaiPhong": "Loại 1",
      "anhDaiDien": "/uploads/room.jpg",
      "maChuTro": "ND00006",
      "tenChuTro": "Nguyễn Văn B",
      "sdtChuTro": "0123456789"
    }
  ]
}
```

---

### 5️⃣ NOTIFICATION APIs (`/api/notification`)
**Auth:** Required

#### 5.1 Lấy danh sách thông báo
```http
GET /api/notification
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "maNguoiNhan": "ND00001",
      "tieuDe": "Xác nhận đã đóng tiền phòng",
      "noiDung": "Chủ trọ đã xác nhận...",
      "loaiThongBao": "dong_tien | he_thong | yeu_cau | het_han | gia_han",
      "maPhongTro": "PT00001",
      "ngayGui": "2025-12-04 15:37:19",
      "daXem": 0
    }
  ],
  "unreadCount": 5
}
```

#### 5.2 Đánh dấu đã xem một thông báo
```http
PATCH /api/notification/:id/read
```

#### 5.3 Đánh dấu tất cả đã xem
```http
PATCH /api/notification/read-all
```

#### 5.4 Kiểm tra và gửi thông báo đóng tiền
```http
POST /api/notification/check-payment
```
**Note:** Kiểm tra các phòng chưa đóng tiền quá 25 ngày và gửi thông báo

---

### 6️⃣ ADMIN APIs (`/api/admin`)
**Auth:** Required (Vai trò: admin)

#### 6.1 Thống kê tổng quan
```http
GET /api/admin/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 50,
    "totalLandlords": 10,
    "totalRooms": 100,
    "totalRequests": 30,
    "pendingRequests": 5
  }
}
```

#### 6.2 Lấy danh sách người dùng
```http
GET /api/admin/users
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "maNguoiDung": "ND00001",
      "tenNguoiDung": "Trần Văn A",
      "email": "tranvana@gmail.com",
      "soDienThoai": "0123456789",
      "vaiTro": "user | landlord | admin",
      "ngayTao": "2024-12-28 08:58:55"
    }
  ]
}
```

#### 6.3 Thêm người dùng
```http
POST /api/admin/users
```
**Body:**
```json
{
  "tenNguoiDung": "Nguyễn Văn B",
  "tenDangNhap": "nguyenvanb",
  "matKhau": "password123",
  "emailNguoiDung": "nguyenvanb@gmail.com",
  "sdtNguoiDung": "0987654321",
  "vaiTro": "user"
}
```

#### 6.4 Cập nhật người dùng
```http
PUT /api/admin/users/:id
```
**Body:**
```json
{
  "tenNguoiDung": "Nguyễn Văn B",
  "matKhau": "newpassword" (optional),
  "emailNguoiDung": "nguyenvanb@gmail.com",
  "sdtNguoiDung": "0987654321",
  "vaiTro": "landlord"
}
```

#### 6.5 Cập nhật vai trò người dùng
```http
PATCH /api/admin/users/:id/role
```
**Body:**
```json
{
  "vaiTro": "user | landlord | admin"
}
```

#### 6.6 Xóa người dùng
```http
DELETE /api/admin/users/:id
```

#### 6.7 Lấy tất cả phòng trọ
```http
GET /api/admin/rooms
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "maPhong": "PT00001",
      "tenPhong": "Loại 1",
      "tenKhuTro": "Khu trọ ABC",
      "dienTich": 25,
      "giaThue": 500000,
      "trangThai": "empty | rented",
      "ngayDang": "2024-12-24",
      "tenChuTro": "Nguyễn Văn B"
    }
  ]
}
```

#### 6.8 Cập nhật trạng thái phòng
```http
PATCH /api/admin/rooms/:id/status
```
**Body:**
```json
{
  "trangThai": "available | rented"
}
```
**Note:** Map `available` → `empty` trong database

#### 6.9 Xóa phòng
```http
DELETE /api/admin/rooms/:id
```

#### 6.10 Lấy tất cả yêu cầu thuê
```http
GET /api/admin/requests
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "maYeuCau": 1,
      "tenNguoiDung": "Trần Văn A",
      "soDienThoai": "0123456789",
      "tenPhong": "Loại 1",
      "giaThue": 500000,
      "trangThai": "pending | approved | rejected",
      "ghiChu": "Tôi muốn thuê...",
      "ngayTao": "2025-12-04 10:14:17"
    }
  ]
}
```

---

## 🔔 LOẠI THÔNG BÁO

1. **dong_tien**: Thông báo về đóng tiền (đã đóng, nhắc đóng)
2. **he_thong**: Thông báo hệ thống
3. **yeu_cau**: Thông báo về yêu cầu thuê phòng
4. **het_han**: Thông báo phòng hết hạn thuê
5. **gia_han**: Thông báo gia hạn thuê phòng thành công

---

## 📊 TRẠNG THÁI

### Trạng thái phòng (tinhTrang):
- `empty`: Phòng trống
- `rented`: Đã cho thuê

### Trạng thái đóng tiền (trangThaiDongTien):
- `da_dong`: Đã đóng tiền
- `chua_dong`: Chưa đóng tiền

### Trạng thái yêu cầu (trangThai):
- `pending`: Đang chờ duyệt
- `approved`: Đã duyệt
- `rejected`: Đã từ chối

### Vai trò (vaiTro):
- `user`: Người dùng thông thường
- `landlord`: Chủ trọ
- `admin`: Quản trị viên

---

## ⚠️ LƯU Ý

1. **Upload File**: Giới hạn 5MB/file, max 10 files, chỉ chấp nhận hình ảnh (jpeg, jpg, png, gif, webp)
2. **Phân quyền**: 
   - User: Xem phòng, đánh giá, gửi yêu cầu thuê
   - Landlord: Quản lý khu trọ, phòng trọ, yêu cầu thuê của mình
   - Admin: Toàn quyền trên hệ thống
3. **Tự động gửi thông báo**: 
   - Khi duyệt yêu cầu thuê
   - Khi cập nhật trạng thái đóng tiền
   - Khi gia hạn phòng
   - Khi phòng hết hạn
4. **Gia hạn phòng**: Tự động cập nhật trạng thái đóng tiền thành `da_dong`
5. **Kiểm tra hết hạn**: Nên chạy định kỳ để cập nhật trạng thái phòng

---

## 🧪 TESTING

### Tài khoản test:
```
Admin:
- Username: admin
- Password: 123456

Landlord:
- Username: khoa
- Password: 123456

User:
- Username: khang
- Password: 123456
```

### Health Check:
```http
GET /api/health
```
**Response:**
```json
{
  "status": "OK",
  "message": "Server đang chạy"
}
```

---

**Ngày cập nhật:** 22/01/2026  
**Phiên bản:** 1.0.0
