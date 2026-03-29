# 🍏 FeedLoop: Surplus Food Redistribution Platform

> **Redistributing Surplus. Reducing Waste. Feeding Communities.**

**FeedLoop** is a high-fidelity web platform designed to eliminate food waste by bridging the gap between donors (individuals, restaurants, hotels) and local food rescuers. Our mission is to ensure that no edible food goes to waste, providing a seamless, real-time coordination tool for the community.

---

## ✨ Key Features

### 📍 Live Food Radar & Navigation
- **Real-time Map**: Instantly visualize available food donations in your local area with high-visibility markers.
- **Neon Routing**: Get precise, step-by-step navigation paths from your current location to the pickup point using integrated OSRM routing.

### 🍱 Seamless Donation Management
- **One-Tap Contact**: For laptop and mobile users, immediate access to donor phone numbers with **"Tap to Call"** and **"Copy to Clipboard"** functionality.
- **Edit on the Fly**: Donors can modify active postings (quantity, description, expiry) instantly to keep the community informed.
- **Handoff Confirmation**: A secure "Confirm Collection" flow that removes food from the map once it has been successfully picked up, keeping data accurate.

### ⚡ Real-time Community Sync
- **Instant Updates**: Powered by WebSockets (Socket.io), the platform updates the map across all users the moment a donation is posted, claimed, or completed.
- **Proximity Search**: Smart sorting and filtering to find the closest available food in your "Donation Zone."

---

## 🛠️ Technical Stack

- **Frontend**: React.js with Vite, Tailwind CSS for premium "Cyber-Rescue" aesthetics, Lucide React for consistent iconography.
- **Mapping**: Leaflet.js with OpenStreetMap and Leaflet-Routing-Machine for real-time navigation.
- **Backend**: Node.js & Express.js with robust RESTful API architecture.
- **Database**: MongoDB Atlas with Geospatial `2dsphere` indexing for location-based search.
- **Real-time**: Socket.io for bi-directional event streaming between donors and rescuers.

---

## 🚀 Getting Started

### 1. Backend Server Setup
```bash
cd backend
npm install
# Configure your .env (PORT, MONGO_URI, JWT_SECRET)
node server.js
```

### 2. Frontend Application Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 👤 How to Use

### For Donors:
1.  **Post a Donation**: Enter the food name, quantity, and current location. Your registered mobile number is automatically included for rescuers.
2.  **Manage**: Track your active donations in your dashboard. You can edit details if things change.
3.  **Complete**: Once someone picks up the food, click **"Confirm Collection & Clear"** to remove it from the global map.

### For Rescuers:
1.  **Search**: Use the Map or List view to find surplus food nearby.
2.  **Contact**: Use the **"Tap to Call"** button to quickly coordinate with the donor.
3.  **Navigate**: Click **"Get Directions"** to see the fastest route directly on the map.

---

## 🤝 Join the Mission
FeedLoop is a community-driven project dedicated to food sustainability. 

**Small steps. Big Impact. FeedLoop.**
