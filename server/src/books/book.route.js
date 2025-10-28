const express = require('express');
const { 
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
} = require('./book.controller');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdminToken');
const verifyBookseller = require('../middleware/verifyBookseller');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - description
 *         - category
 *         - coverImage
 *         - oldPrice
 *         - newPrice
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated book ID
 *         title:
 *           type: string
 *           description: Book title
 *         author:
 *           type: string
 *           description: Book author
 *         description:
 *           type: string
 *           description: Book description
 *         category:
 *           type: string
 *           description: Book category
 *         subcategory:
 *           type: string
 *           description: Book subcategory
 *         isbn:
 *           type: string
 *           description: International Standard Book Number
 *         trending:
 *           type: boolean
 *           default: false
 *         recommended:
 *           type: boolean
 *           default: false
 *         coverImage:
 *           type: string
 *           description: URL of book cover image
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         oldPrice:
 *           type: number
 *           description: Original price
 *         newPrice:
 *           type: number
 *           description: Current selling price
 *         stock:
 *           type: number
 *           default: 0
 *         pages:
 *           type: number
 *         publisher:
 *           type: string
 *         publishedDate:
 *           type: string
 *           format: date
 *         language:
 *           type: string
 *           default: "English"
 *         condition:
 *           type: string
 *           enum: [new, used, refurbished]
 *           default: "new"
 *         seller:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             profile:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                 avatar:
 *                   type: string
 *         status:
 *           type: string
 *           enum: [active, inactive, sold]
 *           default: "active"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         rating:
 *           type: object
 *           properties:
 *             average:
 *               type: number
 *               default: 0
 *             count:
 *               type: number
 *               default: 0
 *         addedBy:
 *           type: string
 *           enum: [admin, bookseller]
 *           description: Who added this book
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     BookListResponse:
 *       type: object
 *       properties:
 *         books:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 *         totalPages:
 *           type: number
 *         currentPage:
 *           type: number
 *         total:
 *           type: number
 * 
 *     BookListResponseWithRole:
 *       type: object
 *       properties:
 *         books:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 *         totalPages:
 *           type: number
 *         currentPage:
 *           type: number
 *         total:
 *           type: number
 *         userRole:
 *           type: string
 *           description: Role of the requesting user
 * 
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         error:
 *           type: string
 * 
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         book:
 *           $ref: '#/components/schemas/Book'
 *         addedBy:
 *           type: string
 *           description: Role of user who performed the action
 * 
 *     BookStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [active, inactive, sold]
 * 
 *     BookFeaturesUpdate:
 *       type: object
 *       properties:
 *         trending:
 *           type: boolean
 *         recommended:
 *           type: boolean
 * 
 *     AuthorizationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         userRole:
 *           type: string
 *         bookOwner:
 *           type: boolean
 *           description: Whether the user owns the book
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management endpoints with role-based access
 */

// =============================================
// PUBLIC ROUTES - No authentication required
// =============================================

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all active books with filtering and pagination
 *     tags: [Books]
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: trending
 *         schema:
 *           type: boolean
 *         description: Filter trending books
 *       - in: query
 *         name: recommended
 *         schema:
 *           type: boolean
 *         description: Filter recommended books
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, author, description
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, newPrice, title, rating.average]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of active books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookListResponse'
 *             examples:
 *               success:
 *                 value:
 *                   books:
 *                     - _id: "507f1f77bcf86cd799439011"
 *                       title: "The Great Gatsby"
 *                       author: "F. Scott Fitzgerald"
 *                       description: "A classic novel about the American Dream"
 *                       category: "Fiction"
 *                       coverImage: "https://example.com/images/gatsby.jpg"
 *                       newPrice: 24.99
 *                       oldPrice: 29.99
 *                       seller:
 *                         _id: "507f1f77bcf86cd799439012"
 *                         username: "john_bookseller"
 *                         profile:
 *                           fullName: "John Doe"
 *                       addedBy: "bookseller"
 *                   totalPages: 5
 *                   currentPage: 1
 *                   total: 45
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getAllBooks);

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search books by various criteria
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for title, author, or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 */
router.get("/search", searchBooks);

/**
 * @swagger
 * /books/recommended:
 *   get:
 *     summary: Get recommended books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of recommended books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 */
router.get("/recommended", getRecommendedBooks);

/**
 * @swagger
 * /books/trending:
 *   get:
 *     summary: Get trending books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of trending books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 */
