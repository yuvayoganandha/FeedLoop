const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: String, // e.g., "5 Kg", "10 servings"
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: { type: String }
  },
  expiryTime: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String, // Optional URL or base64 string
  },
  status: {
    type: String,
    enum: ['available', 'claimed'],
    default: 'available'
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Create a 2dsphere index for spatial location sorting
foodSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Food', foodSchema);
