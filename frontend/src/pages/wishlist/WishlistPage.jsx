import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  HiOutlineHeart, 
  HiOutlineShoppingCart, 
  HiOutlineTrash, 
  HiOutlineArrowLeft,
  HiOutlineEye 
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { 
  useGetFavoriteBooksQuery, 
  useRemoveFromFavoritesMutation 
} from '../../redux/features/favorites/favoritesApi';
import { addToCart } from '../../redux/features/cart/cartSlice'; // Import addToCart
import Swal from 'sweetalert2'; // Import Swal for alerts
import Loading from '../../components/Loading';

const WishlistPage = () => {
  const { backendUser } = useAuth();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 12;
  
  // RTK Query hooks
  const { 
    data: favoritesData, 
    isLoading, 
    error, 
    refetch 
  } = useGetFavoriteBooksQuery(
    { page, limit },
    { skip: !backendUser }
  );
  
  const [removeFromFavorites, { isLoading: isRemoving }] = useRemoveFromFavoritesMutation();
  
  const cartItems = useSelector(state => state.cart.cartItems);

  // Check if book is in cart
  const isBookInCart = (bookId) => {
    return cartItems.some(item => item._id === bookId);
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await removeFromFavorites(bookId).unwrap();
      // If we're on page 1, refetch to update the list
      // If we remove the last item on a page, go to previous page
      if (favoritesData?.books?.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refetch();
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to remove from wishlist',
        icon: 'error',
        confirmButtonColor: '#EF4444',
      });
    }
  };

  // Handle add to cart from wishlist
  const handleAddToCart = (book) => {
    // Check stock before adding to cart
    if (book.stock === 0) {
      Swal.fire({
        title: 'Out of Stock',
        text: 'This book is currently out of stock.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    dispatch(addToCart(book));
    Swal.fire({
      title: 'Added to Cart!',
      text: `${book.title} has been added to your cart.`,
      icon: 'success',
      confirmButtonColor: '#10B981',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <HiOutlineHeart className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading wishlist</h3>
            <p className="mt-2 text-sm text-gray-500">
              {error?.data?.message || 'Failed to load your wishlist. Please try again.'}
            </p>
            <button
              onClick={refetch}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const favoriteBooks = favoritesData?.books || [];
  const totalPages = favoritesData?.totalPages || 0;
  const totalItems = favoritesData?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/books"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
          >
            <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-rose-50 rounded-lg">
                <HiOutlineHeart className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="mt-1 text-sm text-gray-600">
                  {totalItems > 0 
                    ? `${totalItems} item${totalItems > 1 ? 's' : ''} in your wishlist`
                    : 'Your wishlist is empty'
                  }
                </p>
              </div>
            </div>
            
            {favoriteBooks.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        {favoriteBooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <HiOutlineHeart className="mx-auto h-24 w-24 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No favorite books yet</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Books you add to your wishlist will appear here. Start exploring our collection!
            </p>
            <Link
              to="/books"
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Discover Books
            </Link>
          </div>
        ) : (
          <>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {favoriteBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group"
                >
                  {/* Book Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col space-y-2">
                      <button
                        onClick={() => handleRemoveFromWishlist(book._id)}
                        disabled={isRemoving}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                      
                      <Link
                        to={`/books/${book._id}`}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="View book details"
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* Favorite Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        <HiOutlineHeart className="h-3 w-3 mr-1" />
                        In Wishlist
                      </span>
                    </div>

                    {/* Stock Status */}
                    <div className="absolute bottom-2 left-2">
                      {book.stock > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="p-4">
                    <Link
                      to={`/books/${book._id}`}
                      className="block group"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2 leading-tight">
                        {book.title}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1">by {book.author}</p>
                    
                    {/* Rating */}
                    {book.rating && (
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-yellow-400">
                              {i < Math.floor(book.rating.average) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">
                          ({book.rating.count})
                        </span>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${book.newPrice || book.price}
                        </span>
                        {book.oldPrice && book.oldPrice > (book.newPrice || book.price) && (
                          <span className="text-sm text-gray-500 line-through">
                            ${book.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {isBookInCart(book._id) ? (
                        <Link
                          to="/cart"
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <HiOutlineShoppingCart className="h-4 w-4 mr-2" />
                          In Cart
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(book)}
                          disabled={book.stock === 0}
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <HiOutlineShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;