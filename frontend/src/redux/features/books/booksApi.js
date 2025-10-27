import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL'

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/books`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
})

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery,
  tagTypes: ['Books', 'Book', 'Trending', 'Recommended'],
  endpoints: (builder) => ({
    fetchAllBooks: builder.query({
      query: (params = {}) => {
        const { page, limit, category, search, trending, recommended, minPrice, maxPrice, sortBy, sortOrder } = params;
        const queryParams = new URLSearchParams();
        
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);
        if (category) queryParams.append('category', category);
        if (search) queryParams.append('search', search);
        if (trending !== undefined) queryParams.append('trending', trending);
        if (recommended !== undefined) queryParams.append('recommended', recommended);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (sortOrder) queryParams.append('sortOrder', sortOrder);
        
        const queryString = queryParams.toString();
        return queryString ? `/?${queryString}` : '/';
      },
      providesTags: ['Books'],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),
    
    fetchBookById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Book', id }],
    }),
    
    fetchTrendingBooks: builder.query({
      query: () => '/trending',
      providesTags: ['Trending'],
    }),
    
    fetchRecommendedBooks: builder.query({
      query: () => '/recommended',
      providesTags: ['Recommended'],
    }),
    
    searchBooks: builder.query({
      query: (searchParams) => {
        const { q, category, author, minPrice, maxPrice } = searchParams || {};
        const queryParams = new URLSearchParams();
        
        if (q) queryParams.append('q', q);
        if (category) queryParams.append('category', category);
        if (author) queryParams.append('author', author);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        
        const queryString = queryParams.toString();
        return `/search?${queryString}`;
      },
      providesTags: (result, error, searchParams) => [
        { type: 'Books', id: 'SEARCH' }
      ],
    }),
    
    fetchBooksBySeller: builder.query({
      query: (sellerId) => `/seller/${sellerId}`,
      providesTags: (result, error, sellerId) => [
        { type: 'Books', id: `SELLER-${sellerId}` }
      ],
    }),
    
    addBook: builder.mutation({
      query: (newBook) => ({
        url: '/create-book',
        method: 'POST',
        body: newBook,
      }),
      invalidatesTags: ['Books', 'Trending', 'Recommended'],
    }),
    
    updateBook: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/edit/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Books', 
        { type: 'Book', id },
        'Trending',
        'Recommended'
      ],
    }),
    
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Books', 'Trending', 'Recommended'],
    }),
  })
})

export const {
  useFetchAllBooksQuery,
  useFetchBookByIdQuery,
  useFetchTrendingBooksQuery,
  useFetchRecommendedBooksQuery,
  useSearchBooksQuery,
  useFetchBooksBySellerQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useLazyFetchAllBooksQuery,
  useLazySearchBooksQuery,
} = booksApi;

export default booksApi;