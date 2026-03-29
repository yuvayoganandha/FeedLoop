require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

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

// Automated Directory Creation (Ensures images can be saved on fresh deployment)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('📁 Created Missing [uploads] directory.');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Root & Health Check Endpoints (Vital for Render Monitoring)
app.get('/', (req, res) => {
    res.status(200).json({ status: 'Operational', service: 'FeedLoop API', version: '1.0.0' });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Healthy' });
});

// Dependency Layer: Set 'io' instance BEFORE mounting routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/user', userRoutes);

// Connect to MongoDB
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error('MONGO_URI is missing from environment.');
        
        await mongoose.connect(uri);
        console.log('✅ MongoDB Connected successfully.');
    } catch (err) {
        console.error('❌ MongoDB Error:', err.message);
        if (process.env.NODE_ENV === 'production') process.exit(1);
    }
};

connectDB();

// Handshaking
io.on('connection', (socket) => {
  console.log(`📡 User connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`🔌 User disconnected: ${socket.id}`));
});

// Catch-all API 404
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: `API Endpoint Not Found: ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FeedLoop Backend running on port ${PORT}`);
});
