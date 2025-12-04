# QL_NHA_TRO

He thong quan ly nha tro - Tra cuu phong tro

## Cong nghe su dung
- Frontend: React.js
- Backend: Node.js, Express
- Database: MySQL

## Cai dat

### Lan dau tien
cd Backend
npm install

cd ../Frontend
npm install

### Chay du an
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend
cd Frontend
npm start

## Tai khoan dang nhap

### Tao tai khoan Admin
Chay SQL sau trong phpMyAdmin de tao tai khoan admin:

INSERT INTO nguoidung (maNguoiDung, tenNguoiDung, matKhau, tenDangNhap, sdtNguoiDung, emailNguoiDung, vaiTro, ngayDangKy) 
VALUES ('ND99999', 'Administrator', 'admin123', 'admin', '0123456789', 'admin@gmail.com', 'admin', NOW());

**Thong tin dang nhap Admin:**
- Ten dang nhap: admin
- Mat khau: admin123
- Truy cap trang admin: http://localhost:3000/admin

### Cac vai tro trong he thong
| Vai tro | Mo ta | Duong dan |
|---------|-------|-----------|
| user | Nguoi dung thuong - Tim kiem, xem phong tro | / |
| landlord | Chu tro - Dang tin, quan ly phong | /landlord |
| admin | Quan tri vien - Quan ly toan bo he thong | /admin |

### Chuc nang Admin
- Thong ke tong quan (nguoi dung, phong tro, yeu cau)
- Quan ly nguoi dung (them, sua, xoa, doi vai tro)
- Quan ly phong tro (xem, doi trang thai, xoa)
- Xem danh sach yeu cau thue phong
