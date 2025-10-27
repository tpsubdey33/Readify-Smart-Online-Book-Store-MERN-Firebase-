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
    getFavorites: builder.query({
      query: () => "/",
      providesTags: ['Favorites'],
    }),
    
    addToFavorites: builder.mutation({
      query: (bookId) => ({
        url: `/${bookId}`,
        method: "POST",
      }),
      invalidatesTags: ['Favorites'],
    }),
    
    removeFromFavorites: builder.mutation({
      query: (bookId) => ({
        url: `/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Favorites'],
    }),
    
    checkIsFavorited: builder.query({
      query: (bookId) => `/check/${bookId}`,
      providesTags: (result, error, bookId) => [
        { type: 'Favorites', id: bookId }
      ],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useCheckIsFavoritedQuery,
} = favoritesApi;

export default favoritesApi;