# Personal Finance App - Ứng Dụng Quản Lý Chi Tiêu Cá Nhân

Ứng dụng web quản lý chi tiêu cá nhân được xây dựng với React (Frontend) và Node.js + MongoDB (Backend).

## Yêu Cầu Hệ Thống

- **Node.js**: Phiên bản 16.x trở lên ([Tải tại đây](https://nodejs.org/))
- **npm**: Đi kèm với Node.js
- **Kết nối Internet**: Để kết nối MongoDB Atlas

## Hướng Dẫn Cài Đặt

### QUAN TRỌNG: Phải thực hiện theo đúng thứ tự

### Bước 1: Giải nén và mở thư mục project

Giải nén file zip và mở terminal/command prompt tại thư mục gốc của project.

### Bước 2: Cài đặt Backend (SERVER) - BẮT BUỘC ⭐

```bash
cd server
npm install
```

**Lưu ý**: Bước này rất quan trọng! Nếu bỏ qua sẽ gặp lỗi "Cannot find module 'express'"

### Bước 3: Cài đặt Frontend (CLIENT) - BẮT BUỘC ⭐

Mở terminal mới (giữ nguyên terminal cũ) hoặc quay về thư mục gốc:

```bash
cd client
npm install
```

### Bước 4: Chạy Backend Server

Trong terminal tại thư mục `server`:

```bash
npm start
```

**Kết quả mong đợi:**
```
Attempting to connect to MongoDB...
>>> MongoDB connected successfully
>>> Server running on port 5000
```

=> Nếu thấy dòng "MongoDB connected successfully" → Backend đã chạy thành công!

### Bước 5: Chạy Frontend Client

Mở terminal mới khác, tại thư mục `client`:

```bash
npm run dev
```

**Kết quả mong đợi:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Bước 6: Truy cập ứng dụng

Mở trình duyệt và truy cập: **http://localhost:5173**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Cấu Trúc Project

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Các component UI
│   │   ├── pages/         # Các trang
│   │   └── services/      # API services
│   └── package.json
│
├── server/                 # Backend Node.js
│   ├── controllers/       # Xử lý logic
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── .env              # Cấu hình (đã có sẵn)
│   ├── server.js         # Entry point
│   └── package.json
│
└── README.md             # File này
```

## Cấu Hình

### Environment Variables

Tạo file `.env`  trong thư mục `server/` bao gồm:
MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
PORT=5000  

Database đã được thiết lập cho phép truy cập từ mọi IP (0.0.0.0/0) để tiện cho việc chạy và test.

## Chức Năng Chính

- **Đăng ký/Đăng nhập**: Xác thực người dùng với JWT
- **Quản lý chi tiêu**: Thêm, xem, sửa, xóa các khoản chi
- **Dashboard**: Xem tổng quan thu chi
- **Báo cáo**: Thống kê chi tiêu theo thời gian

##  Xử Lý Lỗi Thường Gặp

### Lỗi: "Cannot find module 'express'" (hoặc module khác)

**Nguyên nhân**: Chưa cài đặt dependencies trong thư mục `server`

**Giải pháp**:
```bash
cd server
npm install
```

### Lỗi: "MongoDB connection error"

**Nguyên nhân**: 
- Không có kết nối Internet
- File `.env` bị thiếu hoặc sai

**Giải pháp**:
1. Kiểm tra kết nối Internet
2. Đảm bảo file `server/.env` tồn tại và có nội dung đúng

### Lỗi: "Port 5000 already in use"

**Nguyên nhân**: Cổng 5000 đã được sử dụng bởi ứng dụng khác

**Giải pháp**:
- Tắt ứng dụng đang dùng port 5000
- Hoặc đổi PORT trong file `.env`: `PORT=5001`

### Lỗi: "Port 5173 already in use"

**Nguyên nhân**: Cổng 5173 đã được sử dụng

**Giải pháp**:
- Tắt ứng dụng Vite khác đang chạy
- Hoặc Vite sẽ tự động đề xuất port khác (5174, 5175...)

### Frontend không gọi được API Backend

**Kiểm tra**:
1. Backend có đang chạy không? (xem terminal backend)
2. URL trong `client/src/services/api.js` có đúng không?
3. CORS đã được cấu hình trong `server/server.js`

## Lệnh Hữu Ích

### Backend (trong thư mục server/)
```bash
npm install          # Cài đặt dependencies
npm start           # Chạy server
```

### Frontend (trong thư mục client/)
```bash
npm install          # Cài đặt dependencies
npm run dev         # Chạy development server
npm run build       # Build production
npm run preview     # Xem bản build
```

## Thông Tin Database

- **Database**: MongoDB Atlas
- **Cluster**: FinanceCluster
- **Database Name**: financeDB
- **IP Access**: Cho phép tất cả IP (0.0.0.0/0)

## Ghi Chú

- Đảm bảo cả 2 terminal (backend và frontend) đều đang chạy khi sử dụng ứng dụng
- Nếu gặp lỗi, hãy đọc kỹ thông báo lỗi trong terminal
- Khi đóng ứng dụng, nhấn `Ctrl + C` trong cả 2 terminal

## Công Nghệ Sử Dụng

**Frontend:**
- React 19
- React Router Dom
- Axios
- Tailwind CSS
- Lucide React (icons)
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- Bcrypt.js
- CORS

---

## Checklist Trước Khi Nộp Bài

- [ ] Đã xóa thư mục `node_modules` trong `server/` và `client/`
- [ ] File `server/.env` có trong project
- [ ] Entry IP `0.0.0.0/0` đang Active trong MongoDB Atlas
- [ ] File `README.md` đã được thêm vào
- [ ] Đã test lại bằng cách:
  - Giải nén file zip
  - Chạy `npm install` ở cả 2 thư mục
  - Chạy backend và frontend
  - Test đăng ký/đăng nhập

---

**Lưu ý**: Nếu vẫn gặp vấn đề, vui lòng kiểm tra lại:
1. Đã cài Node.js chưa? → Gõ `node -v` để kiểm tra
2. Đã chạy `npm install` trong cả 2 thư mục `server` VÀ `client` chưa?
3. File `server/.env` có tồn tại không?
4. Có kết nối Internet không?
