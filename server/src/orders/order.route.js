const express = require('express');
const { createAOrder, getOrderByEmail } = require('./order.controller');

const router =  express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - book
 *         - quantity
 *         - price
 *       properties:
 *         book:
 *           type: string
 *           description: Book ID
 *         quantity:
 *           type: number
 *           minimum: 1
 *           description: Quantity of books
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Price per book
 * 
 *     OrderAddress:
 *       type: object
 *       required:
 *         - city
 *       properties:
 *         city:
 *           type: string
 *           description: City name
 *         country:
 *           type: string
 *           description: Country name
 *         state:
 *           type: string
 *           description: State/Province
 *         zipcode:
 *           type: string
 *           description: Postal code
 * 
 *     Order:
 *       type: object
 *       required:
 *         - items
 *         - name
 *         - email
 *         - address
 *         - phone
 *         - productIds
 *         - totalPrice
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated order ID
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: Order items array
 *         name:
 *           type: string
 *           description: Customer full name
 *         email:
 *           type: string
 *           format: email
 *           description: Customer email address
 *         address:
 *           $ref: '#/components/schemas/OrderAddress'
 *         phone:
 *           type: number
 *           description: Customer phone number
 *         productIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of book IDs
 *         totalPrice:
 *           type: number
 *           minimum: 0
 *           description: Total order price
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     OrderResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           $ref: '#/components/schemas/OrderAddress'
 *         phone:
 *           type: number
 *         productIds:
 *           type: array
 *           items:
 *             type: string
 *         totalPrice:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         error:
 *           type: string
 * 
 *     OrderListResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/OrderResponse'
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - name
 *               - email
 *               - address
 *               - phone
 *               - productIds
 *               - totalPrice
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - book
 *                     - quantity
 *                     - price
 *                   properties:
 *                     book:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                       example: 2
 *                     price:
 *                       type: number
 *                       minimum: 0
 *                       example: 24.99
 *                 description: Array of order items
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               address:
 *                 type: object
 *                 required:
 *                   - city
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *                   state:
 *                     type: string
 *                     example: "NY"
 *                   zipcode:
 *                     type: string
 *                     example: "10001"
 *               phone:
 *                 type: number
 *                 example: 1234567890
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
 *               totalPrice:
 *                 type: number
 *                 example: 49.98
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *             examples:
 *               success:
 *                 value:
 *                   _id: "507f1f77bcf86cd799439013"
 *                   items:
 *                     - book: "507f1f77bcf86cd799439011"
 *                       quantity: 2
 *                       price: 24.99
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *                   address:
 *                     city: "New York"
 *                     country: "USA"
 *                     state: "NY"
 *                     zipcode: "10001"
 *                   phone: 1234567890
 *                   productIds: 
 *                     - "507f1f77bcf86cd799439011"
 *                     - "507f1f77bcf86cd799439012"
 *                   totalPrice: 49.98
 *                   createdAt: "2023-10-15T10:30:00.000Z"
 *                   updatedAt: "2023-10-15T10:30:00.000Z"
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", createAOrder);

/**
 * @swagger
 * /orders/email/{email}:
 *   get:
 *     summary: Get orders by customer email
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Customer email address
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderListResponse'
 *             examples:
 *               success:
 *                 value:
 *                   - _id: "507f1f77bcf86cd799439013"
 *                     items:
 *                       - book: "507f1f77bcf86cd799439011"
 *                         quantity: 2
 *                         price: 24.99
 *                     name: "John Doe"
 *                     email: "john.doe@example.com"
 *                     address:
 *                       city: "New York"
 *                       country: "USA"
 *                       state: "NY"
 *                       zipcode: "10001"
 *                     phone: 1234567890
 *                     productIds: 
 *                       - "507f1f77bcf86cd799439011"
 *                       - "507f1f77bcf86cd799439012"
 *                     totalPrice: 49.98
 *                     createdAt: "2023-10-15T10:30:00.000Z"
 *                     updatedAt: "2023-10-15T10:30:00.000Z"
 *                   - _id: "507f1f77bcf86cd799439014"
 *                     items:
 *                       - book: "507f1f77bcf86cd799439015"
 *                         quantity: 1
 *                         price: 19.99
 *                     name: "John Doe"
 *                     email: "john.doe@example.com"
 *                     address:
 *                       city: "New York"
 *                       country: "USA"
 *                       state: "NY"
 *                       zipcode: "10001"
 *                     phone: 1234567890
 *                     productIds: 
 *                       - "507f1f77bcf86cd799439015"
 *                     totalPrice: 19.99
 *                     createdAt: "2023-10-10T08:15:00.000Z"
 *                     updatedAt: "2023-10-10T08:15:00.000Z"
 *       404:
 *         description: No orders found for this email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   message: "Order not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/email/:email", getOrderByEmail);

module.exports = router;