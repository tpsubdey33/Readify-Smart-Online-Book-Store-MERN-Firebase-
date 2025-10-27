const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Prevent duplicate favorites
favoriteSchema.index({ user: 1, book: 1 }, { unique: true });

// Static method to check if book is favorited by user
favoriteSchema.statics.isBookFavorited = async function(userId, bookId) {
    const favorite = await this.findOne({ user: userId, book: bookId });
    return !!favorite;
};

// Static method to get user's favorite books
favoriteSchema.statics.getUserFavorites = async function(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const favorites = await this.find({ user: userId })
        .populate('book')
        .sort({ addedAt: -1 })
        .skip(skip)
        .limit(limit);
    
    const total = await this.countDocuments({ user: userId });
    
    return {
        favorites,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
    };
};

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;