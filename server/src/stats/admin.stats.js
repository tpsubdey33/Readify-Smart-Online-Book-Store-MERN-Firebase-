const mongoose = require('mongoose');
const express = require('express');
const Order = require('../orders/order.model');
const Book = require('../books/book.model');
const User = require('../users/user.model');
const router = express.Router();

// Enhanced admin stats
router.get("/", async (req, res) => {
    try {
        // 1. Total number of orders
        const totalOrders = await Order.countDocuments();

        // 2. Total sales
        const totalSales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" },
                }
            }
        ]);

        // 3. Trending books statistics
        const trendingBooksCount = await Book.aggregate([
            { $match: { trending: true } },
            { $count: "trendingBooksCount" }
        ]);
        
        const trendingBooks = trendingBooksCount.length > 0 ? trendingBooksCount[0].trendingBooksCount : 0;

        // 4. Total number of books
        const totalBooks = await Book.countDocuments();

        // 5. Monthly sales
        const monthlySales = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    totalSales: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }  
        ]);

        // 6. User statistics
        const userStats = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 7. Books by category
        const booksByCategory = await Book.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 8. Recent activities
        const recentBooks = await Book.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('seller', 'username');

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('productIds', 'title');

        // Result summary
        res.status(200).json({  
            totalOrders,
            totalSales: totalSales[0]?.totalSales || 0,
            trendingBooks,
            totalBooks,
            monthlySales,
            userStats,
            booksByCategory,
            recentActivities: {
                recentBooks,
                recentOrders
            }
        });
      
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
});

// Bookseller stats
router.get("/bookseller/:sellerId", async (req, res) => {
    try {
        const { sellerId } = req.params;

        const booksCount = await Book.countDocuments({ seller: sellerId });
        const activeBooksCount = await Book.countDocuments({ 
            seller: sellerId, 
            status: 'active' 
        });
        
        const sellerOrders = await Order.aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: 'productIds',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $match: {
                    'products.seller': new mongoose.Types.ObjectId(sellerId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        const monthlySellerSales = await Order.aggregate([
            {
                $lookup: {
                    from: 'books',
                    localField: 'productIds',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $match: {
                    'products.seller': new mongoose.Types.ObjectId(sellerId)
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    totalSales: { $sum: "$totalPrice" },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            booksCount,
            activeBooksCount,
            totalSales: sellerOrders[0]?.totalSales || 0,
            totalOrders: sellerOrders[0]?.totalOrders || 0,
            monthlySales: monthlySellerSales
        });

    } catch (error) {
        console.error("Error fetching bookseller stats:", error);
        res.status(500).json({ message: "Failed to fetch bookseller stats" });
    }
});

module.exports = router;