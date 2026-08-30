# 🏛️ FARMS - Faculty Availability & Room Management System

An institutional, real-time classroom, laboratory, and faculty management portal for **Bulacan State University (BSU)**.

---

## 📂 Project Architecture

```
FARMS/
├── backend/                        # Node.js + Express REST API
│   ├── config/                     # Data stores, DB configuration
│   │   └── db.js
│   ├── controllers/                # Business logic & route handlers
│   │   ├── authController.js       # Login & JWT authentication
│   │   ├── roomController.js       # Room status, availability & updates
│   │   ├── facultyController.js    # Faculty schedules & directory
│   │   └── requestController.js    # Access requests & activity logs
│   ├── routes/                     # Express router endpoints
│   │   ├── authRoutes.js           # /api/auth/*
│   │   ├── roomRoutes.js           # /api/rooms/*
│   │   ├── facultyRoutes.js        # /api/faculty/*
│   │   └── requestRoutes.js        # /api/requests/*
│   ├── server.js                   # Main application entrypoint
│   └── package.json
│
├── frontend/                       # Static Web Portals (HTML5/CSS3/JS)
│   ├── assets/                     # Media & Static Files
│   │   └── images/                 # Campus backgrounds, avatars, seals
│   ├── css/                        # Modular Stylesheets
│   │   ├── dashboard.css           # Main portal shell, cards, maps & responsive styles
│   │   ├── login.css               # Authentication portal styles & foggy glow
│   │   └── cyber-theme.css         # Optional futuristic theme overlay
│   ├── js/                         # Client Scripts
│   │   ├── login.js                # Auth validation & role-based routing
│   │   ├── dashboard.js            # Admin Operations Hub, blueprints & room editor
│   │   ├── faculty.js              # Faculty room matrix, status & reservation forms
│   │   └── student.js              # Student classroom locator & vector maps
│   ├── index.html                  # Root landing & auto-redirect
│   ├── login.html                  # Login Portal (Admin, Faculty, Student)
│   ├── dashboard.html              # Admin Facility Terminal
│   ├── faculty.html                # Faculty Workstation & Mobile App
│   └── student.html                # Student Room Finder Portal
│
└── README.md
```

---

## 🚀 Running the Project

### 1. Frontend
Open `frontend/index.html` or `frontend/login.html` directly in your browser, or run a local static web server:
```bash
cd frontend
npx serve -p 3000
```
- Access from desktop or mobile on local network: `http://localhost:3000/login.html`

### 2. Backend REST API
```bash
cd backend
npm install
npm start
```
- Server URL: `http://localhost:5000`
- API Health Endpoint: `http://localhost:5000/api/health`

---

## 🔑 Demo Credentials

| Role | Email | Password | Portal |
|---|---|---|---|
| **System Admin** | `admin@farms.edu` | `admin123` | `dashboard.html` |
| **Facility Admin** | `admin1@gmail.com` | `password123` | `dashboard.html` |
| **Faculty Member** | `faculty@farms.edu` | `faculty123` | `faculty.html` |
| **Student** | `student@farms.edu` | `student123` | `student.html` |
