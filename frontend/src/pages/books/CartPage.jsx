import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  clearCart, 
  removeFromCart, 
  updateQuantity,
  selectCartDetails,
  selectCartSummary 
} from '../../redux/features/cart/cartSlice'

const CartPage = () => {
    const dispatch = useDispatch()
    const { items: cartItems, totalItems, totalAmount } = useSelector(selectCartDetails)
    const cartSummary = useSelector(selectCartSummary)

    const handleRemoveFromCart = (productId) => {
        dispatch(removeFromCart(productId))
    }

    const handleClearCart = () => {
        dispatch(clearCart())
    }

    const handleQuantityChange = (productId, newQuantity) => {
        dispatch(updateQuantity({ itemId: productId, newQuantity }))
    }

    const handleIncreaseQuantity = (productId) => {
        const product = cartItems.find(item => item._id === productId)
        if (product) handleQuantityChange(productId, product.quantity + 1)
    }

    const handleDecreaseQuantity = (productId) => {
        const product = cartItems.find(item => item._id === productId)
        if (product && product.quantity > 1) handleQuantityChange(productId, product.quantity - 1)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <p className="text-gray-600 mt-2">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                    
                    {cartItems.length > 0 && (
                        <button
                            onClick={handleClearCart}
                            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Clear Cart
                        </button>
                    )}
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Cart Items Section */}
                    {cartItems.length > 0 ? (
                        <>
                            <div className="lg:col-span-8">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <ul className="divide-y divide-gray-200">
                                        {cartItems.map(product => (
                                            <li key={product?._id} className="p-6 hover:bg-gray-50 transition duration-200">
                                                <div className="flex flex-col sm:flex-row sm:items-center">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0 w-full sm:w-32 h-40 sm:h-32 mb-4 sm:mb-0">
                                                        <img
                                                            alt={product?.title}
                                                            src={product?.coverImage}
                                                            className="w-full h-full object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/200x300/f3f4f6/6b7280?text=No+Image'
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="sm:ml-6 flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between">
                                                            <div className="flex-1">
                                                                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition duration-200">
                                                                    <Link to={`/books/${product?._id}`}>
                                                                        {product?.title}
                                                                    </Link>
                                                                </h3>
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    by {product?.author || 'Unknown Author'}
                                                                </p>
                                                                <p className="mt-1 text-sm text-gray-500 capitalize">
                                                                    Category: {product?.category}
                                                                </p>
                                                                <div className="mt-2 flex items-center">
                                                                    <span className="text-2xl font-bold text-gray-900">
                                                                        ${(product.totalPrice || 0).toFixed(2)}
                                                                    </span>
                                                                    {product.oldPrice && product.oldPrice > (product.newPrice || product.price) && (
                                                                        <span className="ml-2 text-sm text-gray-500 line-through">
                                                                            ${(product.oldPrice * product.quantity).toFixed(2)}
                                                                        </span>
                                                                    )}
                                                                    <span className="ml-3 text-sm text-gray-600">
                                                                        (${(product.newPrice || product.price).toFixed(2)} × {product.quantity})
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Remove Button */}
                                                            <div className="mt-4 sm:mt-0 sm:ml-4">
                                                                <button
                                                                    onClick={() => handleRemoveFromCart(product._id)}
                                                                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200 border border-red-200"
                                                                >
                                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Quantity Controls */}
                                                        <div className="mt-4 flex items-center justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                                                                    <button
                                                                        onClick={() => handleDecreaseQuantity(product._id)}
                                                                        disabled={product.quantity <= 1}
                                                                        className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        <span className="text-lg font-semibold">-</span>
                                                                    </button>
                                                                    <span className="w-12 text-center font-semibold text-gray-900">
                                                                        {product.quantity}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleIncreaseQuantity(product._id)}
                                                                        disabled={product.quantity >= (product.stock || 999)}
                                                                        className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        <span className="text-lg font-semibold">+</span>
                                                                    </button>
                                                                </div>

                                                                {product.stock > 0 ? (
                                                                    <span className="flex items-center text-sm text-green-600">
                                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        {product.stock} in stock
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center text-sm text-red-600">
                                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                        </svg>
                                                                        Out of stock
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Item Total */}
                                                            <div className="text-right">
                                                                <p className="text-sm text-gray-600">Item Total</p>
                                                                <p className="text-lg font-semibold text-gray-900">
                                                                    ${(product.totalPrice || 0).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {product.oldPrice && product.oldPrice > (product.newPrice || product.price) && (
                                                            <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2">
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-green-800">You save:</span>
                                                                    <span className="font-semibold text-green-800">
                                                                        ${((product.oldPrice - (product.newPrice || product.price)) * product.quantity).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-4 mt-8 lg:mt-0">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal ({cartSummary.totalItems} items)</span>
                                            <span>${cartSummary.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>${cartSummary.shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tax (8%)</span>
                                            <span>${cartSummary.tax.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between text-lg font-semibold text-gray-900">
                                                <span>Total</span>
                                                <span>${cartSummary.finalTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {cartSummary.totalSavings > 0 && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                            <div className="flex items-center justify-between text-green-800">
                                                <span className="font-semibold">Total Savings:</span>
                                                <span className="font-bold">${cartSummary.totalSavings.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}

                                    <Link
                                        to="/checkout"
                                        className="w-full flex items-center justify-center px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-sm transition duration-200 mb-4"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Proceed to Checkout
                                    </Link>

                                    <Link
                                        to="/books"
                                        className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Empty Cart - Full Width Center */
                        <div className="lg:col-span-12 flex items-center justify-center min-h-[60vh] px-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center max-w-md w-full">
                                <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h3>
                                <p className="text-gray-600 mb-8">
                                    Looks like you haven't added any items to your cart yet.
                                </p>
                                <Link
                                    to="/books"
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    Browse Books
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CartPage
