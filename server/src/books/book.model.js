const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
    },
    isbn: {
        type: String,
        unique: true,
        sparse: true
    },
    trending: {
        type: Boolean,
        default: false
    },
    recommended: {
        type: Boolean,
        default: false
    },
    coverImage: {
        type: String,
        required: true,
    },
    images: [{
        type: String
    }],
    oldPrice: {
        type: Number,
        required: true,
    },
    newPrice: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0
    },
    pages: {
        type: Number,
    },
    publisher: {
        type: String,
    },
    publishedDate: {
        type: Date,
    },
    language: {
        type: String,
        default: 'English'
    },
    condition: {
        type: String,
        enum: ['new', 'used', 'refurbished'],
        default: 'new'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'sold'],
        default: 'active'
    },
    tags: [String],
    rating: {
        average: {
            type: Number,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    addedBy: {
        type: String,
        enum: ['admin', 'bookseller'],
        default: 'bookseller'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});

// Index for better search performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ category: 1, trending: -1 });
bookSchema.index({ seller: 1, status: 1 });
bookSchema.index({ addedBy: 1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;