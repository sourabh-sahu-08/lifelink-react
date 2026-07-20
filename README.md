<div align="center">

# 🩸 LifeLink

### *Real-Time Emergency Blood Donation & Hospital Network Platform*

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18+-61DAFB.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4+-38B2AC.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6.0+-47A248.svg)](https://www.mongodb.com/)
[![Deployment](https://img.shields.io/badge/Deployment-Render-blue.svg)](https://render.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

**LifeLink** is a modern, high-performance web application designed to bridge the critical gap between blood donors, recipients, and hospitals during medical emergencies. Featuring real-time GIS hospital location mapping, Google OAuth2 integration, direct donor-hospital messaging, and responsive mobile-first UI components.

</div>

---

## 🌟 Key Features

### 🩸 For Blood Donors
* **Interactive GIS Map**: Locate nearby hospitals and emergency requests in your city with exact coordinates.
* **Emergency Response System**: Respond to critical blood shortages with a single tap.
* **Personalized Dashboard**: Track donations, lives saved, response speed, and city impact rankings.
* **Direct Messaging**: Communicate directly with hospital coordinators via built-in chat dialogs.

### 🏥 For Hospitals & Health Institutes
* **Inventory Management**: Track and update real-time blood stock across all blood groups (A+, B+, O-, AB+, etc.).
* **Broadcast Emergency Requests**: Issue urgent blood requests specifying required units, urgency level, and hospital location.
* **Claim & Match System**: Review donor responses in real-time and coordinate blood collection.

### 🔐 Security & User Experience
* **Google OAuth2 & JWT Auth**: Seamless 1-click Google authentication + secure HTTP-only cookie session management.
* **Mobile-First Glassmorphic Design**: Customized glassmorphism aesthetics, responsive mobile bottom navigation tab-bar, and micro-animations built with Framer Motion.
* **Profile & Account Controls**: Interactive profile editor, password updates with hash verification, notification preference toggles, and privacy policy modals.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
* **Framework**: React 18 (Vite)
* **Styling**: Tailwind CSS, Glassmorphism, FontAwesome 6, Boxicons
* **Animations**: Framer Motion
* **Maps & GIS**: Leaflet, React-Leaflet
* **Authentication**: `@react-oauth/google`
* **HTTP Client**: Axios with credentials support

### **Backend**
* **Runtime**: Node.js & Express.js
* **Database**: MongoDB via Mongoose ORM
* **Authentication**: Google OAuth API (`google-auth-library`), JWT (`jsonwebtoken`), BcryptJS
* **Security & Cookies**: Cookie-Parser, CORS policy handling

---

## 📂 Project Structure

```
lifelink/
├── backend/
│   ├── config/             # Database & API configuration
│   ├── controllers/        # Express request handlers (auth, requests, inventory, stats)
│   ├── middleware/         # JWT authentication & protect middleware
│   ├── models/             # Mongoose schemas (User, BloodRequest, BloodSupply, etc.)
│   ├── routes/             # API routes
│   └── server.js           # Main Express server entry point
├── frontend/
│   ├── public/             # Static assets & favicon
│   ├── src/
│   │   ├── components/     # UI Components (Navbar, GISMap, Modals, Chat, Feeds)
│   │   ├── context/        # React Context (AuthContext, ToastContext)
│   │   ├── pages/          # App Pages (DonorDashboard, HospitalDashboard, Profile, Login)
│   │   ├── config/         # API Base URL config
│   │   └── App.jsx         # App router configuration
│   ├── index.html
│   └── vite.config.js
├── render.yaml             # Render cloud deployment blueprint
├── package.json            # Monorepo root package script
└── README.md
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* **Node.js**: v18.x or higher
* **MongoDB**: Local MongoDB instance or MongoDB Atlas URI
* **Google OAuth Credentials**: Client ID from Google Cloud Console

### 1. Clone Repository
```bash
git clone https://github.com/sourabh-sahu-08/lifelink-react.git
cd lifelink-react
```

### 2. Install Dependencies
Install dependencies for both root, backend, and frontend with a single command:
```bash
npm run install-backend && npm run install-frontend
```

### 3. Configure Environment Variables

Create a `.env` file in the **`backend/`** directory:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/lifelink
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the **`frontend/`** directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_BASE_URL=http://localhost:5001
```

### 4. Run Development Server
Start both backend and frontend concurrently:
```bash
npm run dev
```

* **Frontend Client**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5001](http://localhost:5001)

---

## 🌐 Single-Service Cloud Deployment (Render)

LifeLink is configured for single-service monorepo deployment on **Render**. In production (`NODE_ENV=production`), the Node.js Express server automatically serves the compiled Vite static SPA assets from `frontend/dist`.

### Render Setup:
1. Connect your GitHub repository to **Render**.
2. Select **Web Service**.
3. Configure settings:
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
4. Set Environment Variables on Render dashboard:
   * `MONGO_URI`: Your MongoDB Atlas Connection String
   * `JWT_SECRET`: Random secure string
   * `NODE_ENV`: `production`

---

## 📡 API Reference Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new Donor or Hospital | No |
| `POST` | `/api/auth/login` | Email/Password login | No |
| `POST` | `/api/auth/google` | Google OAuth2 Authentication | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile information | Yes |
| `PUT` | `/api/auth/password` | Change account password | Yes |
| `GET` | `/api/blood-requests` | List open emergency blood requests | No |
| `POST` | `/api/blood-requests` | Create emergency blood request | Yes |
| `POST` | `/api/blood-requests/:id/respond` | Respond to blood request | Yes |
| `GET` | `/api/hospitals` | Get hospitals list (filtered by city) | No |
| `GET` | `/api/stats` | Retrieve platform & user impact stats | No |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for saving lives through technology.</sub>
</div>
