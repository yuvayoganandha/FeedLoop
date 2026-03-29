const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const authReq = require('../middleware/auth');

// GET /api/user/activity
router.get('/activity', authReq, async (req, res) => {
    try {
        const myDonations = await Food.find({ donor: req.user.id })
            .select('name quantity description image status phone location expiryTime createdAt claimedBy')
            .sort({ createdAt: -1 });

        const myClaims = await Food.find({ claimedBy: req.user.id })
            .populate('donor', 'name rating phone')
            .select('name quantity description image status phone location expiryTime createdAt donor')
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
