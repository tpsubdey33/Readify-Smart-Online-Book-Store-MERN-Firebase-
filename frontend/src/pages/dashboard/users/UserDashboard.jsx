import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery } from '../../../redux/features/orders/ordersApi';
import { useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Enhanced BookCard with better image handling
const BookCard = ({ book, onNext, onPrev, showNavigation = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  // FIX: Better image source handling with fallbacks
  const getImageSources = () => {
    if (!book) return ['/api/placeholder/200/300'];
    
    // Handle different image data structures
    if (book.images && Array.isArray(book.images) && book.images.length > 0) {
      return book.images;
    }
    if (book.coverImage) {
      return [book.coverImage];
    }
    if (book.image) {
      return [book.image];
    }
    // Fallback placeholder
    return ['/api/placeholder/200/300'];
  };

  const images = getImageSources();
  const currentImage = images[currentImageIndex];

  // FIX: Better image URL handling
  const getImageUrl = (imgSrc) => {
    if (!imgSrc) return '/api/placeholder/200/300';
    
    // If it's already a full URL, return as is
    if (imgSrc.startsWith('http')) return imgSrc;
    
    // If it's a relative path, construct full URL
    if (imgSrc.startsWith('/')) {
      return `${window.location.origin}${imgSrc}`;
    }
    
    // For other cases, try to use as is
    return imgSrc;
  };

  // FIX: Safely extract rating value
  const getRatingValue = (rating) => {
    if (typeof rating === 'number') return rating.toFixed(1);
    if (typeof rating === 'object' && rating !== null) {
      return rating.average ? rating.average.toFixed(1) : '4.5';
    }
    return '4.5';
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setImageError(false);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group relative">
      <div className="relative overflow-hidden">
        <img 
          src={imageError ? '/api/placeholder/200/300' : getImageUrl(currentImage)}
          alt={book?.title || 'Book cover'}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Image Navigation Dots */}
        {images.length > 1 && !imageError && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                  setImageError(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Image Navigation Arrows */}
        {images.length > 1 && !imageError && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Book Navigation Arrows */}
        {showNavigation && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev?.();
              }}
              className="absolute left-2 top-2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-2 group-hover:translate-x-0"
              title="Previous Book"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext?.();
              }}
              className="absolute right-2 top-2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0"
              title="Next Book"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
          ${book?.price || '0.00'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{book?.title || 'Unknown Book'}</h3>
        <p className="text-gray-600 text-sm mb-2">{book?.author || 'Unknown Author'}</p>
        <div className="flex items-center justify-between">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize">
            {book?.category || 'Uncategorized'}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm text-gray-600 ml-1">
              {getRatingValue(book?.rating)}
            </span>
          </div>
        </div>
        
        {/* Additional Book Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Pages: {book?.pages || 'N/A'}</span>
            <span>Year: {book?.publishedYear || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard Component with object value protection
const StatCard = ({ title, value, icon, color }) => {
  // FIX: Safely render value to prevent object rendering
  const renderValue = (val) => {
    if (val === null || val === undefined) return '0';
    if (typeof val === 'object') {
      // Handle common object structures
      if (val.average !== undefined) return val.average;
      if (val.count !== undefined) return val.count;
      if (val.total !== undefined) return val.total;
      return JSON.stringify(val); // Fallback for other objects
    }
    return val;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {renderValue(value)}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color} transition-transform duration-300 hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { data: ordersResponse, isLoading: ordersLoading, isError: ordersError } = useGetOrderByEmailQuery(currentUser?.email);
  const { data: booksResponse, isLoading: booksLoading } = useFetchAllBooksQuery();
  
  // FIX: Safely extract data from responses
  const orders = Array.isArray(ordersResponse) ? ordersResponse : ordersResponse?.data || ordersResponse?.orders || [];
  const books = Array.isArray(booksResponse) ? booksResponse : booksResponse?.data || booksResponse?.books || [];
  
  const [recentBooks, setRecentBooks] = useState([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const swiperRef = useRef(null);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteCategory: 'None'
  });

  // FIX: Debug log to check book data structure
  useEffect(() => {
    console.log('Books data:', booksResponse);
    console.log('First book:', books[0]);
  }, [booksResponse, books]);

  useEffect(() => {
    if (books && books.length > 0) {
      const sortedBooks = [...books]
        .sort((a, b) => new Date(b.createdAt || b.publishedDate || 0) - new Date(a.createdAt || a.publishedDate || 0))
        .slice(0, 6);
      setRecentBooks(sortedBooks);
    }
  }, [books]);

  useEffect(() => {
    if (orders && orders.length > 0 && books) {
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      
      const categoryCount = {};
      orders.forEach(order => {
        // FIX: Handle different order structures
        const products = order.products || order.productIds || [];
        products.forEach(product => {
          const productId = product._id || product;
          const book = books.find(b => b._id === productId);
          if (book?.category) {
            categoryCount[book.category] = (categoryCount[book.category] || 0) + 1;
          }
        });
      });
      
      const favoriteCategory = Object.keys(categoryCount).length > 0 
        ? Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b)
        : 'None';

      setStats({
        totalOrders,
        totalSpent: totalSpent.toFixed(2),
        favoriteCategory: favoriteCategory.charAt(0).toUpperCase() + favoriteCategory.slice(1)
      });
    } else {
      // Set default stats when no orders
      setStats({
        totalOrders: 0,
        totalSpent: '0.00',
        favoriteCategory: 'None'
      });
    }
  }, [orders, books]);

  // Navigation functions for books
  const handleNextBook = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrevBook = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  if (ordersLoading || booksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your reading dashboard...</p>
        </div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">We couldn't load your dashboard data</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name || currentUser?.displayName || 'Reader'}! 📚
          </h1>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your reading journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="📦"
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Total Spent"
            value={`$${stats.totalSpent}`}
            icon="💰"
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="Favorite Genre"
            value={stats.favoriteCategory}
            icon="❤️"
            color="bg-red-100 text-red-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Recent Books Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">New Arrivals</h2>
              <div className="flex items-center space-x-4">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {recentBooks.length} books
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevBook}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    title="Previous Book"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextBook}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    title="Next Book"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {recentBooks.length > 0 ? (
              <Swiper
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={20}
                navigation={false}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 1 },
                  1280: { slidesPerView: 2 }
                }}
                modules={[Navigation]}
                className="recent-books-swiper"
              >
                {recentBooks.map((book, index) => (
                  <SwiperSlide key={book._id || index}>
                    <BookCard 
                      book={book} 
                      onNext={handleNextBook}
                      onPrev={handlePrevBook}
                      showNavigation={true}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Books Available</h3>
                <p className="text-gray-500">Check back later for new arrivals!</p>
              </div>
            )}
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                {orders.length} orders
              </span>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {orders.slice(0, 5).map((order) => {
                  // FIX: Handle different order structures
                  const products = order.products || order.productIds || [];
                  return (
                    <div key={order._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">Order #{order._id?.slice(-8) || order.orderNumber || 'N/A'}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order?.createdAt || order?.orderDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ${order.totalPrice || order.amount || '0.00'}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">Books purchased:</p>
                        <div className="flex flex-wrap gap-1">
                          {products.slice(0, 3).map((product, idx) => {
                            const productId = product._id || product;
                            const book = books.find(b => b._id === productId);
                            return (
                              <span 
                                key={productId || idx} 
                                className="bg-white px-2 py-1 rounded text-xs border text-gray-600"
                              >
                                {book?.title || `Book ${idx + 1}`}
                              </span>
                            );
                          })}
                          {products.length > 3 && (
                            <span className="bg-white px-2 py-1 rounded text-xs border text-gray-500">
                              +{products.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
                <p className="text-gray-500">Start your reading journey with your first purchase!</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Reading Progress Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Continue Reading</h2>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Track Your Progress</h3>
            <p className="text-gray-500 mb-4">Start reading to see your progress here</p>
            <button 
              onClick={() => window.location.href = '/books'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 transform hover:scale-105"
            >
              Browse Books
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .recent-books-swiper {
          padding: 10px 5px 30px 5px;
        }
        
        .recent-books-swiper .swiper-slide {
          height: auto;
        }
        
        /* Custom scrollbar for orders */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;