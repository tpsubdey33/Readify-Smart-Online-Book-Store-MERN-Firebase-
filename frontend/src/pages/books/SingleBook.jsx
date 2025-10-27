import React, { useState, useEffect } from 'react'
import { FiShoppingCart, FiHeart, FiShare2, FiStar, FiChevronLeft, FiChevronRight, FiCopy, FiTag, FiBook, FiUser, FiCalendar, FiGlobe } from "react-icons/fi"
import { FaHeart, FaStar, FaRegStar, FaShoppingCart } from "react-icons/fa"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../components/Loading';

const SingleBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: book, isLoading, isError, refetch } = useFetchBookByIdQuery(id);
    const dispatch = useDispatch();
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showShareModal, setShowShareModal] = useState(false);

    // Initialize favorite status when book data loads
    useEffect(() => {
        if (book?.isFavorited) {
            setIsFavorite(book.isFavorited);
        }
    }, [book]);

    // Price handling with newPrice and oldPrice from backend
    const currentPrice = book?.newPrice || 0;
    const oldPrice = book?.oldPrice || 0;
    const hasDiscount = oldPrice && oldPrice > currentPrice;
    const discountPercentage = hasDiscount ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;
    const savings = hasDiscount ? (oldPrice - currentPrice) : 0;

    // Handle images array from backend
    const images = book?.images && book.images.length > 0 ? book.images : 
                  book?.coverImage ? [book.coverImage] : 
                  ['/api/placeholder/500/700'];

    const handleAddToCart = () => {
        if (!book) return;

        // Check stock availability
        if (book.stock === 0) {
            toast.error('Sorry, this book is out of stock!');
            return;
        }

        if (book.stock < quantity) {
            toast.error(`Only ${book.stock} copies available in stock!`);
            return;
        }

        const cartItem = {
            _id: book._id,
            title: book.title,
            author: book.author,
            coverImage: book.coverImage,
            price: currentPrice,
            oldPrice: oldPrice,
            quantity: quantity,
            stock: book.stock,
            category: book.category
        };

        dispatch(addToCart(cartItem));
        toast.success(`${quantity} ${quantity > 1 ? 'copies' : 'copy'} of "${book.title}" added to cart!`);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const increaseQuantity = () => {
        if (book?.stock && quantity < book.stock) {
            setQuantity(prev => prev + 1);
        } else {
            toast.info(`Maximum ${book?.stock} copies available`);
        }
    };

    const decreaseQuantity = () => {
        setQuantity(prev => prev > 1 ? prev - 1 : 1);
    };

    const handleShare = async (method = 'copy') => {
        const shareUrl = window.location.href;
        const shareText = `Check out "${book.title}" by ${book.author} - $${currentPrice}${hasDiscount ? ` (${discountPercentage}% OFF!)` : ''}`;

        try {
            switch (method) {
                case 'copy':
                    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                    toast.success('Link copied to clipboard!');
                    break;
                
                case 'twitter':
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
                    break;
                
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
                    break;
                
                case 'whatsapp':
                    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
                    break;
                
                case 'email':
                    window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareText + '\n' + shareUrl)}`);
                    break;
                
                default:
                    break;
            }
        } catch (error) {
            console.error('Share failed:', error);
            toast.error('Failed to share. Please try again.');
        }
        
        setShowShareModal(false);
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(!isFavorite ? 'Added to favorites!' : 'Removed from favorites!');
    };

    // Render star rating
    const renderRating = () => {
        const rating = book?.rating?.average || 0;
        const count = book?.rating?.count || 0;
        
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= Math.floor(rating) ? (
                    <FaStar key={i} className="text-yellow-400 text-lg" />
                ) : (
                    <FaRegStar key={i} className="text-gray-300 text-lg" />
                )
            );
        }
        
        return (
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                    {stars}
                </div>
                <span className="text-gray-600">({rating.toFixed(1)})</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{count} reviews</span>
            </div>
        );
    };

    if (isLoading) {
        return <Loading text="Loading book details..." />;
    }

    if (isError || !book) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">📚</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Book Not Found</h2>
                    <p className="text-gray-600 mb-6">We couldn't find the book you're looking for.</p>
                    <button 
                        onClick={() => navigate('/books')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                        Browse Books
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <ToastContainer position="bottom-right" />
            
            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Share this book</h3>
                            <button 
                                onClick={() => setShowShareModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => handleShare('copy')}
                                className="flex flex-col items-center justify-center space-y-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                <FiCopy className="w-6 h-6 text-gray-600" />
                                <span className="text-sm">Copy Link</span>
                            </button>
                            
                            <button
                                onClick={() => handleShare('twitter')}
                                className="flex flex-col items-center justify-center space-y-2 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                            >
                                <span className="text-blue-400 text-xl">𝕏</span>
                                <span className="text-sm">Twitter</span>
                            </button>
                            
                            <button
                                onClick={() => handleShare('facebook')}
                                className="flex flex-col items-center justify-center space-y-2 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                            >
                                <span className="text-blue-600 text-xl">f</span>
                                <span className="text-sm">Facebook</span>
                            </button>
                            
                            <button
                                onClick={() => handleShare('whatsapp')}
                                className="flex flex-col items-center justify-center space-y-2 p-4 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors duration-200"
                            >
                                <span className="text-green-500 text-xl">📱</span>
                                <span className="text-sm">WhatsApp</span>
                            </button>
                        </div>
                        
                        <button
                            onClick={() => handleShare('email')}
                            className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        >
                            <span className="text-gray-600">✉️</span>
                            <span>Share via Email</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                        <FiChevronLeft className="mr-2" />
                        Back to Books
                    </button>
                </nav>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Book Images Section */}
                        <div className="space-y-6">
                            <div className="relative bg-gray-100 rounded-xl overflow-hidden group flex items-center justify-center min-h-[500px]">
                                {/* Badges */}
                                <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                                    {book.trending && (
                                        <div className="bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm flex items-center space-x-1 shadow-lg">
                                            <span>🔥</span>
                                            <span>Trending</span>
                                        </div>
                                    )}
                                    {book.recommended && (
                                        <div className="bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm flex items-center space-x-1 shadow-lg">
                                            <span>⭐</span>
                                            <span>Recommended</span>
                                        </div>
                                    )}
                                    {hasDiscount && (
                                        <div className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm flex items-center space-x-1 shadow-lg">
                                            <FiTag className="w-3 h-3" />
                                            <span>{discountPercentage}% OFF</span>
                                        </div>
                                    )}
                                </div>

                                {/* Stock Status */}
                                <div className="absolute top-4 right-4 z-10">
                                    {book.stock === 0 ? (
                                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                            Out of Stock
                                        </div>
                                    ) : book.stock < 10 ? (
                                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                            Low Stock
                                        </div>
                                    ) : (
                                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                                            In Stock
                                        </div>
                                    )}
                                </div>

                                <img
                                    src={images[currentImageIndex]}
                                    alt={book.title}
                                    className="max-w-full max-h-[500px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/500x700/f3f4f6/6b7280?text=No+Image';
                                    }}
                                />
                                
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                        >
                                            <FiChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                        >
                                            <FiChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {/* Action Buttons */}
                                <div className="absolute top-16 right-4 flex flex-col space-y-2">
                                    <button
                                        onClick={toggleFavorite}
                                        className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                                            isFavorite 
                                                ? 'bg-red-500 text-white' 
                                                : 'bg-white/90 hover:bg-white text-gray-800'
                                        }`}
                                    >
                                        {isFavorite ? (
                                            <FaHeart className="w-5 h-5 fill-current" />
                                        ) : (
                                            <FiHeart className="w-5 h-5" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setShowShareModal(true)}
                                        className="p-3 rounded-full shadow-lg bg-white/90 hover:bg-white text-gray-800 transition-all duration-200"
                                    >
                                        <FiShare2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {images.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="flex space-x-3 overflow-x-auto pb-2">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                index === currentImageIndex 
                                                    ? 'border-blue-600 ring-2 ring-blue-200' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${book.title} view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/80x80/f3f4f6/6b7280?text=Image';
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Book Details Section */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                                    {book.title}
                                </h1>
                                <p className="text-xl text-gray-600 mb-4 flex items-center">
                                    <FiUser className="mr-2 text-gray-400" />
                                    by {book.author || 'Unknown Author'}
                                </p>
                                
                                {/* Rating */}
                                {renderRating()}

                                {/* Enhanced Price Display */}
                                <div className="mb-6 space-y-2 mt-4">
                                    <div className="flex items-baseline space-x-3">
                                        <span className="text-3xl font-bold text-gray-900">
                                            ${currentPrice.toFixed(2)}
                                        </span>
                                        
                                        {hasDiscount && (
                                            <span className="text-xl text-gray-500 line-through">
                                                ${oldPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {hasDiscount && (
                                        <div className="flex items-center space-x-3">
                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                You save ${savings.toFixed(2)}
                                            </span>
                                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                {discountPercentage}% OFF
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Book Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                    <FiBook className="mr-2 text-gray-400" />
                                    Description
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {book.description || "No description available for this book."}
                                </p>
                            </div>

                            {/* Book Details Grid */}
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <FiTag className="mr-1" />
                                            Category
                                        </span>
                                        <p className="font-medium text-gray-900 capitalize">{book.category || 'N/A'}</p>
                                        {book.subcategory && (
                                            <p className="text-sm text-gray-600 capitalize">{book.subcategory}</p>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <FiBook className="mr-1" />
                                            Pages
                                        </span>
                                        <p className="font-medium text-gray-900">{book.pages || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            📦 Condition
                                        </span>
                                        <p className="font-medium text-gray-900 capitalize">{book.condition || 'New'}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <FiCalendar className="mr-1" />
                                            Published
                                        </span>
                                        <p className="font-medium text-gray-900">
                                            {book.publishedDate ? new Date(book.publishedDate).getFullYear() : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <FiGlobe className="mr-1" />
                                            Language
                                        </span>
                                        <p className="font-medium text-gray-900">{book.language || 'English'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Publisher</span>
                                        <p className="font-medium text-gray-900">{book.publisher || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Information */}
                            {book.seller && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Sold By</h4>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {book.seller.username?.charAt(0).toUpperCase() || 'S'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {book.seller.profile?.fullName || book.seller.username}
                                            </p>
                                            <p className="text-sm text-gray-600">Verified Seller</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart Section */}
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={decreaseQuantity}
                                            disabled={quantity <= 1}
                                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="text-lg">-</span>
                                        </button>
                                        <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                                        <button
                                            onClick={increaseQuantity}
                                            disabled={book.stock && quantity >= book.stock}
                                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="text-lg">+</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={book.stock === 0}
                                        className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3 ${
                                            book.stock === 0
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                                        }`}
                                    >
                                        <FaShoppingCart className="w-5 h-5" />
                                        <span>
                                            {book.stock === 0 
                                                ? 'Out of Stock' 
                                                : `Add to Cart (${quantity})`
                                            }
                                        </span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => setShowShareModal(true)}
                                        className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3"
                                    >
                                        <FiShare2 className="w-5 h-5" />
                                        <span>Share</span>
                                    </button>
                                </div>

                                {/* Stock Information */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        {book.stock === 0 
                                            ? 'This item is currently out of stock'
                                            : `${book.stock} copies available in stock`
                                        }
                                    </p>
                                </div>

                                {/* Enhanced Savings Info */}
                                {hasDiscount && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center space-x-2 text-green-800">
                                            <span>💰</span>
                                            <span className="font-semibold">Great Deal!</span>
                                        </div>
                                        <p className="text-green-700 text-sm mt-1">
                                            You're saving ${savings.toFixed(2)} ({discountPercentage}% off) on this book!
                                        </p>
                                    </div>
                                )}

                                {/* Additional Info */}
                                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                                        <span>🚚</span>
                                        <span>Free shipping on orders over $50</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                                        <span>↩️</span>
                                        <span>30-day return policy</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                                        <span>🔒</span>
                                        <span>Secure checkout</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <FiBook className="mr-2 text-blue-500" />
                            Book Details
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center space-x-3">
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                <span>ISBN: {book.isbn || 'Not specified'}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                <span>Condition: {book.condition || 'New'}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                <span>Language: {book.language || 'English'}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            🚚 Shipping Info
                        </h3>
                        <div className="space-y-3 text-gray-600">
                            <div className="flex justify-between">
                                <span>Delivery</span>
                                <span className="font-semibold">2-5 business days</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="font-semibold text-green-600">Free over $50</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Returns</span>
                                <span className="font-semibold">30 days</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            ❓ Need Help?
                        </h3>
                        <p className="text-gray-600 mb-4">Our support team is here to help you with any questions.</p>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors duration-200">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleBook;