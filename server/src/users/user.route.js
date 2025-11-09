// File: src/users/user.route.js
const express = require('express');
const User = require('./user.model');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Rate limiting configurations
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});

// Validation middleware
const validateRegister = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
    body('role')
        .isIn(['user', 'bookseller'])
        .withMessage('Role must be either user or bookseller')
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const validateProfileUpdate = [
    body('username')
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters'),
    
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('profile.fullName')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Full name must be less than 100 characters'),
    
    body('profile.bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio must be less than 500 characters')
];

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         username:
 *           type: string
 *           description: Unique username
 *         email:
 *           type: string
 *           description: User email
 *         role:
 *           type: string
 *           enum: [user, bookseller, admin]
 *           description: User role
 *         profile:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *             phone:
 *               type: string
 *             address:
 *               type: object
 *               properties:
 *                 street:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 zipCode:
 *                   type: string
 *                 country:
 *                   type: string
 *             bio:
 *               type: string
 *             avatar:
 *               type: string
 *             storeName:
 *               type: string
 *             storeDescription:
 *               type: string
 *             businessLicense:
 *               type: string
 *             storeStatus:
 *               type: string
 *               enum: [pending, approved, rejected]
 *         isActive:
 *           type: boolean
 *         emailVerified:
 *           type: boolean
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication and profile management
 *   - name: Users
 *     description: User management operations
 *   - name: Admin
 *     description: Admin management operations
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user or bookseller
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: MySecurePassword123
 *               role:
 *                 type: string
 *                 enum: [user, bookseller]
 *                 example: user
 *               profile:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     example: John Doe
 *                   phone:
 *                     type: string
 *                     example: +1234567890
 *                   storeName:
 *                     type: string
 *                     example: John's Bookstore
 *                   storeDescription:
 *                     type: string
 *                     example: A wonderful bookstore with rare collections
 *                   businessLicense:
 *                     type: string
 *                     example: BUS123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */
router.post("/register", authLimiter, validateRegister, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { username, email, password, role, profile = {} } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { email: email.toLowerCase() }, 
                { username: username.toLowerCase() }
            ] 
        });

        if (existingUser) {
            const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
            return res.status(400).json({ 
                success: false,
                message: `User with this ${field} already exists!` 
            });
        }

        // Bookseller specific validation
        if (role === 'bookseller') {
            if (!profile.storeName) {
                return res.status(400).json({
                    success: false,
                    message: "Store name is required for booksellers"
                });
            }

            // Check if store name is already taken
            const existingStore = await User.findOne({ 
                'profile.storeName': profile.storeName,
                role: 'bookseller'
            });

            if (existingStore) {
                return res.status(400).json({
                    success: false,
                    message: "Store name is already taken"
                });
            }
        }

        // Create user data
        const userData = {
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password,
            role,
            profile: {
                ...profile,
                // Set bookseller specific fields
                ...(role === 'bookseller' && {
                    storeStatus: 'pending',
                    storeContact: profile.storeContact || {}
                })
            },
            lastLogin: new Date()
        };

        const user = new User(userData);
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            success: true,
            message: role === 'bookseller' 
                ? "Bookseller registered successfully! Your account is pending approval." 
                : "User registered successfully!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile: user.profile,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false,
                message: "Validation failed", 
                errors 
            });
        }

        return res.status(500).json({ 
            success: false,
            message: "Failed to register user" 
        });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: MySecurePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account deactivated or bookseller not approved
 *       404:
 *         description: User not found
 */
router.post("/login", authLimiter, validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found!" 
            });
        }

        if (!user.isActive) {
            return res.status(403).json({ 
                success: false,
                message: "Account is deactivated. Please contact support." 
            });
        }

        // Check bookseller approval status
        if (user.role === 'bookseller' && user.profile.storeStatus !== 'approved') {
            return res.status(403).json({
                success: false,
                message: "Bookseller account is pending approval. Please contact administrator."
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid email or password!" 
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile: user.profile,
                isActive: user.isActive,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ 
            success: false,
            message: "Failed to login" 
        });
    }
});

/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: AdminPass123
 *     responses:
 *       200:
 *         description: Admin login successful
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Not an admin account
 *       404:
 *         description: Admin not found
 */
router.post("/admin/login", authLimiter, [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        console.log("Admin login attempt:", req.body);
        
        // Check JWT_SECRET
        if (!JWT_SECRET) {
            console.error("JWT_SECRET is not configured");
            return res.status(500).json({ 
                success: false,
                message: "Server configuration error" 
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { username, password } = req.body;
        console.log("Looking for admin with username:", username.toLowerCase());

        // Find admin user
        const admin = await User.findOne({ 
            username: username.toLowerCase(), 
            role: 'admin' 
        });

        console.log("Admin found:", admin ? "Yes" : "No");

        if (!admin) {
            console.log("Admin not found for username:", username);
            return res.status(404).json({ 
                success: false,
                message: "Admin account not found!" 
            });
        }

        console.log("Admin status - isActive:", admin.isActive);

        if (!admin.isActive) {
            return res.status(403).json({ 
                success: false,
                message: "Admin account is deactivated!" 
            });
        }

        console.log("Comparing passwords...");
        const isMatch = await admin.comparePassword(password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid credentials!" 
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        console.log("Generating JWT token...");
        const token = jwt.sign(
            { 
                id: admin._id, 
                username: admin.username, 
                role: admin.role 
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("Admin login successful for:", admin.username);

        return res.status(200).json({
            success: true,
            message: "Admin authentication successful",
            token,
            user: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                lastLogin: admin.lastLogin
            }
        });

    } catch (error) {
        console.error("Admin login error details:", error);
        console.error("Error stack:", error.stack);
        
        // More specific error messages
        if (error.name === 'MongoNetworkError') {
            return res.status(500).json({ 
                success: false,
                message: "Database connection error" 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(500).json({ 
                success: false,
                message: "JWT configuration error" 
            });
        }

        return res.status(500).json({ 
            success: false,
            message: `Failed to login as admin: ${error.message}` 
        });
    }
});

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/profile", generalLimiter, verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('favorites');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch profile" 
        });
    }
});

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newUsername
 *               email:
 *                 type: string
 *                 example: newemail@example.com
 *               profile:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   bio:
 *                     type: string
 *                   address:
 *                     type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to update profile
 */
router.put("/profile", generalLimiter, verifyToken, validateProfileUpdate, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const updateData = { ...req.body };

        // If username is being updated, check for uniqueness
        if (updateData.username) {
            const existingUser = await User.findOne({
                username: updateData.username.toLowerCase(),
                _id: { $ne: req.user.id }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Username is already taken"
                });
            }
            updateData.username = updateData.username.toLowerCase();
        }

        // If email is being updated, check for uniqueness
        if (updateData.email) {
            const existingUser = await User.findOne({
                email: updateData.email.toLowerCase(),
                _id: { $ne: req.user.id }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already registered"
                });
            }
            updateData.email = updateData.email.toLowerCase();
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update profile" 
        });
    }
});

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: NewSecurePassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 *       500:
 *         description: Failed to change password
 */
router.put("/change-password", generalLimiter, verifyToken, [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({
            success: false,
            message: "Failed to change password"
        });
    }
});

/**
 * @swagger
 * /auth/favorites/{bookId}:
 *   post:
 *     summary: Add a book to favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book added to favorites
 *       400:
 *         description: Book already in favorites
 *       500:
 *         description: Server error
 */
router.post("/favorites/:bookId", generalLimiter, verifyToken, async (req, res) => {
    try {
        const { bookId } = req.params;
        
        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "Book ID is required"
            });
        }

        const user = await User.findById(req.user.id);
        if (user.favorites.includes(bookId)) {
            return res.status(400).json({ 
                success: false,
                message: "Book already in favorites" 
            });
        }

        user.favorites.push(bookId);
        await user.save();
        await user.populate('favorites');
        
        res.status(200).json({
            success: true,
            message: "Book added to favorites",
            favorites: user.favorites
        });
    } catch (error) {
        console.error("Error adding to favorites:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to add to favorites" 
        });
    }
});

/**
 * @swagger
 * /auth/favorites/{bookId}:
 *   delete:
 *     summary: Remove a book from favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book removed from favorites
 *       500:
 *         description: Failed to remove book
 */
router.delete("/favorites/:bookId", generalLimiter, verifyToken, async (req, res) => {
    try {
        const { bookId } = req.params;
        
        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "Book ID is required"
            });
        }

        const user = await User.findById(req.user.id);
        user.favorites = user.favorites.filter(fav => fav.toString() !== bookId);
        await user.save();
        await user.populate('favorites');
        
        res.status(200).json({
            success: true,
            message: "Book removed from favorites",
            favorites: user.favorites
        });
    } catch (error) {
        console.error("Error removing from favorites:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to remove from favorites" 
        });
    }
});

/**
 * @swagger
 * /auth/favorites:
 *   get:
 *     summary: Get user's favorite books
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 favorites:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
router.get("/favorites", generalLimiter, verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('favorites');
        
        res.status(200).json({
            success: true,
            favorites: user.favorites
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch favorites" 
        });
    }
});

/**
 * @swagger
 * /auth/booksellers/pending:
 *   get:
 *     summary: Get pending bookseller applications (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending booksellers
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/booksellers/pending", generalLimiter, verifyToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const pendingBooksellers = await User.find({
            role: 'bookseller',
            'profile.storeStatus': 'pending'
        }).select('-password');

        res.status(200).json({
            success: true,
            booksellers: pendingBooksellers
        });
    } catch (error) {
        console.error("Error fetching pending booksellers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch pending booksellers"
        });
    }
});

/**
 * @swagger
 * /auth/booksellers/{userId}/approve:
 *   put:
 *     summary: Approve or reject bookseller application (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the bookseller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *                 example: approve
 *     responses:
 *       200:
 *         description: Bookseller application updated
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Bookseller not found
 */
router.put("/booksellers/:userId/approve", generalLimiter, verifyToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const { userId } = req.params;
        const { action } = req.body;

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Action must be either 'approve' or 'reject'"
            });
        }

        const bookseller = await User.findOne({
            _id: userId,
            role: 'bookseller'
        });

        if (!bookseller) {
            return res.status(404).json({
                success: false,
                message: "Bookseller not found"
            });
        }

        bookseller.profile.storeStatus = action === 'approve' ? 'approved' : 'rejected';
        await bookseller.save();

        res.status(200).json({
            success: true,
            message: `Bookseller application ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
            bookseller: {
                id: bookseller._id,
                username: bookseller.username,
                email: bookseller.email,
                profile: bookseller.profile
            }
        });
    } catch (error) {
        console.error("Error updating bookseller status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update bookseller status"
        });
    }
});

/**
 * @swagger
 * /auth/verify-token:
 *   get:
 *     summary: Verify JWT token validity
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Token is invalid or expired
 */
router.get("/verify-token", generalLimiter, verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Token is valid",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile: user.profile
            }
        });
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({
            success: false,
            message: "Token is invalid"
        });
    }
});

// =============================================
// NEW ADMIN DASHBOARD ROUTES - ADDED BELOW
// =============================================

/**
 * @swagger
 * /auth/admin/users:
 *   get:
 *     summary: Get all users for admin dashboard
 *     tags: [Admin]
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
 *         description: Number of users per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, bookseller, admin]
 *         description: Filter by role
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by username or email
 *     responses:
 *       200:
 *         description: Users list retrieved successfully
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.get("/admin/users", generalLimiter, verifyToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { role, search } = req.query;
        
        const skip = (page - 1) * limit;
        
        let query = {};
        
        // Filter by role
        if (role) {
            query.role = role;
        }
        
        // Search by username or email
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);
        
        // Get user statistics
        const userStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const stats = {
            total: totalUsers,
            users: userStats.find(stat => stat._id === 'user')?.count || 0,
            booksellers: userStats.find(stat => stat._id === 'bookseller')?.count || 0,
            admins: userStats.find(stat => stat._id === 'admin')?.count || 0
        };

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                },
                stats
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
});

/**
 * @swagger
 * /auth/admin/booksellers:
 *   get:
 *     summary: Get all booksellers for admin dashboard
 *     tags: [Admin]
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
 *         description: Number of booksellers per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by approval status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by store name or email
 *     responses:
 *       200:
 *         description: Booksellers list retrieved successfully
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.get("/admin/booksellers", generalLimiter, verifyToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { status, search } = req.query;
        
        const skip = (page - 1) * limit;
        
        let query = { role: 'bookseller' };
        
        // Filter by approval status
        if (status) {
            query['profile.storeStatus'] = status;
        }
        
        // Search by store name or email
        if (search) {
            query.$or = [
                { 'profile.storeName': { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } }
            ];
        }
        
        const booksellers = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const totalBooksellers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalBooksellers / limit);
        
        // Get bookseller statistics by status
        const statusStats = await User.aggregate([
            {
                $match: { role: 'bookseller' }
            },
            {
                $group: {
                    _id: '$profile.storeStatus',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const stats = {
            total: totalBooksellers,
            pending: statusStats.find(stat => stat._id === 'pending')?.count || 0,
            approved: statusStats.find(stat => stat._id === 'approved')?.count || 0,
            rejected: statusStats.find(stat => stat._id === 'rejected')?.count || 0
        };

        res.status(200).json({
            success: true,
            data: {
                booksellers,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalBooksellers,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                },
                stats
            }
        });
    } catch (error) {
        console.error("Error fetching booksellers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch booksellers"
        });
    }
});

/**
 * @swagger
 * /auth/admin/users/{userId}:
 *   get:
 *     summary: Get user details by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/admin/users/:userId", generalLimiter, verifyToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const { userId } = req.params;
        
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // If bookseller, get additional stats
        let additionalData = {};
        if (user.role === 'bookseller') {
            const Book = require('../books/book.model');
            const Order = require('../orders/order.model');
            
            const totalBooks = await Book.countDocuments({ bookseller: userId });
            const totalOrders = await Order.countDocuments({ 
                'items.book.bookseller': userId 
            });
            
            additionalData = {
                totalBooks,
                totalOrders
            };
        }

        res.status(200).json({
            success: true,
            data: {
                user,
                ...additionalData
            }
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user details"
        });
    }
});

/**
 * @swagger
 * /auth/admin/users/{userId}/status:
 *   put:
 *     summary: Update user status (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: User active status
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/admin/users/:userId/status", generalLimiter, verifyToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const { userId } = req.params;
        const { isActive } = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { isActive },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: user
        });
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user status"
        });
    }
});

module.exports = router;