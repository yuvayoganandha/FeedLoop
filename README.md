# 🍏 FeedLoop: Surplus Food Redistribution Platform

> **Redistributing Surplus. Reducing Waste. Feeding Communities.**

**Live App:** [feed-loop.vercel.app](https://feed-loop.vercel.app)

**Vedio Link** (https://drive.google.com/file/d/1zAa6m_EpTMYWBxQd-8c2ZD-bpTwdVs_7/view?usp=sharing)

**FeedLoop** is a high-fidelity web platform designed to eliminate food waste by bridging the gap between donors (individuals, restaurants, hotels) and local food rescuers. Our mission is to ensure that no edible food goes to waste, providing a seamless, real-time coordination tool for the community.

---

## ✨ Key Features

### 📍 Live Food Radar & Navigation
- **Real-time Map**: Instantly visualize available food donations in your local area with high-visibility markers.
- **Route Planning**: Get precise navigation paths from your current location to the pickup point using integrated OSRM routing.

### 🍱 Seamless Donation Management
- **One-Tap Contact**: Immediate access to donor phone numbers with **"Tap to Call"** and **"Copy to Clipboard"** functionality.
- **Edit on the Fly**: Donors can modify active postings (quantity, description, expiry) instantly.
- **Handoff Confirmation**: A secure "Confirm Collection" flow that removes food from the map once picked up.

### ⚡ Real-time Community Sync
- **Instant Updates**: Powered by WebSockets (Socket.io), the platform updates across all users the moment a donation is posted, claimed, or completed.
- **Proximity Search**: Smart sorting to find the closest available food based on your GPS location.
- **Location Search**: Change your search area by typing any city or neighborhood name.

### 🔐 Authentication & Profiles
- **Phone-based OTP Login**: Secure mock OTP authentication flow.
- **Donor Ratings**: Community-driven rating system for donors after food rescue.
- **Activity Dashboard**: Track your donations and claims with full history.

---

## 🛠️ Technical Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4 |
| **Icons** | Lucide React |
| **Mapping** | Leaflet.js, React-Leaflet, OSRM (route planning) |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas (Geospatial `2dsphere` indexing) |
| **Real-time** | Socket.io |
| **Auth** | JWT (JSON Web Tokens) |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
FeedLoop/
├── backend/
│   ├── middleware/       # Shared authentication middleware
│   ├── models/           # Mongoose schemas (User, Food)
│   ├── routes/           # API routes (auth, food, user)
│   ├── uploads/          # User-uploaded food images
│   ├── server.js         # Express + Socket.io entry point
│   └── .env.example      # Environment variable template
├── frontend/
│   ├── public/           # Static assets (favicon, intro video)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Dashboard, UserDashboard, ProfileSetup
│   │   ├── config.js     # API endpoint configuration
│   │   ├── App.jsx       # Root component with auth routing
│   │   └── index.css     # Tailwind v4 theme & custom styles
│   └── vercel.json       # Vercel deployment config
├── render.yaml           # Render backend deployment config
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```ini
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/feedloop?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

> **Note**: `FRONTEND_URL` is required for production CORS. Set it to your deployed frontend URL on Render/Vercel.

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Failed to fetch"** | Ensure backend is running. Frontend uses `127.0.0.1:5000` by default. |
| **CORS errors** | Set `FRONTEND_URL` in backend `.env` to your deployed frontend URL. |
| **MongoDB timeout** | Whitelist your IP in Atlas Network Access. URL-encode special chars in password. |
| **Map not loading** | Check internet connection — map tiles load from CartoDB CDN. |
| **Navigation route fails** | OSRM public servers may be rate-limited. The app has automatic fallback to a secondary server. |

---

## 🤝 Join the Mission

FeedLoop is a community-driven project dedicated to food sustainability.

**Small steps. Big Impact. FeedLoop.**
