const Subscriber = require('./subscriber.model');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Email configuration - FIXED: createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Subscribe endpoint
const subscribe = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    // Create new subscriber
    const subscriber = new Subscriber({
      email,
      subscribedAt: new Date(),
      isActive: true
    });

    await subscriber.save();

    // Send welcome email (only if email credentials are set)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Welcome to Our Newsletter!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Welcome to Our Newsletter! 🎉</h2>
              <p>Thank you for subscribing to our newsletter. You'll now receive:</p>
              <ul>
                <li>Latest news updates</li>
                <li>Exclusive content</li>
                <li>Weekly digest</li>
                <li>Special offers</li>
              </ul>
              <p>We're excited to have you on board!</p>
              <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #64748b;">
                  If you didn't request this subscription, please ignore this email.
                </p>
              </div>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the subscription if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!' + (process.env.EMAIL_USER ? ' Please check your email for confirmation.' : ''),
      data: {
        id: subscriber._id,
        email: subscriber.email
      }
    });

  } catch (error) {
    console.error('Subscription error:', error);
    
    // Handle duplicate key error (MongoDB unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

// Get subscription status
const getSubscriptionStatus = async (req, res) => {
  try {
    const { email } = req.params;
    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    
    res.json({
      isSubscribed: !!subscriber && subscriber.isActive
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking subscription status'
    });
  }
};

// Unsubscribe endpoint
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    
    const subscriber = await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isActive: false, unsubscribedAt: new Date() },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our subscription list'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unsubscribing'
    });
  }
};

// ADD THIS MISSING FUNCTION
// Get all subscribers (admin only)
const getAllSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    const query = {};
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const subscribers = await Subscriber.find(query)
      .sort({ subscribedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Subscriber.countDocuments(query);

    res.json({
      success: true,
      data: subscribers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSubscribers: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers'
    });
  }
};

module.exports = {
  subscribe,
  getSubscriptionStatus,
  unsubscribe,
  getAllSubscribers // ADD THIS TO EXPORTS
};