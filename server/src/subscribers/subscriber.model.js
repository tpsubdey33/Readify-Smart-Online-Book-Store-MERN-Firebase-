const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  source: {
    type: String,
    default: 'newsletter'
  }
}, {
  timestamps: true
});

// Index for better query performance
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ isActive: 1, subscribedAt: -1 });

module.exports = mongoose.model('Subscriber', subscriberSchema);