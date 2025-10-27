// src/users/bookseller.route.js
const express = require('express');
const mongoose = require('mongoose');
const Book = require('../books/book.model');
const Order = require('../orders/order.model');
const User = require('./user.model');
const verifyToken = require('../middleware/verifyToken');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for bookseller routes
const booksellerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});

// Middleware to verify bookseller role and approval status
const verifyBookseller = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== 'bookseller') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Bookseller role required."
            });
        }

        if (user.profile.storeStatus !== 'approved') {
            return res.status(403).json({
                success: false,
                message: "Your bookseller account is pending approval. Please contact administrator."
            });
        }

        req.bookseller = user;
        next();
    } catch (error) {
        console.error("Bookseller verification error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during verification"
        });
    }
};

/**
 * @swagger
 * /api/bookseller/stats:
 *   get:
 *     summary: Get bookseller statistics
 *     tags: [Bookseller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookseller stats retrieved successfully
 *       403:
 *         description: Access denied - Bookseller role required
 *       500:
 *         description: Server error
 */
router.get('/stats', verifyToken, verifyBookseller, booksellerLimiter, async (req, res) => {
    try {
        const booksellerId = req.user.id;
        
        // Count total books by this bookseller
        const totalBooks = await Book.countDocuments({ bookseller: booksellerId });
        
        // Count total orders for this bookseller
        const totalOrders = await Order.countDocuments({ 
            'items.book.bookseller': booksellerId 
        });
        
        // Calculate total revenue (completed orders only)
        const revenueData = await Order.aggregate([
            { 
                $match: { 
                    'items.book.bookseller': new mongoose.Types.ObjectId(booksellerId),
                    status: 'completed' 
                } 
            },
            { $unwind: '$items' },
            { 
                $match: { 
                    'items.book.bookseller': new mongoose.Types.ObjectId(booksellerId)
                } 
            },
            {
                $group: {
                    _id: null,
                    total: { 
                        $sum: { 
                            $multiply: ['$items.quantity', '$items.price']
                        } 
                    }
                }
            }
        ]);
        
        // Count pending orders
        const pendingOrders = await Order.countDocuments({ 
            'items.book.bookseller': booksellerId,
            status: 'pending' 
        });

        // Get recent orders count (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentOrders = await Order.countDocuments({
            'items.book.bookseller': booksellerId,
            createdAt: { $gte: thirtyDaysAgo }
        });

        res.json({
            success: true,
            data: {
                totalBooks,
                totalOrders,
                totalRevenue: revenueData[0]?.total || 0,
                pendingOrders,
                recentOrders
            }
        });
    } catch (error) {
        console.error('Error fetching bookseller stats:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching stats' 
        });
    }
});

/**
 * @swagger
 * /api/bookseller/orders/recent:
 *   get:
 *     summary: Get recent orders for bookseller
 *     tags: [Bookseller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of recent orders to fetch
 *     responses:
 *       200:
 *         description: Recent orders retrieved successfully
 *       403:
 *         description: Access denied - Bookseller role required
 *       500:
 *         description: Server error
 */
router.get('/orders/recent', verifyToken, verifyBookseller, booksellerLimiter, async (req, res) => {
    try {
        const booksellerId = req.user.id;
        const limit = parseInt(req.query.limit) || 10;
        
        const orders = await Order.find({ 
            'items.book.bookseller': booksellerId 
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'username email profile.fullName')
        .populate('items.book', 'title author coverImage price')
        .select('orderId items totalAmount status createdAt updatedAt');

        // Filter items to only show books from this bookseller
        const filteredOrders = orders.map(order => {
            const filteredItems = order.items.filter(item => 
                item.book && item.book.bookseller && 
                item.book.bookseller.toString() === booksellerId
            );
            
            return {
                ...order.toObject(),
                items: filteredItems
            };
        }).filter(order => order.items.length > 0);

        res.json({ 
            success: true,
            orders: filteredOrders 
        });
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching orders' 
        });
    }
});

/**
 * @swagger
 * /api/bookseller/books:
 *   get:
 *     summary: Get bookseller's books with pagination
 *     tags: [Bookseller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of books per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by book status
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *       403:
 *         description: Access denied - Bookseller role required
 *       500:
 *         description: Server error
 */
router.get('/books', verifyToken, verifyBookseller, booksellerLimiter, async (req, res) => {
    try {
        const booksellerId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        
        const skip = (page - 1) * limit;
        
        let query = { bookseller: booksellerId };
        if (status) {
            query.status = status;
        }
        
        const books = await Book.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');
            
        const totalBooks = await Book.countDocuments(query);
        const totalPages = Math.ceil(totalBooks / limit);
        
        res.json({
            success: true,
            data: {
                books,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalBooks,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Error fetching bookseller books:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching books' 
        });
    }
});

/**
 * @swagger
 * /api/bookseller/profile:
 *   get:
 *     summary: Get bookseller profile information
 *     tags: [Bookseller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       403:
 *         description: Access denied - Bookseller role required
 *       500:
 *         description: Server error
 */
router.get('/profile', verifyToken, verifyBookseller, booksellerLimiter, async (req, res) => {
    try {
        const bookseller = await User.findById(req.user.id)
            .select('username email profile role isActive createdAt');
            
        res.json({
            success: true,
            data: bookseller
        });
    } catch (error) {
        console.error('Error fetching bookseller profile:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while fetching profile' 
        });
    }
});

module.exports = router;