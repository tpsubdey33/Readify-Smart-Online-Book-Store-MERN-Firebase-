const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'bookseller', 'admin'],
        default: 'user'
    },
    profile: {
        fullName: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        bio: {
            type: String,
            maxlength: 500
        },
        avatar: String,
        // Bookseller specific fields
        storeName: {
            type: String,
            sparse: true
        },
        storeDescription: {
            type: String,
            maxlength: 1000
        },
        businessLicense: String,
        taxId: String,
        storeContact: {
            phone: String,
            email: String,
            website: String
        },
        storeAddress: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        },
        storeStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    preferences: {
        newsletter: {
            type: Boolean,
            default: true
        },
        notifications: {
            type: Boolean,
            default: true
        }
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: Date
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;