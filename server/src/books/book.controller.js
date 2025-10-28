const Book = require("./book.model");

const postABook = async (req, res) => {
    try {
        const newBook = await Book({
            ...req.body,
            seller: req.user.id,
            addedBy: req.user.role === 'admin' ? 'admin' : 'bookseller'
        });
        await newBook.save();
        
        await newBook.populate('seller', 'username email profile.fullName');
        
        res.status(200).send({
            message: "Book posted successfully", 
            book: newBook,
            addedBy: req.user.role
        })
    } catch (error) {
        console.error("Error creating book", error);
        res.status(500).send({message: "Failed to create book"})
    }
}

// Get all books with filtering and pagination
const getAllBooks = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            trending, 
            recommended,
            search,
            minPrice,
            maxPrice,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        let query = { status: 'active' };
        
        // Apply filters
        if (category) query.category = category;
        if (trending !== undefined) query.trending = trending === 'true';
        if (recommended !== undefined) query.recommended = recommended === 'true';
        if (minPrice || maxPrice) {
            query.newPrice = {};
            if (minPrice) query.newPrice.$gte = parseFloat(minPrice);
            if (maxPrice) query.newPrice.$lte = parseFloat(maxPrice);
        }
        
        // Search in title, author, description
        if (search) {
            query.$text = { $search: search };
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const books = await Book.find(query)
            .populate('seller', 'username profile.fullName')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Book.countDocuments(query);

        res.status(200).json({
            books,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
        
    } catch (error) {
        console.error("Error fetching books", error);
        res.status(500).send({message: "Failed to fetch books"})
    }
}

// Get single book
const getSingleBook = async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id)
            .populate('seller', 'username email profile.fullName profile.avatar');
            
        if(!book){
            return res.status(404).send({message: "Book not Found!"})
        }

        // Add favorite status if user is authenticated
        if (req.user) {
            const Favorite = require('../favorites/favorite.model');
            const isFavorited = await Favorite.isBookFavorited(req.user.id, id);
            book.isFavorited = isFavorited;
        }

        res.status(200).send(book)
        
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).send({message: "Failed to fetch book"})
    }
}

// Get books by seller
const getBooksBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const books = await Book.find({ seller: sellerId, status: 'active' })
            .populate('seller', 'username profile.fullName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Book.countDocuments({ seller: sellerId, status: 'active' });

        res.status(200).json({
            books,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching seller books", error);
        res.status(500).send({message: "Failed to fetch seller books"})
    }
}

// Get bookseller's own books
const getMyBooks = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user.id;

        const books = await Book.find({ seller: userId })
            .populate('seller', 'username profile.fullName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Book.countDocuments({ seller: userId });

        res.status(200).json({
            books,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
            userRole: req.user.role
        });
    } catch (error) {
        console.error("Error fetching my books", error);
        res.status(500).send({message: "Failed to fetch your books"})
    }
}

// Get recommended books
const getRecommendedBooks = async (req, res) => {
    try {
        const books = await Book.find({ 
            recommended: true, 
            status: 'active' 
        })
        .populate('seller', 'username profile.fullName')
        .limit(10)
        .sort({ 'rating.average': -1, createdAt: -1 });

        res.status(200).send(books);
    } catch (error) {
        console.error("Error fetching recommended books", error);
        res.status(500).send({message: "Failed to fetch recommended books"})
    }
}

// Get trending books
const getTrendingBooks = async (req, res) => {
    try {
        const books = await Book.find({ 
            trending: true, 
            status: 'active' 
        })
        .populate('seller', 'username profile.fullName')
        .limit(8)
        .sort({ createdAt: -1 });

        res.status(200).send(books);
    } catch (error) {
        console.error("Error fetching trending books", error);
        res.status(500).send({message: "Failed to fetch trending books"})
    }
}

