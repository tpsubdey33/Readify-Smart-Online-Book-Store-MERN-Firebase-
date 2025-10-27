import React, { useState } from 'react'
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi'
import { FaHeart, FaStar, FaRegStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'
import Swal from 'sweetalert2'

const BookCard = ({ book }) => {
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (product) => {
    // Check stock before adding to cart
    if (product.stock === 0) {
      Swal.fire({
        title: 'Out of Stock',
        text: 'This book is currently out of stock.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    dispatch(addToCart(product));
    Swal.fire({
      title: 'Added to Cart!',
      text: `${product.title} has been added to your cart.`,
      icon: 'success',
      confirmButtonColor: '#10B981',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    // Here you would typically call an API to update favorites
    Swal.fire({
      title: isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
      text: isFavorite 
        ? 'Book removed from your favorites.' 
        : 'Book added to your favorites!',
      icon: 'success',
      confirmButtonColor: '#10B981',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Calculate discount percentage
  const discountPercentage = book.oldPrice > book.newPrice 
    ? Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)
    : 0;

  // Render star rating
  const renderRating = () => {
    const rating = book.rating?.average || 0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 text-sm" />
        ) : (
          <FaRegStar key={i} className="text-gray-300 text-sm" />
        )
      );
    }
    
    return (
      <div className="flex items-center space-x-1">
        {stars}
        <span className="text-sm text-gray-600 ml-1">
          ({book.rating?.count || 0})
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <Link to={`/books/${book._id}`}>
          <div className="aspect-[3/4] bg-gray-100 relative">
            {!imageError ? (
              <img
                src={book.coverImage}
                alt={book.title}
                onError={handleImageError}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">📚</div>
                  <p className="text-sm">No Image</p>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {book.trending && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              🔥 Trending
            </span>
          )}
          {book.recommended && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              ⭐ Recommended
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="absolute top-3 right-3">
          {book.stock === 0 ? (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              Out of Stock
            </span>
          ) : book.stock < 10 ? (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              Low Stock
            </span>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={toggleFavorite}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
          >
            {isFavorite ? (
              <FaHeart className="text-red-500 text-lg" />
            ) : (
              <FiHeart className="text-gray-600 text-lg" />
            )}
          </button>
          <Link
            to={`/books/${book._id}`}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
          >
            <FiEye className="text-gray-600 text-lg" />
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category */}
        <div className="mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {book.category}
          </span>
          {book.subcategory && (
            <span className="text-xs text-gray-500 ml-1">• {book.subcategory}</span>
          )}
        </div>

        {/* Title */}
        <Link to={`/books/${book._id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200 leading-tight">
            {book.title}
          </h3>
        </Link>

        {/* Author */}
        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

        {/* Rating */}
        {book.rating && renderRating()}

        {/* Description */}
        <p className="text-gray-600 text-sm mt-2 mb-4 line-clamp-2 flex-1">
          {book.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${book.newPrice}
            </span>
            {book.oldPrice > book.newPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${book.oldPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => handleAddToCart(book)}
            disabled={book.stock === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              book.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
            }`}
          >
            <FiShoppingCart className="text-lg" />
            <span>{book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span>Condition: {book.condition}</span>
          {book.pages && <span>{book.pages} pages</span>}
        </div>
      </div>
    </div>
  );
};

export default BookCard;