# 💈 Booking System — MongoDB Edition

Full booking system with real MongoDB database, JWT auth, and RTL support.

## 📁 Structure
```
booking-project/
├── server/           ← Node.js + Express + MongoDB
│   ├── server.js
│   ├── seed.js       ← Run once to load demo data
│   ├── .env          ← Set your MONGO_URI here
│   ├── models/
│   │   └── index.js  ← Mongoose schemas
│   └── package.json
├── customer-app/     ← React customer app (RTL, light/dark)
└── admin-app/        ← React admin panel (RTL, light/dark)
```

## 🚀 Setup

### 1. MongoDB
**Option A — Local:**
- Install MongoDB: https://www.mongodb.com/try/download/community
- It runs automatically on `mongodb://localhost:27017`

**Option B — MongoDB Atlas (free cloud):**
- Go to https://cloud.mongodb.com → create free cluster
- Get your connection string:
  `mongodb+srv://<user>:<pass>@cluster.mongodb.net/booking`

### 2. Configure the server
Edit `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/booking
JWT_SECRET=your_long_random_secret_here
PORT=4000
```

### 3. Install & seed
```bash
cd server
npm install
node seed.js    ← loads demo users, services, staff, bookings
node server.js  ← start the API
```

### 4. Customer App
```bash
cd customer-app
npm install
npm start       ← http://localhost:3000
```

### 5. Admin Panel
```bash
cd admin-app
npm install
npm start       ← http://localhost:3001
```

## 🔑 Demo Credentials
| Role     | Email              | Password |
|----------|--------------------|----------|
| Admin    | admin@demo.com     | admin123 |
| Customer | user@demo.com      | 123456   |
| Customer | layla@demo.com     | 123456   |

## 📡 API Reference
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

GET    /api/services
POST   /api/services          (admin)
PUT    /api/services/:id      (admin)
DELETE /api/services/:id      (admin)

GET    /api/staff
POST   /api/staff             (admin)
PUT    /api/staff/:id         (admin)
DELETE /api/staff/:id         (admin)

GET    /api/bookings          (my bookings)
POST   /api/bookings          (create)
PUT    /api/bookings/:id/cancel

GET    /api/admin/bookings    (admin)
PUT    /api/admin/bookings/:id (admin)
DELETE /api/admin/bookings/:id (admin)

GET    /api/admin/users       (admin)
DELETE /api/admin/users/:id   (admin)

GET    /api/admin/stats       (admin)
GET    /api/slots?date=YYYY-MM-DD
GET    /api/health
```

## 📱 Phone Access
Find your PC IP with `ipconfig` (Windows) and update:
- `customer-app/src/App.js` line 3: `const API = "http://YOUR_IP:4000/api";`
- Then open `http://YOUR_IP:3000` on your phone
