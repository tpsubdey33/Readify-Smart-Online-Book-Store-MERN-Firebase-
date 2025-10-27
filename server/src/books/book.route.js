const express = require('express');
const { 
    postABook, 
    getAllBooks, 
    getSingleBook, 
    getBooksBySeller,
    getRecommendedBooks,
    getTrendingBooks,
    UpdateBook, 
    deleteABook,
    searchBooks
} = require('./book.controller');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdminToken');
const verifyBookseller = require('../middleware/verifyBookseller');

const router = express.Router();

// Public routes
router.get("/", getAllBooks);
router.get("/search", searchBooks);
router.get("/recommended", getRecommendedBooks);
router.get("/trending", getTrendingBooks);
router.get("/seller/:sellerId", getBooksBySeller);
router.get("/:id", getSingleBook);

// Protected routes
router.post("/create-book", verifyToken, verifyBookseller, postABook);
router.put("/edit/:id", verifyToken, UpdateBook);
router.delete("/:id", verifyToken, deleteABook);

// Admin only routes
router.patch("/admin/trending/:id", verifyToken, verifyAdmin, async (req, res) => {
    // Admin can mark books as trending
});

router.patch("/admin/recommended/:id", verifyToken, verifyAdmin, async (req, res) => {
    // Admin can mark books as recommended
});

module.exports = router;