router.get("/trending", getTrendingBooks);

/**
 * @swagger
 * /books/seller/{sellerId}:
 *   get:
 *     summary: Get books by specific seller
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Seller's books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookListResponse'
 *       500:
 *         description: Internal server error
 */
router.get("/seller/:sellerId", getBooksBySeller);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *             examples:
 *               success:
 *                 value:
 *                   _id: "507f1f77bcf86cd799439011"
 *                   title: "The Great Gatsby"
 *                   author: "F. Scott Fitzgerald"
 *                   description: "A classic novel about the American Dream"
 *                   category: "Fiction"
 *                   coverImage: "https://example.com/images/gatsby.jpg"
 *                   newPrice: 24.99
 *                   oldPrice: 29.99
 *                   stock: 10
 *                   seller:
 *                     _id: "507f1f77bcf86cd799439012"
 *                     username: "john_bookseller"
 *                     email: "john@example.com"
 *                     profile:
 *                       fullName: "John Doe"
 *                       avatar: "https://example.com/avatar.jpg"
 *                   addedBy: "bookseller"
 *                   isFavorited: true
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getSingleBook);

// =============================================
// BOOKSELLER ROUTES - Requires bookseller role
// =============================================

/**
 * @swagger
 * /books/create-book:
 *   post:
 *     summary: Create a new book (Bookseller only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - description
 *               - category
 *               - coverImage
 *               - oldPrice
 *               - newPrice
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               author:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *               description:
 *                 type: string
 *                 example: "A classic novel about the American Dream"
 *               category:
 *                 type: string
 *                 example: "Fiction"
 *               subcategory:
 *                 type: string
 *                 example: "Classic Literature"
 *               isbn:
 *                 type: string
 *                 example: "978-0-7432-7356-5"
 *               coverImage:
 *                 type: string
 *                 example: "https://example.com/images/book-cover.jpg"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/images/book1.jpg", "https://example.com/images/book2.jpg"]
 *               oldPrice:
 *                 type: number
 *                 example: 29.99
 *               newPrice:
 *                 type: number
 *                 example: 24.99
 *               stock:
 *                 type: number
 *                 example: 10
 *               pages:
 *                 type: number
 *                 example: 218
 *               publisher:
 *                 type: string
 *                 example: "Scribner"
 *               publishedDate:
 *                 type: string
 *                 format: date
 *                 example: "1925-04-10"
 *               language:
 *                 type: string
 *                 example: "English"
 *               condition:
 *                 type: string
 *                 enum: [new, used, refurbished]
 *                 example: "new"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["classic", "american-literature", "fiction"]
 *     responses:
 *       200:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               success:
 *                 value:
 *                   message: "Book posted successfully"
 *                   book:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     title: "The Great Gatsby"
 *                     author: "F. Scott Fitzgerald"
 *                     seller: "507f1f77bcf86cd799439012"
 *                     addedBy: "bookseller"
 *                   addedBy: "bookseller"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a bookseller
 *       500:
 *         description: Internal server error
 */
router.post("/create-book", verifyToken, verifyBookseller, postABook);

/**
 * @swagger
 * /books/bookseller/my-books:
 *   get:
 *     summary: Get current bookseller's own books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Bookseller's books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookListResponseWithRole'
 *             examples:
 *               success:
 *                 value:
 *                   books:
 *                     - _id: "507f1f77bcf86cd799439011"
 *                       title: "The Great Gatsby"
 *                       author: "F. Scott Fitzgerald"
 *                       status: "active"
 *                       addedBy: "bookseller"
 *                   totalPages: 2
 *                   currentPage: 1
 *                   total: 15
 *                   userRole: "bookseller"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not a bookseller
 */
router.get("/bookseller/my-books", verifyToken, verifyBookseller, getMyBooks);

// =============================================
// PROTECTED ROUTES - Requires authentication
// =============================================

