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

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated favorite ID
 *         user:
 *           type: string
 *           description: User ID who favorited the book
 *         book:
 *           $ref: '#/components/schemas/Book'
 *         addedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     FavoriteResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         favorite:
 *           $ref: '#/components/schemas/Favorite'
 * 
 *     FavoriteBook:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         coverImage:
 *           type: string
 *         oldPrice:
 *           type: number
 *         newPrice:
 *           type: number
 *         stock:
 *           type: number
 *         seller:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *             profile:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *         favoritedAt:
 *           type: string
 *           format: date-time
 * 
 *     FavoriteListResponse:
 *       type: object
 *       properties:
 *         favorites:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Favorite'
 *         totalPages:
 *           type: number
 *         currentPage:
 *           type: number
 *         total:
 *           type: number
 * 
 *     FavoriteBooksResponse:
 *       type: object
 *       properties:
 *         books:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FavoriteBook'
 *         totalPages:
 *           type: number
 *         currentPage:
 *           type: number
 *         total:
 *           type: number
 * 
 *     FavoriteStatusResponse:
 *       type: object
 *       properties:
 *         isFavorited:
 *           type: boolean
 *         bookId:
 *           type: string
 * 
 *     FavoriteCountResponse:
 *       type: object
 *       properties:
 *         bookId:
 *           type: string
 *         favoriteCount:
 *           type: number
 * 
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         error:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Book favorites management
 */

/**
 * @swagger
 * /favorites/{bookId}:
 *   post:
 *     summary: Add a book to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID to add to favorites
 *     responses:
 *       201:
 *         description: Book added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteResponse'
 *       400:
 *         description: Book already in favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:bookId", addToFavorites);

/**
 * @swagger
 * /favorites/{bookId}:
 *   delete:
 *     summary: Remove a book from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID to remove from favorites
 *     responses:
 *       200:
 *         description: Book removed from favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book removed from favorites successfully"
 *       404:
 *         description: Favorite not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:bookId", removeFromFavorites);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get user's favorites with pagination
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: User's favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteListResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getUserFavorites);

/**
 * @swagger
 * /favorites/books:
 *   get:
 *     summary: Get user's favorite books with complete details
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: User's favorite books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteBooksResponse'
 *         examples:
 *           success:
 *             value:
 *               books:
 *                 - _id: "507f1f77bcf86cd799439011"
 *                   title: "The Great Gatsby"
 *                   author: "F. Scott Fitzgerald"
 *                   description: "A classic novel about the American Dream"
 *                   category: "Fiction"
 *                   coverImage: "https://example.com/images/gatsby.jpg"
 *                   oldPrice: 29.99
 *                   newPrice: 24.99
 *                   stock: 10
 *                   seller:
 *                     _id: "507f1f77bcf86cd799439012"
 *                     username: "john_bookseller"
 *                     profile:
 *                       fullName: "John Doe"
 *                   favoritedAt: "2023-10-15T10:30:00.000Z"
 *               totalPages: 1
 *               currentPage: 1
 *               total: 1
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/books", getFavoriteBooks);

/**
 * @swagger
 * /favorites/check/{bookId}:
 *   get:
 *     summary: Check if a book is favorited by the current user
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID to check favorite status
 *     responses:
 *       200:
 *         description: Favorite status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteStatusResponse'
 *         examples:
 *           favorited:
 *             value:
 *               isFavorited: true
 *               bookId: "507f1f77bcf86cd799439011"
 *           notFavorited:
 *             value:
 *               isFavorited: false
 *               bookId: "507f1f77bcf86cd799439011"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/check/:bookId", checkIsFavorited);

/**
 * @swagger
 * /favorites/count/{bookId}:
 *   get:
 *     summary: Get favorite count for a book (Public route)
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID to get favorite count
 *     responses:
 *       200:
 *         description: Favorite count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteCountResponse'
 *         examples:
 *           success:
 *             value:
 *               bookId: "507f1f77bcf86cd799439011"
 *               favoriteCount: 15
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/count/:bookId", getBookFavoriteCount);

module.exports = router;