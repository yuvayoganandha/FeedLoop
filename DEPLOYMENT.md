# 🚀 FeedLoop Deployment Guide

Follow these steps to host **FeedLoop** in the cloud using **Render** (Backend) and **Vercel** (Frontend).

---

## 🌎 Phase 1: Backend Deployment (Render)

1. **Create Account**: Sign up at [render.com](https://render.com).
2. **New Web Service**: Click **New +** -> **Web Service**.
3. **Connect Repo**: Connect your GitHub repository.
4. **Configuration**:
   - **Name**: `feedloop-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. **Environment Variables**: Add the following in the **Environment** tab:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A long secure string.
   - `PORT`: `5000` (Render handles this, but setting it explicitly is safe).
6. **Deploy**: Click **Create Web Service**. 
7. **Copy URL**: Once deployed, copy your service URL (e.g., `https://feedloop-backend.onrender.com`).

---

## 🎨 Phase 2: Frontend Deployment (Vercel)

1. **Create Account**: Sign up at [vercel.com](https://vercel.com).
2. **Add New**: Click **Add New** -> **Project**.
3. **Connect Repo**: Import your GitHub repository.
4. **Configuration**:
   - **Project Name**: `feedloop`
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**: Add this critical variable:
   - `VITE_API_BASE_URL`: **[YOUR RENDER BACKEND URL]** (e.g., `https://feedloop-backend.onrender.com`) - *Important: No trailing slash.*
6. **Deploy**: Click **Deploy**.

---

## 🛠️ Verification & Troubleshooting

### 1. Mixed Content Errors
If your site is on HTTPS (Vercel) but trying to fetch HTTP (Local), it will fail. **Always use the HTTPS URL** from Render in your Vercel `VITE_API_BASE_URL`.

### 2. MongoDB IP Whitelist
Ensure your MongoDB Atlas cluster allows connections from anywhere (`0.0.0.0/0`) during the initial deployment, as Render server IPs can change.

### 3. Real-time Sync
If WebSockets fail to connect, ensure your `VITE_API_BASE_URL` in Vercel **does not** end with a `/`. It should be exactly `https://your-app.onrender.com`.

---

**You are now live! FeedLoop is ready to rescue food in the cloud.** 🍱✨