/**
 * @swagger
 * /books/edit/{id}:
 *   put:
 *     summary: Update a book (Owner or Admin only)
 *     description: |
 *       **Authorization Rules:**
 *       - Booksellers can only update their own books
 *       - Admins can update any book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               subcategory:
 *                 type: string
 *               isbn:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               oldPrice:
 *                 type: number
 *               newPrice:
 *                 type: number
 *               stock:
 *                 type: number
 *               pages:
 *                 type: number
 *               publisher:
 *                 type: string
 *               publishedDate:
 *                 type: string
 *                 format: date
 *               language:
 *                 type: string
 *               condition:
 *                 type: string
 *                 enum: [new, used, refurbished]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, sold]
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *                 updatedBy:
 *                   type: string
 *             examples:
 *               bookseller:
 *                 value:
 *                   message: "Book updated successfully"
 *                   book:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     title: "Updated Book Title"
 *                     updatedBy: "bookseller"
 *               admin:
 *                 value:
 *                   message: "Book updated successfully"
 *                   book:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     title: "Updated Book Title"
 *                     updatedBy: "admin"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User does not own the book and is not admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorizationError'
 *             examples:
 *               forbidden:
 *                 value:
 *                   message: "Not authorized to update this book"
 *                   userRole: "bookseller"
 *                   bookOwner: false
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.put("/edit/:id", verifyToken, UpdateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book (Owner or Admin only)
 *     description: |
 *       **Authorization Rules:**
 *       - Booksellers can only delete their own books
 *       - Admins can delete any book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *                 deletedBy:
 *                   type: string
 *             examples:
 *               bookseller:
 *                 value:
 *                   message: "Book deleted successfully"
 *                   book:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     title: "The Great Gatsby"
 *                   deletedBy: "bookseller"
 *               admin:
 *                 value:
 *                   message: "Book deleted successfully"
 *                   book:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     title: "The Great Gatsby"
 *                   deletedBy: "admin"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User does not own the book and is not admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorizationError'
 *             examples:
 *               forbidden:
 *                 value:
 *                   message: "Not authorized to delete this book"
 *                   userRole: "bookseller"
 *                   bookOwner: false
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", verifyToken, deleteABook);

// =============================================
// ADMIN ROUTES - Requires admin role
// =============================================

/**
 * @swagger
 * /books/admin/all-books:
 *   get:
 *     summary: Get all books (Admin only - includes inactive books)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, sold]
 *         description: Filter by book status
 *       - in: query
 *         name: addedBy
 *         schema:
 *           type: string
 *           enum: [admin, bookseller]
 *         description: Filter by who added the book
 *     responses:
 *       200:
 *         description: All books retrieved successfully (admin view)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookListResponseWithRole'
 *             examples:
 *               success:
 *                 value:
 *                   books:
 *                     - _id: "507f1f77bcf86cd799439011"
 *                       title: "The Great Gatsby"
 *                       status: "active"
 *                       addedBy: "bookseller"
 *                     - _id: "507f1f77bcf86cd799439012"
 *                       title: "Admin Added Book"
 *                       status: "inactive"
 *                       addedBy: "admin"
 *                   totalPages: 3
 *                   currentPage: 1
 *                   total: 25
 *                   userRole: "admin"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/admin/all-books", verifyToken, verifyAdmin, getAllBooksAdmin);

/**
 * @swagger
 * /books/admin/status/{id}:
 *   patch:
 *     summary: Update book status (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookStatusUpdate'
 *           examples:
 *             activate:
 *               value:
 *                 status: "active"
 *             deactivate:
 *               value:
 *                 status: "inactive"
 *             markSold:
 *               value:
 *                 status: "sold"
 *     responses:
 *       200:
 *         description: Book status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *                 updatedBy:
 *                   type: string
 *             examples:
 *               success:
 *                 value:
 *                   message: "Book status updated successfully"
 *                   book:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     title: "The Great Gatsby"
 *                     status: "inactive"
 *                   updatedBy: "admin"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Book not found
 */
router.patch("/admin/status/:id", verifyToken, verifyAdmin, updateBookStatus);

/**
 * @swagger
 * /books/admin/features/{id}:
 *   patch:
 *     summary: Update book features like trending/recommended (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookFeaturesUpdate'
 *           examples:
 *             trending:
 *               value:
 *                 trending: true
 *                 recommended: false
 *             recommended:
 *               value:
 *                 trending: false
 *                 recommended: true
 *             both:
 *               value:
 *                 trending: true
 *                 recommended: true
 *     responses:
 *       200:
 *         description: Book features updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *                 updatedBy:
 *                   type: string
 *             examples:
 *               success:
 *                 value:
 *                   message: "Book features updated successfully"
 *                   book:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     title: "The Great Gatsby"
 *                     trending: true
 *                     recommended: true
 *                   updatedBy: "admin"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Book not found
 */
router.patch("/admin/features/:id", verifyToken, verifyAdmin, updateBookFeature);

module.exports = router;