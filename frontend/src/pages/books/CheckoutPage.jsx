import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form"
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import { forceClearCart } from '../../redux/features/cart/cartSlice'; // Import forceClearCart

const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.newPrice || item.price) * (item.quantity || 1), 0).toFixed(2);
    const { currentUser } = useAuth();
    const dispatch = useDispatch();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const [createOrder, {isLoading, error}] = useCreateOrderMutation();
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);

    const onSubmit = async (data) => {
        // Check if cart is empty
        if (cartItems.length === 0) {
            Swal.fire({
                title: "Empty Cart!",
                text: "Your cart is empty. Please add items before checkout.",
                icon: "warning",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        const newOrder = {
            name: data.name,
            email: currentUser?.email,
            address: {
                city: data.city,
                country: data.country,
                state: data.state,
                zipcode: data.zipcode
            },
            phone: data.phone,
            products: cartItems.map(item => ({
                productId: item._id,
                title: item.title,
                quantity: item.quantity,
                price: item.newPrice || item.price
            })),
            totalPrice: totalPrice,
            orderDate: new Date().toISOString()
        }
        
        try {
            await createOrder(newOrder).unwrap();
            
            // Clear the cart after successful order using forceClearCart
            dispatch(forceClearCart());
            
            Swal.fire({
                title: "Order Confirmed!",
                text: "Your order has been placed successfully!",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "View Orders"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/orders");
                }
            });
            
        } catch (error) {
            console.error("Error placing order", error);
            Swal.fire({
                title: "Order Failed!",
                text: error?.data?.message || "Failed to place order. Please try again.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Processing your order...</p>
                </div>
            </div>
        );
    }

    return (
        <section>
            <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                <div className="container max-w-screen-lg mx-auto">
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="font-semibold text-2xl text-gray-600 mb-2">Checkout</h2>
                            <p className="text-gray-500 mb-2">Total Price: ${totalPrice}</p>
                            <p className="text-gray-500 mb-2">Items: {cartItems.length > 0 ? cartItems.length : 0}</p>
                            <p className="text-gray-500">Total Quantity: {cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}</p>
                            
                            {/* Show message if cart is empty */}
                            {cartItems.length === 0 && (
                                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 mt-4">
                                    Your cart is empty. <Link to="/products" className="text-blue-600 underline font-medium">Continue shopping</Link>
                                </div>
                            )}
                        </div>

                        {/* Only show form if cart has items */}
                        {cartItems.length > 0 ? (
                            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8">
                                    <div className="text-gray-600">
                                        <p className="font-medium text-lg">Personal Details</p>
                                        <p>Please fill out all the fields.</p>
                                    </div>

                                    <div className="lg:col-span-2">
                                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                            <div className="md:col-span-5">
                                                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Full Name *
                                                </label>
                                                <input
                                                    {...register("name", { 
                                                        required: "Full name is required",
                                                        minLength: {
                                                            value: 2,
                                                            message: "Name must be at least 2 characters"
                                                        }
                                                    })}
                                                    type="text" 
                                                    name="name" 
                                                    id="name" 
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                    placeholder="Enter your full name"
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-5">
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="text" 
                                                    name="email" 
                                                    id="email" 
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-100 cursor-not-allowed"
                                                    disabled
                                                    defaultValue={currentUser?.email}
                                                    placeholder="email@domain.com" 
                                                />
                                            </div>

                                            <div className="md:col-span-5">
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    {...register("phone", { 
                                                        required: "Phone number is required",
                                                        pattern: {
                                                            value: /^[+]?[0-9\s\-()]{10,}$/,
                                                            message: "Please enter a valid phone number"
                                                        }
                                                    })}
                                                    type="tel" 
                                                    name="phone" 
                                                    id="phone" 
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                    placeholder="+123 456 7890" 
                                                />
                                                {errors.phone && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-3">
                                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Address / Street *
                                                </label>
                                                <input
                                                    {...register("address", { 
                                                        required: "Address is required",
                                                        minLength: {
                                                            value: 5,
                                                            message: "Address must be at least 5 characters"
                                                        }
                                                    })}
                                                    type="text" 
                                                    name="address" 
                                                    id="address" 
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                    placeholder="Enter your street address" 
                                                />
                                                {errors.address && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                                    City *
                                                </label>
                                                <input
                                                    {...register("city", { 
                                                        required: "City is required"
                                                    })}
                                                    type="text" 
                                                    name="city" 
                                                    id="city" 
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                    placeholder="Enter your city" 
                                                />
                                                {errors.city && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Country / Region *
                                                </label>
                                                <input
                                                    {...register("country", { 
                                                        required: "Country is required"
                                                    })}
                                                    name="country" 
                                                    id="country" 
                                                    placeholder="Country" 
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                />
                                                {errors.country && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                                    State / Province *
                                                </label>
                                                <input
                                                    {...register("state", { 
                                                        required: "State/Province is required"
                                                    })}
                                                    name="state" 
                                                    id="state" 
                                                    placeholder="State" 
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                />
                                                {errors.state && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-1">
                                                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Zipcode *
                                                </label>
                                                <input
                                                    {...register("zipcode", { 
                                                        required: "Zipcode is required",
                                                        pattern: {
                                                            value: /^[0-9\-]+$/,
                                                            message: "Please enter a valid zipcode"
                                                        }
                                                    })}
                                                    type="text" 
                                                    name="zipcode" 
                                                    id="zipcode" 
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                    placeholder="Zipcode" 
                                                />
                                                {errors.zipcode && (
                                                    <p className="text-red-500 text-xs mt-1">{errors.zipcode.message}</p>
                                                )}
                                            </div>

                                            {/* Order Summary */}
                                            <div className="md:col-span-5 border-t pt-4">
                                                <h3 className="font-medium text-lg text-gray-600 mb-3">Order Summary</h3>
                                                <div className="space-y-2">
                                                    {cartItems.map((item) => (
                                                        <div key={item._id} className="flex justify-between items-center border-b pb-2">
                                                            <div>
                                                                <p className="font-medium">{item.title}</p>
                                                                <p className="text-sm text-gray-500">Qty: {item.quantity} × ${(item.newPrice || item.price).toFixed(2)}</p>
                                                            </div>
                                                            <p className="font-medium">
                                                                ${((item.newPrice || item.price) * (item.quantity || 1)).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between items-center pt-2 border-t">
                                                        <p className="font-bold text-lg">Total:</p>
                                                        <p className="font-bold text-lg">${totalPrice}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-5 mt-3">
                                                <div className="inline-flex items-center">
                                                    <input
                                                        onChange={(e) => setIsChecked(e.target.checked)}
                                                        type="checkbox" 
                                                        name="billing_same" 
                                                        id="billing_same" 
                                                        className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500" 
                                                    />
                                                    <label htmlFor="billing_same" className="ml-2 text-gray-700">
                                                        I agree to the <Link to="/terms" className='underline underline-offset-2 text-blue-600 hover:text-blue-800'>Terms & Conditions</Link> and <Link to="/shipping" className='underline underline-offset-2 text-blue-600 hover:text-blue-800'>Shipping Policy.</Link>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="md:col-span-5 text-right mt-6">
                                                <div className="inline-flex items-end">
                                                    <button
                                                        type="submit"
                                                        disabled={!isChecked || cartItems.length === 0 || isLoading}
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 transform hover:scale-105 disabled:hover:scale-100"
                                                    >
                                                        {isLoading ? "Processing..." : `Place Order - $${totalPrice}`}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-white rounded shadow-lg p-8 text-center">
                                <div className="text-6xl mb-4">🛒</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">No items to checkout</h3>
                                <p className="text-gray-500 mb-6">Your cart is empty. Add some books before proceeding to checkout.</p>
                                <Link 
                                    to="/products" 
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 inline-block"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CheckoutPage;