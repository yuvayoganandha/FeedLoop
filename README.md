# 🍏 FeedLoop: Surplus Food Redistribution Platform

> **Redistributing Surplus. Reducing Waste. Feeding Communities.**

**Live App:** [feed-loop.vercel.app](https://feed-loop.vercel.app)

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

## ⚙️ Environment Configuration

To run **FeedLoop** locally, you must configure the backend environment variables. 

1. Create a `.env` file in the `backend/` directory.
2. Follow the detailed template below:

```ini
# Server Port (Default is 5000)
PORT=5000

# MongoDB Atlas Connection String
# Get this from your Atlas Cluster -> Connect -> Drivers
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/feedloop?retryWrites=true&w=majority

# Secret key for JWT Authentication
# Use a long, complex string for security
JWT_SECRET=your_super_secret_feedloop_key_here

# Mode (development or production)
NODE_ENV=development
```

---

## 🛠️ Troubleshooting & Common Fixes

### 1. "Failed to fetch" or WebSocket Error
**Problem**: Firefox or Chrome cannot establish a connection to `localhost:5000`.
**Solution**: Ensure your frontend is connecting via **`127.0.0.1`** instead of `localhost`. This avoids IPv4/IPv6 resolution mismatches. FeedLoop is pre-configured to use `127.0.0.1` for maximum stable connectivity.

### 2. "tel:undefined" in Browser Logs
**Problem**: The "Tap to Call" feature shows `undefined` or fails to navigate.
**Solution**: This typically happens on old records without phone data. We have implemented a **Profile Fallback**—ensure every user has a phone number set during profile setup. Check your network console to verify `donor.phone` is being populated.

### 3. MongoDB Connection Timeout
**Problem**: Your backend won't start due to a database connection error.
**Solution**: 
- Whitelist your IP in **MongoDB Atlas** (Network Access -> Add IP Address).
- Ensure your `MONGO_URI` password doesn't contain special characters like `@` or `#` (URL encode them if they do).

### 4. Laptop Navigation Warnings
**Problem**: Browser blocks `tel:` links on desktop/laptop.
**Solution**: This is a security feature on non-mobile devices. We have added a **"Copy to Clipboard"** button on every food card so you can copy the number and use it externally.

---

## 🤝 Join the Mission
FeedLoop is a community-driven project dedicated to food sustainability. 

**Small steps. Big Impact. FeedLoop.**
