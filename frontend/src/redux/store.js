import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import booksApi from './features/books/booksApi'
import ordersApi from './features/orders/ordersApi'
import { favoritesApi } from './features/favorites/favoritesApi' // Import favoritesApi

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer, // Add favoritesApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware, 
      ordersApi.middleware,
      favoritesApi.middleware // Add favoritesApi middleware
    ),
})