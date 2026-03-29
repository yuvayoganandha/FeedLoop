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

// POST /api/food
router.post('/', authReq, async (req, res) => {
  try {
    const { name, quantity, location, expiryTime, image, address, description } = req.body;
    
    const newFood = new Food({
      name,
      quantity,
      description,
      location: {
         type: 'Point',
         coordinates: [location.lng, location.lat],
         address
      },
      expiryTime,
      image,
      donor: req.user.id
    });
    
    await newFood.save();
    
    // Will be emitted via Socket.io later
    req.app.get('io').emit('newFood', newFood);
    
    res.status(201).json(newFood);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/food - List all available food, prioritized by location
router.get('/', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        let foods = [];
        
        if (lat && lng) {
            // Geospatial Query using $near to sort by distance
            foods = await Food.find({ status: 'available' })
                 .where('location').near({
                     center: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                     },
                     spherical: true
                 })
                 .populate('donor', 'name rating');
        } else {
            // No location provided, return all available
            foods = await Food.find({ status: 'available' }).sort({ createdAt: -1 })
                 .populate('donor', 'name rating');
        }
        res.status(200).json(foods);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/food/:id/claim
router.post('/:id/claim', authReq, async (req, res) => {
    try {
        const foodId = req.params.id;
        const food = await Food.findById(foodId);
        
        if(!food) return res.status(404).json({ message: 'Food not found' });
        if(food.status === 'claimed') return res.status(400).json({ message: 'Food already claimed' });
        if(food.donor.toString() === req.user.id) return res.status(400).json({ message: 'You cannot claim your own donation' });
        
        food.status = 'claimed';
        food.claimedBy = req.user.id;
        await food.save();
        
        req.app.get('io').emit('foodClaimed', food);
        
        res.status(200).json({ message: 'Successfully claimed', food });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/food/:id/rate
router.post('/:id/rate', authReq, async (req, res) => {
    try {
        const foodId = req.params.id;
        const { rating, review } = req.body;
        
        const food = await Food.findById(foodId).populate('donor');
        if(!food) return res.status(404).json({ message: 'Food not found' });
        
        food.rating = rating;
        food.review = review;
        await food.save();
        
        // Update donor rating
        const donor = await require('../models/User').findById(food.donor._id);
        if(donor) {
            const currentTotalRatings = donor.totalRatings || 0;
            const currentAvgRating = donor.rating || 0;
            const newAvgRating = ((currentAvgRating * currentTotalRatings) + rating) / (currentTotalRatings + 1);
            
            donor.rating = newAvgRating;
            donor.totalRatings = currentTotalRatings + 1;
            await donor.save();
        }
        
        res.status(200).json({ message: 'Rating submitted successfully' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
