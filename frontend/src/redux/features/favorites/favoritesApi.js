import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/favorites`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
  baseQuery,
  tagTypes: ['Favorites'],
  endpoints: (builder) => ({
    // Get user's favorites
    getFavorites: builder.query({
      query: () => "/",
      providesTags: ['Favorites'],
    }),
    
    // Get user's favorite books with details
    getFavoriteBooks: builder.query({
      query: ({ page = 1, limit = 12 } = {}) => ({
        url: "/books",
        params: { page, limit },
      }),
      providesTags: ['Favorites'],
    }),
    
    // Add book to favorites
    addToFavorites: builder.mutation({
      query: (bookId) => ({
        url: `/${bookId}`,
        method: "POST",
      }),
      invalidatesTags: ['Favorites'],
    }),
    
    // Remove book from favorites
    removeFromFavorites: builder.mutation({
      query: (bookId) => ({
        url: `/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Favorites'],
    }),
    
    // Check if book is favorited
    checkIsFavorited: builder.query({
      query: (bookId) => `/check/${bookId}`,
      providesTags: (result, error, bookId) => [
        { type: 'Favorites', id: bookId }
      ],
    }),

    // Get favorite count for a book
    getBookFavoriteCount: builder.query({
      query: (bookId) => `/count/${bookId}`,
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useGetFavoriteBooksQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useCheckIsFavoritedQuery,
  useGetBookFavoriteCountQuery,
} = favoritesApi;

export default favoritesApi;