# 🏥 Nurse Shift & Leave Management Backend

ระบบ backend สำหรับจัดการเวร (Shift) และการลางาน (Leave) ของพยาบาล โดยใช้ Node.js, Express, MySQL และ JWT Authentication

## 📁 โครงสร้างโปรเจกต์

```
.
├── server.js           # Entry point
├── config              
|   └──db.js            # MySQL connection
├── middleware
│   └── auth.middleware.js         
├── routes
│   ├── auth.routes.js        
│   ├── shift.routes.js       
│   ├── leave.routes.js       
|   └── user.routes.js
├── controllers
│   ├── auth.controller.js
│   ├── shift.controller.js
│   ├── leave.controller.js
|   └── user.controller.js
├── .env                # สำหรับ SECRET_KEY และ DB config
└── README.md
```

## 🛠️ เทคโนโลยีที่ใช้

- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- bcryptjs (สำหรับ hash password)
- dotenv

## ⚙️ การติดตั้งและใช้งาน

1. **Clone Project**

```bash
git clone https://github.com/mkwtt/nurse-shift-api.git
cd nurse-shift-api
```

2. **ติดตั้ง dependencies**

```bash
npm install
```

3. **ตั้งค่า .env**
   สร้างไฟล์ `.env` แล้วเพิ่มค่าต่อไปนี้:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nurse_schedule_db
JWT_SECRET=your_secret_key
PORT=8000
```

4. **สร้างตารางใน MySQL**

```sql
CREATE TABLE tb_users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('nurse', 'head_nurse') NOT NULL
);

CREATE TABLE tb_shifts (
  shift_id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE TABLE tb_shift_assignments (
  shift_assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  shift_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES tb_users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (shift_id) REFERENCES tb_shifts(shift_id) ON DELETE CASCADE
);

CREATE TABLE tb_leave_requests (
  leave_request_id INT AUTO_INCREMENT PRIMARY KEY,
  shift_assignment_id INT NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  approved_by INT,
  FOREIGN KEY (shift_assignment_id) REFERENCES tb_shift_assignments(shift_assignment_id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES tb_users(user_id)
);
```

5. **เริ่มเซิร์ฟเวอร์**

```bash
npm run dev
```

## 📌 API Endpoint Summary

### 🔐 Auth & Users

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/auth/register` | สมัครผู้ใช้ใหม่ พร้อมระบุ role |
| POST   | `/auth/login`    | เข้าสู่ระบบและรับ JWT          |

### 🕒 Shifts

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/shifts`            | หัวหน้าสร้างเวรใหม่          |
| GET    | `/shifts`            | หัวหน้าดูเวรทั้งหมดที่สร้าง     |
| POST   | `/shift-assignments` | หัวหน้าจัดเวรให้พยาบาล       |
| GET    | `/shift-assignments` | หัวหน้าดูเวรทั้งหมดที่จัดให้พยาบาล   |
| GET    | `/my-schedule`       | พยาบาลดูเวรของตัวเอง |

### 📝 Leave Requests

| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| POST   | `/leaves/leave-requests`      | พยาบาลขอลา                  |
| GET    | `/leaves/leave-requests`      | หัวหน้าดูคำขอลาทั้งหมด      |
| PATCH  | `/leaves/leave-requests/:id/approve` | หัวหน้าอนุมัติ/ปฏิเสธคำขอลา |
| GET    | `/leaves/my-leave-requests`   | พยาบาลดูคำขอลา      |

### Users
| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| GET    | `/users/view-users`           | หัวหน้าดูผู้ใช้งานทั้งหมด      |

## ✅ JWT Middleware

ใช้ในไฟล์ `middleware/auth.middleware.js`:

- ตรวจสอบ token
- แยก role (`nurse` / `head_nurse`)
- ใช้ `checkRole('head_nurse')` สำหรับ endpoint ที่จำกัดสิทธิ์

## ✍️ ผู้พัฒนา

- ชื่อ: Wuttinan Imaem
- GitHub: [github.com/mkwtt](https://github.com/mkwtt)
