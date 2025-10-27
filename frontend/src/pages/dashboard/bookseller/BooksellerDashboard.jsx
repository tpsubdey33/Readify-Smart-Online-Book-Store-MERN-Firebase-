// BooksellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    HiBookOpen, 
    HiShoppingCart, 
    HiCurrencyDollar, 
    HiUsers,
    HiChartBar,
    HiPlusCircle,
    HiCollection
} from "react-icons/hi";
import { useAuth } from '../../../context/AuthContext';
import Loading from '../../../components/Loading';

const BooksellerDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataError, setDataError] = useState(null);
    const { backendUser } = useAuth();

    useEffect(() => {
        fetchBooksellerData();
    }, []);

    const fetchBooksellerData = async () => {
        try {
            setDataError(null);
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            
            console.log('Fetching bookseller data...');
            
            // Fetch bookseller stats
            const statsResponse = await fetch(`${API_BASE_URL}/api/bookseller/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Stats response status:', statsResponse.status);
            
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                console.log('Stats data received:', statsData);
                setStats({
                    totalBooks: statsData.totalBooks || 0,
                    totalOrders: statsData.totalOrders || 0,
                    totalRevenue: statsData.totalRevenue || 0,
                    pendingOrders: statsData.pendingOrders || 0
                });
            } else {
                console.error('Stats API error:', statsResponse.status);
                setDataError('Failed to load stats data');
            }

            // Fetch recent orders
            const ordersResponse = await fetch(`${API_BASE_URL}/api/bookseller/orders/recent`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Orders response status:', ordersResponse.status);
            
            if (ordersResponse.ok) {
                const ordersData = await ordersResponse.json();
                console.log('Orders data received:', ordersData);
                setRecentOrders(ordersData.orders || []);
            } else {
                console.error('Orders API error:', ordersResponse.status);
                setDataError('Failed to load orders data');
            }
        } catch (error) {
            console.error('Error fetching bookseller data:', error);
            setDataError('Network error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    // Safe function to format revenue
    const formatRevenue = (revenue) => {
        if (revenue === undefined || revenue === null) return '$0';
        return `$${Number(revenue).toLocaleString()}`;
    };

    const quickActions = [
    {
        title: "Add New Book",
        description: "Add a new book to your catalog",
        icon: <HiPlusCircle className="h-8 w-8 text-green-600" />,
        link: "/bookseller/add-new-book", // Changed from /dashboard/add-new-book
        color: "bg-green-50 border-green-200"
    },
    {
        title: "Manage Books",
        description: "View and manage your book inventory",
        icon: <HiCollection className="h-8 w-8 text-blue-600" />,
        link: "/bookseller/manage-books", // Changed from /dashboard/manage-books
        color: "bg-blue-50 border-blue-200"
    },
    {
        title: "View Orders",
        description: "Process and manage customer orders",
        icon: <HiShoppingCart className="h-8 w-8 text-purple-600" />,
        link: "/bookseller/orders", // Changed from /dashboard/orders
        color: "bg-purple-50 border-purple-200"
    },
    {
        title: "Inventory",
        description: "Monitor your stock levels",
        icon: <HiBookOpen className="h-8 w-8 text-orange-600" />,
        link: "/bookseller/inventory", // Changed from /dashboard/inventory
        color: "bg-orange-50 border-orange-200"
    }
];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            Welcome back, {backendUser?.profile?.storeName || backendUser?.username}!
                        </h1>
                        <p className="text-purple-100 opacity-90">
                            Here's what's happening with your bookstore today.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                            <p className="text-sm opacity-90">Store Status</p>
                            <p className="font-semibold capitalize">
                                {backendUser?.profile?.storeStatus || 'approved'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {dataError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <HiChartBar className="h-5 w-5 text-yellow-600 mr-2" />
                        <p className="text-yellow-700">{dataError}</p>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Books</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalBooks || 0}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <HiBookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">In your catalog</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <HiShoppingCart className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">All time orders</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatRevenue(stats.totalRevenue)}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <HiCurrencyDollar className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Total earnings</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders || 0}</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                            <HiUsers className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Need attention</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                    <Link
                        key={index}
                        to={action.link}
                        className={`block p-6 rounded-xl border-2 ${action.color} hover:shadow-md transition-all duration-200 hover:scale-105`}
                    >
                        <div className="flex items-center space-x-4">
                            {action.icon}
                            <div>
                                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Orders & Store Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                        <Link 
                            to="/dashboard/orders"
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.length > 0 ? (
                            recentOrders.slice(0, 5).map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Order #{order.orderId}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${order.totalAmount || 0}</p>
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {order.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <HiShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No recent orders</p>
                                <p className="text-sm text-gray-400 mt-1">Orders will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Store Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Store Name</label>
                            <p className="text-gray-900 font-medium">
                                {backendUser?.profile?.storeName || 'Not set'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Business License</label>
                            <p className="text-gray-900 font-medium">
                                {backendUser?.profile?.businessLicense || 'Not provided'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Contact Email</label>
                            <p className="text-gray-900">{backendUser?.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Store Status</label>
                            <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                                backendUser?.profile?.storeStatus === 'approved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {backendUser?.profile?.storeStatus || 'approved'}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <Link
                            to="/dashboard/settings"
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                        >
                            Update store information →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BooksellerDashboard;