// Update book data
const UpdateBook = async (req, res) => {
    try {
        const {id} = req.params;
        
        // Check if book exists
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send({message: "Book not Found!"})
        }
        
        // Authorization check
        if (book.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).send({
                message: "Not authorized to update this book",
                userRole: req.user.role,
                bookOwner: book.seller.toString() === req.user.id
            })
        }

        const updatedBook = await Book.findByIdAndUpdate(id, req.body, {new: true})
            .populate('seller', 'username profile.fullName');
            
        res.status(200).send({
            message: "Book updated successfully",
            book: updatedBook,
            updatedBy: req.user.role
        })
    } catch (error) {
        console.error("Error updating a book", error);
        res.status(500).send({message: "Failed to update a book"})
    }
}

const deleteABook = async (req, res) => {
    try {
        const {id} = req.params;
        
        // Check if book exists
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send({message: "Book not Found!"})
        }
        
        // Authorization check
        if (book.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).send({
                message: "Not authorized to delete this book",
                userRole: req.user.role,
                bookOwner: book.seller.toString() === req.user.id
            })
        }

        const deletedBook = await Book.findByIdAndDelete(id);
        res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook,
            deletedBy: req.user.role
        })
    } catch (error) {
        console.error("Error deleting a book", error);
        res.status(500).send({message: "Failed to delete a book"})
    }
};

// Search books
const searchBooks = async (req, res) => {
    try {
        const { q, category, author, minPrice, maxPrice } = req.query;
        
        let query = { status: 'active' };
        
        if (q) {
            query.$text = { $search: q };
        }
        if (category) query.category = category;
        if (author) query.author = new RegExp(author, 'i');
        if (minPrice || maxPrice) {
            query.newPrice = {};
            if (minPrice) query.newPrice.$gte = parseFloat(minPrice);
            if (maxPrice) query.newPrice.$lte = parseFloat(maxPrice);
        }

        const books = await Book.find(query)
            .populate('seller', 'username profile.fullName')
            .limit(20)
            .sort({ score: { $meta: "textScore" } });

        res.status(200).send(books);
    } catch (error) {
        console.error("Error searching books", error);
        res.status(500).send({message: "Failed to search books"})
    }
}

// Admin only - Get all books (including inactive)
const getAllBooksAdmin = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status,
            addedBy
        } = req.query;

        let query = {};
        
        // Apply filters
        if (status) query.status = status;
        if (addedBy) query.addedBy = addedBy;

        const books = await Book.find(query)
            .populate('seller', 'username email profile.fullName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Book.countDocuments(query);

        res.status(200).json({
            books,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
            userRole: req.user.role
        });
        
    } catch (error) {
        console.error("Error fetching books for admin", error);
        res.status(500).send({message: "Failed to fetch books"})
    }
}

// Admin only - Update book status
const updateBookStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const { status } = req.body;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send({message: "Book not Found!"})
        }

        const updatedBook = await Book.findByIdAndUpdate(
            id, 
            { status }, 
            {new: true}
        ).populate('seller', 'username email profile.fullName');
            
        res.status(200).send({
            message: "Book status updated successfully",
            book: updatedBook,
            updatedBy: req.user.role
        })
    } catch (error) {
        console.error("Error updating book status", error);
        res.status(500).send({message: "Failed to update book status"})
    }
}

// Admin only - Mark book as trending/recommended
const updateBookFeature = async (req, res) => {
    try {
        const {id} = req.params;
        const { trending, recommended } = req.body;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send({message: "Book not Found!"})
        }

        const updateData = {};
        if (trending !== undefined) updateData.trending = trending;
        if (recommended !== undefined) updateData.recommended = recommended;

        const updatedBook = await Book.findByIdAndUpdate(
            id, 
            updateData, 
            {new: true}
        ).populate('seller', 'username email profile.fullName');
            
        res.status(200).send({
            message: "Book features updated successfully",
            book: updatedBook,
            updatedBy: req.user.role
        })
    } catch (error) {
        console.error("Error updating book features", error);
        res.status(500).send({message: "Failed to update book features"})
    }
}

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    getBooksBySeller,
    getMyBooks,
    getRecommendedBooks,
    getTrendingBooks,
    UpdateBook,
    deleteABook,
    searchBooks,
    getAllBooksAdmin,
    updateBookStatus,
    updateBookFeature
}