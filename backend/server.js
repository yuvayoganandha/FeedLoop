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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes); // We should pass 'io' instance
app.use('/api/user', userRoutes); // We should pass 'io' instance

// Connect to MongoDB
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error('MONGO_URI is not defined in the .env file.');
        }
        
        // Remove locally specific fallbacks and connect directly
        await mongoose.connect(uri);
        console.log('MongoDB Connected successfully to Atlas database.');
    } catch (err) {
        console.error('MongoDB connection failed. Error:', err.message);
        process.exit(1); // Stop the server if the database won't connect
    }
};

connectDB();

// Make io accessible to our routes
app.set('io', io);

// Socket.io Connection
io.on('connection', (socket) => {
  console.log(`User connected via socket: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
