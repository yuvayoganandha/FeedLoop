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

// NOTE: allowedOrigins is defined below with the CORS config block — 
// Socket.IO origin function reads it at runtime so definition order is fine.
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
        const allowed = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:3000',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Socket.IO CORS: Origin ${origin} not allowed`));
        }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Automated Directory Creation (Ensures images can be saved on fresh deployment)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('📁 Created Missing [uploads] directory.');
}

// CORS Configuration — must be defined before all routes
// ORB fix: wildcard '*' with Authorization header triggers opaque response blocking.
// Explicit origin list + credentials:true resolves it.
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL // Set this on Render/Vercel to your deployed frontend URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server requests (no origin) and listed origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length'],
    credentials: true,
    optionsSuccessStatus: 200 // Fix for legacy browser preflight
}));

app.use(express.json());

// Serve uploads with CORS headers so images load cross-origin without ORB
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(uploadDir), (req, res) => {
    // Return a 1x1 transparent GIF to cleanly handle missing images without triggering browser ORB warnings or aborts
    const fallbackImage = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': fallbackImage.length
    });
    res.end(fallbackImage);
});

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

// Catch-all API 404 (Compatible with Express 5 path-to-regexp)
app.use('/api', (req, res) => {
    res.status(404).json({ message: `API Endpoint Not Found: ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FeedLoop Backend running on port ${PORT}`);
});
