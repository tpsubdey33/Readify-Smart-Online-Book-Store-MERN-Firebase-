import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('bookstore_cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Ensure each item has required fields and calculate totals
      return parsedCart.map(item => ({
        ...item,
        quantity: item.quantity || 1,
        totalPrice: (item.quantity || 1) * (item.newPrice || item.price || 0)
      }));
    }
  } catch (error) {
    console.error('Error loading cart from storage:', error);
  }
  return [];
};

// Save cart to localStorage
const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('bookstore_cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

// Calculate totals from cart items
const calculateTotals = (cartItems) => {
  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const totalAmount = cartItems.reduce((total, item) => {
    const price = item.newPrice || item.price || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0);
  
  return { totalItems, totalAmount };
};

const initialState = {
  cartItems: loadCartFromStorage(),
  ...calculateTotals(loadCartFromStorage())
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      
      // Validate required fields
      if (!product?._id || !product?.title) {
        console.error("Invalid product data:", product);
        return;
      }

      const existingItem = state.cartItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Check stock availability
        const currentStock = product.stock || existingItem.stock || 999;
        if (existingItem.quantity >= currentStock) {
          console.warn(`Stock limit reached for ${product.title}`);
          return;
        }
        
        // Increase quantity
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.quantity * (existingItem.newPrice || existingItem.price);
      } else {
        // Add new item to cart
        const newItem = {
          ...product,
          quantity: 1,
          totalPrice: product.newPrice || product.price || 0,
          addedAt: new Date().toISOString()
        };
        state.cartItems.push(newItem);
      }
      
      // Update totals and save to storage
      const totals = calculateTotals(state.cartItems);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      saveCartToStorage(state.cartItems);
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.cartItems.findIndex(item => item._id === productId);
      
      if (itemIndex !== -1) {
        state.cartItems.splice(itemIndex, 1);
        
        // Update totals
        const totals = calculateTotals(state.cartItems);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        saveCartToStorage(state.cartItems);
      }
    },
    
    updateQuantity: (state, action) => {
      const { itemId, newQuantity } = action.payload;
      
      if (newQuantity < 1) {
        console.warn("Quantity must be at least 1");
        return;
      }
      
      const item = state.cartItems.find(item => item._id === itemId);
      
      if (item) {
        // Check stock limit
        const currentStock = item.stock || 999;
        if (newQuantity > currentStock) {
          console.warn(`Only ${currentStock} copies available`);
          return;
        }
        
        item.quantity = newQuantity;
        item.totalPrice = item.quantity * (item.newPrice || item.price);
        
        // Update totals
        const totals = calculateTotals(state.cartItems);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        saveCartToStorage(state.cartItems);
      }
    },
    
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      localStorage.removeItem('bookstore_cart');
    },
    
    // Force clear cart without confirmation (useful for after checkout)
    forceClearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      localStorage.removeItem('bookstore_cart');
    },
    
    // Load cart from storage manually (renamed to avoid conflict)
    reloadCartFromStorage: (state) => {
      const savedCart = loadCartFromStorage();
      state.cartItems = savedCart;
      const totals = calculateTotals(savedCart);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    
    // Update item stock information
    updateItemStock: (state, action) => {
      const { itemId, newStock } = action.payload;
      const item = state.cartItems.find(item => item._id === itemId);
      
      if (item) {
        item.stock = newStock;
        
        // If current quantity exceeds new stock, adjust quantity
        if (item.quantity > newStock) {
          item.quantity = newStock;
          item.totalPrice = item.quantity * (item.newPrice || item.price);
          
          // Update totals
          const totals = calculateTotals(state.cartItems);
          state.totalItems = totals.totalItems;
          state.totalAmount = totals.totalAmount;
        }
        
        saveCartToStorage(state.cartItems);
      }
    }
  }
});

// Export the actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  forceClearCart,
  reloadCartFromStorage,
  updateItemStock
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;
export const selectTotalAmount = (state) => state.cart.totalAmount;
export const selectTotalItems = (state) => state.cart.totalItems;
export const selectCartLoading = (state) => state.cart.isLoading;

// Selector for specific item quantity
export const selectItemQuantity = (itemId) => (state) => 
  state.cart.cartItems.find(item => item._id === itemId)?.quantity || 0;

// Selector for cart item by ID
export const selectCartItemById = (itemId) => (state) =>
  state.cart.cartItems.find(item => item._id === itemId);

// Selector for cart items with detailed info
export const selectCartDetails = (state) => ({
  items: state.cart.cartItems,
  totalItems: state.cart.totalItems,
  totalAmount: state.cart.totalAmount,
  isEmpty: state.cart.cartItems.length === 0,
  itemCount: state.cart.cartItems.length
});

// Selector for cart summary
export const selectCartSummary = (state) => {
  const { totalAmount, totalItems, cartItems } = state.cart;
  const shippingFee = totalAmount > 0 ? 5.99 : 0;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + shippingFee + tax;
  
  // Calculate total savings
  const totalSavings = cartItems.reduce((savings, item) => {
    if (item.oldPrice && item.oldPrice > (item.newPrice || item.price)) {
      return savings + ((item.oldPrice - (item.newPrice || item.price)) * item.quantity);
    }
    return savings;
  }, 0);

  return {
    subtotal: totalAmount,
    shipping: shippingFee,
    tax: parseFloat(tax.toFixed(2)),
    finalTotal: parseFloat(finalTotal.toFixed(2)),
    totalSavings: parseFloat(totalSavings.toFixed(2)),
    totalItems
  };
};

export default cartSlice.reducer;