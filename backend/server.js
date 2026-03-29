require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const userRoutes = require('./routes/user');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allows any origin for hackathon purposes
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root & Health Check Endpoints (Vital for Render Deployment)
app.get('/', (req, res) => {
    res.status(200).json({ status: 'Operational', service: 'FeedLoop API', timestamp: new Date() });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Healthy' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/user', userRoutes);

// Connect to MongoDB
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.warn('⚠️ MONGO_URI is not defined in the .env file. Using hardcoded fallback for local testing.');
            throw new Error('MONGO_URI is mandatory for production.');
        }
        
        await mongoose.connect(uri);
        console.log('✅ MongoDB Connected successfully to Atlas database.');
    } catch (err) {
        console.error('❌ MongoDB connection failed. Error:', err.message);
        // On Render, we want to fail fast if no DB is available
        if (process.env.NODE_ENV === 'production') process.exit(1);
    }
};

connectDB();

// Global JWT Check
if (!process.env.JWT_SECRET) {
    console.warn('⚠️ JWT_SECRET is not defined. Using default "secret" (UNSAFE for production).');
}

// Make io accessible to our routes
app.set('io', io);

// Socket.io Connection
io.on('connection', (socket) => {
  console.log(`📡 User connected via socket: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Global catch-all Error Handler
app.use((err, req, res, next) => {
    console.error('🔥 Global Exception:', err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: process.env.NODE_ENV === 'development' ? err.message : {} });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
