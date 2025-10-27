const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  subscribe,
  getSubscriptionStatus,
  unsubscribe,
  getAllSubscribers
} = require('./subscriber.controller');

// Middleware imports - COMMENT OUT IF YOU DON'T HAVE THESE YET
// const verifyToken = require('../middleware/verifyToken');
// const verifyAdminToken = require('../middleware/verifyAdminToken');

// Validation rules
const subscribeValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

// Public routes
router.post('/subscribe', subscribeValidation, subscribe);
router.get('/subscription-status/:email', getSubscriptionStatus);
router.post('/unsubscribe', unsubscribe);

// Admin routes - COMMENT OUT IF YOU DON'T HAVE MIDDLEWARE YET
// router.get('/admin/subscribers', verifyToken, verifyAdminToken, getAllSubscribers);

// TEMPORARY: Use this until you set up middleware
router.get('/admin/subscribers', getAllSubscribers);

module.exports = router;