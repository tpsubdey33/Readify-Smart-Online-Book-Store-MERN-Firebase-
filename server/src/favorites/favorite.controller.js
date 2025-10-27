const Favorite = require('./favorite.model');
const Book = require('../books/book.model');

// Add book to favorites
const addToFavorites = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({ 
            user: userId, 
            book: bookId 
        });

        if (existingFavorite) {
            return res.status(400).json({ message: "Book already in favorites" });
        }

        // Create favorite
        const favorite = new Favorite({
            user: userId,
            book: bookId
        });

        await favorite.save();
        await favorite.populate('book');

        res.status(201).json({
            message: "Book added to favorites successfully",
            favorite
        });

    } catch (error) {
        console.error("Error adding to favorites", error);
        res.status(500).json({ message: "Failed to add to favorites" });
    }
};

// Remove book from favorites
const removeFromFavorites = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const favorite = await Favorite.findOneAndDelete({ 
            user: userId, 
            book: bookId 
        });

        if (!favorite) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        res.status(200).json({
            message: "Book removed from favorites successfully"
        });

    } catch (error) {
        console.error("Error removing from favorites", error);
        res.status(500).json({ message: "Failed to remove from favorites" });
    }
};

// Get user's favorites
const getUserFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const result = await Favorite.getUserFavorites(userId, parseInt(page), parseInt(limit));

        res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching favorites", error);
        res.status(500).json({ message: "Failed to fetch favorites" });
    }
};

// Check if book is favorited
const checkIsFavorited = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const isFavorited = await Favorite.isBookFavorited(userId, bookId);

        res.status(200).json({
            isFavorited,
            bookId
        });

    } catch (error) {
        console.error("Error checking favorite status", error);
        res.status(500).json({ message: "Failed to check favorite status" });
    }
};

// Get favorite count for a book
const getBookFavoriteCount = async (req, res) => {
    try {
        const { bookId } = req.params;

        const count = await Favorite.countDocuments({ book: bookId });

        res.status(200).json({
            bookId,
            favoriteCount: count
        });

    } catch (error) {
        console.error("Error getting favorite count", error);
        res.status(500).json({ message: "Failed to get favorite count" });
    }
};

// Get user's favorite books with details
const getFavoriteBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const favorites = await Favorite.find({ user: userId })
            .populate({
                path: 'book',
                populate: {
                    path: 'seller',
                    select: 'username profile.fullName'
                }
            })
            .sort({ addedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Favorite.countDocuments({ user: userId });

        // Extract books from favorites
        const favoriteBooks = favorites.map(fav => ({
            ...fav.book.toObject(),
            favoritedAt: fav.addedAt
        }));

        res.status(200).json({
            books: favoriteBooks,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });

    } catch (error) {
        console.error("Error fetching favorite books", error);
        res.status(500).json({ message: "Failed to fetch favorite books" });
    }
};

module.exports = {
    addToFavorites,
    removeFromFavorites,
    getUserFavorites,
    checkIsFavorited,
    getBookFavoriteCount,
    getFavoriteBooks
};