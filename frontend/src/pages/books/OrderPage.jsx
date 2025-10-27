import React from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi';
import { useAuth } from '../../context/AuthContext';

const OrderPage = () => {
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);

    if (isLoading) return (
        <div className="container mx-auto p-6 flex justify-center items-center min-h-64">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="container mx-auto p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
                <p className="text-red-600">There was a problem loading your order history. Please try again later.</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4 lg:p-6 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
                <p className="text-gray-600">View your order history and tracking information</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                                        <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                                            Order #{index + 1}
                                        </span>
                                        <span className="text-sm text-gray-500">Order ID: {order._id}</span>
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        ${order.totalPrice?.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Customer Information */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                            Customer Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                {order.name}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {order.email}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {order.phone}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                            Shipping Address
                                        </h3>
                                        <div className="flex items-start text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div>
                                                <p>{order.address.city}, {order.address.state}</p>
                                                <p>{order.address.country}, {order.address.zipcode}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Products */}
                                    <div className="lg:col-span-1">
                                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                                            Products ({order.productIds?.length || 0})
                                        </h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <ul className="space-y-2 max-h-32 overflow-y-auto">
                                                {order.productIds?.map((productId, idx) => (
                                                    <li key={productId} className="text-sm text-gray-600 flex items-center">
                                                        <span className="w-5 h-5 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center justify-center mr-2">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="font-mono text-xs bg-white px-2 py-1 rounded border">
                                                            {productId}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-4">
                                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-200">
                                        View Details
                                    </button>
                                    <button className="text-sm text-gray-600 hover:text-gray-800 font-medium transition duration-200">
                                        Track Order
                                    </button>
                                    <button className="text-sm text-gray-600 hover:text-gray-800 font-medium transition duration-200">
                                        Download Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderPage;