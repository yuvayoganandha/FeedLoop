const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const authReq = require('../middleware/auth');

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST /api/food
router.post('/', authReq, upload.single('image'), async (req, res) => {
  try {
    let { name, quantity, location, expiryTime, address, description, phone } = req.body;
    
    // Parse location if it comes as a string from FormData
    if (typeof location === 'string') {
        try {
            location = JSON.parse(location);
        } catch(e) {}
    }
    
    // Address may come directly in the body, or inside location
    let finalAddress = address || (location && location.address) || '';

    let image = req.body.image || '';
    if (req.file) {
      const fs = require('fs');
      try {
        const bitmap = fs.readFileSync(req.file.path);
        const base64Str = bitmap.toString('base64');
        image = `data:${req.file.mimetype};base64,${base64Str}`;
        // Clean up the local file so it doesn't take up space
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Base64 conversion error:', err);
      }
    }
    
    const newFood = new Food({
      name,
      quantity,
      description,
      phone,
      location: {
         type: 'Point',
         coordinates: [location.lng, location.lat],
         address: finalAddress
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
            foods = await Food.find({ status: 'available', expiryTime: { $gt: new Date() } })
                 .where('location').near({
                     center: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                     },
                     spherical: true
                 })
                 .populate('donor', 'name rating phone');
        } else {
            // No location provided, return all available active ones
            foods = await Food.find({ status: 'available', expiryTime: { $gt: new Date() } }).sort({ createdAt: -1 })
                 .populate('donor', 'name rating phone');
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
        const donor = await User.findById(food.donor._id);
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

// POST /api/food/:id/complete (Donor confirms collection)
router.post('/:id/complete', authReq, async (req, res) => {
    try {
        const foodId = req.params.id;
        const food = await Food.findById(foodId);
        
        if(!food) return res.status(404).json({ message: 'Food not found' });
        if(food.donor.toString() !== req.user.id) return res.status(403).json({ message: 'Only the donor can confirm collection' });
        
        food.status = 'completed';
        await food.save();
        
        req.app.get('io').emit('foodCompleted', food);
        
        res.status(200).json({ message: 'Rescue completed and item removed', food });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/food/:id (Edit posting)
router.put('/:id', authReq, async (req, res) => {
    try {
        const { name, quantity, description, expiryTime, phone } = req.body;
        const food = await Food.findById(req.params.id);
        
        if(!food) return res.status(404).json({ message: 'Food not found' });
        if(food.donor.toString() !== req.user.id) return res.status(403).json({ message: 'Only the donor can edit' });
        if(food.status !== 'available') return res.status(400).json({ message: 'Cannot edit an item that is already claimed or completed' });
        
        food.name = name || food.name;
        food.quantity = quantity || food.quantity;
        food.description = description || food.description;
        food.expiryTime = expiryTime || food.expiryTime;
        food.phone = phone || food.phone;
        
        await food.save();
        
        req.app.get('io').emit('foodUpdated', food);
        
        res.status(200).json({ message: 'Posting updated successfully', food });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
