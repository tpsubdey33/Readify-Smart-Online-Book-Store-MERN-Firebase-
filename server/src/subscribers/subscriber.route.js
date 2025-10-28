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

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscriber:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated subscriber ID
 *         email:
 *           type: string
 *           format: email
 *           description: Subscriber email address
 *         isActive:
 *           type: boolean
 *           description: Subscription status
 *         subscribedAt:
 *           type: string
 *           format: date-time
 *           description: Subscription date
 *         unsubscribedAt:
 *           type: string
 *           format: date-time
 *           description: Unsubscription date
 *         source:
 *           type: string
 *           description: Subscription source
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     SubscribeRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 * 
 *     SubscribeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 * 
 *     SubscriptionStatusResponse:
 *       type: object
 *       properties:
 *         isSubscribed:
 *           type: boolean
 *           description: Subscription status for the email
 * 
 *     UnsubscribeRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 * 
 *     UnsubscribeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 * 
 *     SubscriberListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Subscriber'
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: number
 *             totalPages:
 *               type: number
 *             totalSubscribers:
 *               type: number
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 */

/**
 * @swagger
 * tags:
 *   name: Subscribers
 *   description: Newsletter subscription management
 */

/**
 * @swagger
 * /subscribers/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Subscribers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscribeRequest'
 *           examples:
 *             example1:
 *               value:
 *                 email: "john.doe@example.com"
 *     responses:
 *       201:
 *         description: Successfully subscribed to newsletter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscribeResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Successfully subscribed to newsletter! Please check your email for confirmation."
 *                   data:
 *                     id: "507f1f77bcf86cd799439011"
 *                     email: "john.doe@example.com"
 *       400:
 *         description: Validation failed or email already subscribed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - msg: "Please provide a valid email address"
 *                       param: "email"
 *                       location: "body"
 *               duplicateEmail:
 *                 value:
 *                   success: false
 *                   message: "This email is already subscribed to our newsletter"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               internalError:
 *                 value:
 *                   success: false
 *                   message: "Internal server error. Please try again later."
 */
router.post('/subscribe', subscribeValidation, subscribe);

/**
 * @swagger
 * /subscribers/subscription-status/{email}:
 *   get:
 *     summary: Check subscription status for an email
 *     tags: [Subscribers]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address to check subscription status
 *         example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Subscription status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionStatusResponse'
 *             examples:
 *               subscribed:
 *                 value:
 *                   isSubscribed: true
 *               notSubscribed:
 *                 value:
 *                   isSubscribed: false
 *       500:
 *         description: Error checking subscription status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/subscription-status/:email', getSubscriptionStatus);

/**
 * @swagger
 * /subscribers/unsubscribe:
 *   post:
 *     summary: Unsubscribe from newsletter
 *     tags: [Subscribers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnsubscribeRequest'
 *           examples:
 *             example1:
 *               value:
 *                 email: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Successfully unsubscribed from newsletter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnsubscribeResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Successfully unsubscribed from newsletter"
 *       404:
 *         description: Email not found in subscription list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               notFound:
 *                 value:
 *                   success: false
 *                   message: "Email not found in our subscription list"
 *       500:
 *         description: Error unsubscribing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/unsubscribe', unsubscribe);

/**
 * @swagger
 * /subscribers/admin/subscribers:
 *   get:
 *     summary: Get all subscribers (Admin only)
 *     tags: [Subscribers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status (true/false)
 *     responses:
 *       200:
 *         description: Subscribers list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriberListResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   data:
 *                     - _id: "507f1f77bcf86cd799439011"
 *                       email: "subscriber1@example.com"
 *                       isActive: true
 *                       subscribedAt: "2023-10-15T10:30:00.000Z"
 *                       unsubscribedAt: null
 *                       source: "newsletter"
 *                       createdAt: "2023-10-15T10:30:00.000Z"
 *                       updatedAt: "2023-10-15T10:30:00.000Z"
 *                     - _id: "507f1f77bcf86cd799439012"
 *                       email: "subscriber2@example.com"
 *                       isActive: false
 *                       subscribedAt: "2023-10-10T08:15:00.000Z"
 *                       unsubscribedAt: "2023-10-12T14:20:00.000Z"
 *                       source: "newsletter"
 *                       createdAt: "2023-10-10T08:15:00.000Z"
 *                       updatedAt: "2023-10-12T14:20:00.000Z"
 *                   pagination:
 *                     currentPage: 1
 *                     totalPages: 5
 *                     totalSubscribers: 48
 *       500:
 *         description: Error fetching subscribers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Admin routes - COMMENT OUT IF YOU DON'T HAVE MIDDLEWARE YET
// router.get('/admin/subscribers', verifyToken, verifyAdminToken, getAllSubscribers);

// TEMPORARY: Use this until you set up middleware
router.get('/admin/subscribers', getAllSubscribers);

module.exports = router;