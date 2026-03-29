const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const jwt = require('jsonwebtoken');

// Middleware to authenticate
const authReq = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch(err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

// GET /api/user/activity
router.get('/activity', authReq, async (req, res) => {
    try {
        const myDonations = await Food.find({ donor: req.user.id })
            .sort({ createdAt: -1 });

        const myClaims = await Food.find({ claimedBy: req.user.id })
            .populate('donor', 'name rating')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            donations: myDonations,
            claims: myClaims
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
