const express = require('express');
const {
    addToFavorites,
    removeFromFavorites,
    getUserFavorites,
    checkIsFavorited,
    getBookFavoriteCount,
    getFavoriteBooks
} = require('./favorite.controller');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Add to favorites
router.post("/:bookId", addToFavorites);

// Remove from favorites
router.delete("/:bookId", removeFromFavorites);

// Get user's favorites
router.get("/", getUserFavorites);

// Get user's favorite books with details
router.get("/books", getFavoriteBooks);

// Check if book is favorited by user
router.get("/check/:bookId", checkIsFavorited);

// Get favorite count for a book (public route)
router.get("/count/:bookId", getBookFavoriteCount);

module.exports = router;