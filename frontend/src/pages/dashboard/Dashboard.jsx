import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle, MdTrendingUp, MdInventory, MdAttachMoney, MdShoppingCart } from 'react-icons/md'
import { FiUsers, FiEye } from 'react-icons/fi'
import RevenueChart from './RevenueChart';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [activeChart, setActiveChart] = useState('revenue');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${getBaseUrl()}/api/admin`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                })

                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) return <Loading />

    // Stats Cards Data
    const stats = [
        {
            title: "Total Products",
            value: data?.totalBooks || 0,
            icon: <MdInventory className="h-6 w-6" />,
            color: "purple",
            trend: "+12%",
            description: "Active books in store"
        },
        {
            title: "Total Sales",
            value: `$${data?.totalSales || 0}`,
            icon: <MdAttachMoney className="h-6 w-6" />,
            color: "green",
            trend: "+23%",
            description: "Lifetime revenue"
        },
        {
            title: "Trending Books",
            value: data?.trendingBooks || 0,
            icon: <MdTrendingUp className="h-6 w-6" />,
            color: "red",
            trend: "+13%",
            description: "This month"
        },
        {
            title: "Total Orders",
            value: data?.totalOrders || 0,
            icon: <MdShoppingCart className="h-6 w-6" />,
            color: "blue",
            trend: "+8%",
            description: "Completed orders"
        }
    ];

    // Top Customers Data (you can replace with actual data from API)
    const topCustomers = [
        {
            id: 1,
            name: "Annette Watson",
            email: "annette@example.com",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            totalOrders: 12,
            totalSpent: 2340,
            rating: 9.3
        },
        {
            id: 2,
            name: "Calvin Steward",
            email: "calvin@example.com",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            totalOrders: 8,
            totalSpent: 1890,
            rating: 8.9
        },
        {
            id: 3,
            name: "Ralph Richards",
            email: "ralph@example.com",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            totalOrders: 15,
            totalSpent: 3120,
            rating: 8.7
        },
        {
            id: 4,
            name: "Bernard Murphy",
            email: "bernard@example.com",
            avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
            totalOrders: 6,
            totalSpent: 980,
            rating: 8.2
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
            green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
            red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
            blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' }
        };
        return colors[color] || colors.purple;
    };

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
                        <p className="text-purple-100 opacity-90">
                            Here's what's happening with your bookstore today.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <p className="text-sm opacity-90">Current Period</p>
                            <p className="font-semibold">November 2024</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const color = getColorClasses(stat.color);
                    return (
                        <div key={index} className={`bg-white rounded-2xl shadow-sm border ${color.border} p-6 hover:shadow-md transition-all duration-300`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                    <div className="flex items-center">
                                        <span className={`text-xs font-medium ${color.text}`}>{stat.trend}</span>
                                        <span className="text-xs text-gray-500 ml-1">from last month</span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl ${color.bg} ${color.text}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">{stat.description}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts and Analytics Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Revenue Chart - Takes 2/3 on large screens */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
                        <div className="flex space-x-2 mt-2 sm:mt-0">
                            <button
                                onClick={() => setActiveChart('revenue')}
                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${activeChart === 'revenue' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Revenue
                            </button>
                            <button
                                onClick={() => setActiveChart('orders')}
                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${activeChart === 'orders' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Orders
                            </button>
                        </div>
                    </div>
                    <div className="h-80">
                        <RevenueChart />
                    </div>
                </div>

                {/* Right Sidebar - Additional Metrics */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                                        <FiEye className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Store Visits</p>
                                        <p className="text-xs text-gray-500">Last 24 hours</p>
                                    </div>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">1,247</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                        <FiUsers className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">New Customers</p>
                                        <p className="text-xs text-gray-500">This month</p>
                                    </div>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">42</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                                        <MdIncompleteCircle className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Pending Orders</p>
                                        <p className="text-xs text-gray-500">Need attention</p>
                                    </div>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">8</span>
                            </div>
                        </div>
                    </div>

                    {/* Top Customers */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
                            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {topCustomers.map((customer) => (
                                <div key={customer.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center">
                                        <img
                                            src={customer.avatar}
                                            alt={customer.name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                            <p className="text-xs text-gray-500">{customer.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end">
                                            <span className="text-sm font-semibold text-gray-900">{customer.rating}</span>
                                            <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                                        </div>
                                        <p className="text-xs text-gray-500">${customer.totalSpent}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Activity items would go here */}
                    <div className="text-center py-8 text-gray-500">
                        <p>Recent orders and activities will appear here</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard