const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authReq = require('../middleware/auth');

// A simple in-memory store for mock OTPs (in production, use Redis)
const otpStore = {};

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // Generate a mock 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
  // Store it temporarily with 5 min expiration
  otpStore[phone] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
  
  // In a real app, send via SMS here. For hackathon, return it.
  console.log(`[MOCK SMS] sent OTP ${otp} to phone ${phone}`);
  
  return res.status(200).json({ 
    message: 'OTP sent successfully (Mock)', 
    mockOtp: otp // Included for easy testing in frontend
  });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { phone, otp, homeLocation } = req.body;
  
  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP are required' });
  }

  const record = otpStore[phone];
  if (!record) {
    return res.status(400).json({ message: 'No OTP found or expired' });
  }
  if (record.expiresAt < Date.now()) {
    delete otpStore[phone];
    return res.status(400).json({ message: 'OTP expired' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // OTP is valid. Clear it.
  delete otpStore[phone];

  try {
    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, homeLocation });
      await user.save();
    } else if (homeLocation) {
      // Update location if provided
      user.homeLocation = homeLocation;
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    return res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/auth/me
router.get('/me', authReq, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/auth/profile
router.put('/profile', authReq, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name },
            { new: true }
        );
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
