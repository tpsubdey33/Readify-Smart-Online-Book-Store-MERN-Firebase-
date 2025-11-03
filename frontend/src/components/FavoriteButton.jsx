import React from 'react';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { 
  useCheckIsFavoritedQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation 
} from '../redux/features/favorites/favoritesApi';

const FavoriteButton = ({ bookId, size = 'md', className = '', showAlert = true }) => {
  const { backendUser } = useAuth();
  
  // RTK Query hooks
  const { 
    data: favoriteData, 
    isLoading: isChecking,
    refetch: refetchCheck 
  } = useCheckIsFavoritedQuery(bookId, {
    skip: !backendUser || !bookId,
  });
  
  const [addToFavorites, { isLoading: isAdding }] = useAddToFavoritesMutation();
  const [removeFromFavorites, { isLoading: isRemoving }] = useRemoveFromFavoritesMutation();

  const isFavorited = favoriteData?.isFavorited || false;
  const isLoading = isChecking || isAdding || isRemoving;

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!backendUser) {
      if (showAlert) {
        Swal.fire({
          title: 'Login Required',
          text: 'Please login to add books to your wishlist',
          icon: 'warning',
          confirmButtonText: 'Login',
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/login';
          }
        });
      }
      return;
    }

    if (!bookId) {
      console.error('Book ID is required');
      return;
    }

    try {
      if (isFavorited) {
        await removeFromFavorites(bookId).unwrap();
        if (showAlert) {
          Swal.fire({
            title: 'Removed from Wishlist!',
            text: 'Book removed from your wishlist',
            icon: 'success',
            confirmButtonColor: '#10B981',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } else {
        await addToFavorites(bookId).unwrap();
        if (showAlert) {
          Swal.fire({
            title: 'Added to Wishlist!',
            text: 'Book added to your wishlist!',
            icon: 'success',
            confirmButtonColor: '#10B981',
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
      
      // Refetch the check query to update the state
      refetchCheck();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (showAlert) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to update wishlist',
          icon: 'error',
          confirmButtonColor: '#EF4444',
        });
      }
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  const buttonClasses = `
    p-2 rounded-full transition-all duration-200 transform hover:scale-110
    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${isFavorited
      ? 'text-rose-500 hover:text-rose-600 bg-rose-50'
      : 'text-gray-600 hover:text-rose-500 bg-white'
    }
    ${className}
  `;

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading || !backendUser}
      className={buttonClasses.trim()}
      title={backendUser ? (isFavorited ? 'Remove from wishlist' : 'Add to wishlist') : 'Login to add to wishlist'}
    >
      {isFavorited ? (
        <HiHeart className={sizeClasses[size]} />
      ) : (
        <HiOutlineHeart className={sizeClasses[size]} />
      )}
    </button>
  );
};

export default FavoriteButton;