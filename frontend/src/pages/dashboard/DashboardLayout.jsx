import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    HiViewGridAdd, 
    HiHome,
    HiChartBar,
    HiCog,
    HiMenu,
    HiSearch,
    HiBell,
    HiLogout
} from "react-icons/hi";
import { 
    MdOutlineManageHistory,
    MdInventory,
    MdDashboard 
} from "react-icons/md";
import { FiBook, FiUsers, FiShoppingCart } from 'react-icons/fi';


const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Fetch user data or get from context
        const userData = {
            name: "Grace Simmons",
            role: "Administrator",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        };
        setUser(userData);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/");
    }

    // Navigation items
    const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: <MdDashboard className="h-5 w-5" />,
        current: location.pathname === "/dashboard"
    },
    {
        name: "Inventory",
        href: "/dashboard/inventory",
        icon: <MdInventory className="h-5 w-5" />,
        current: location.pathname === "/dashboard/inventory"
    },
    {
        name: "Orders",
        href: "/dashboard/orders",
        icon: <FiShoppingCart className="h-5 w-5" />,
        current: location.pathname === "/dashboard/orders"
    },
    {
        name: "Customers",
        href: "/dashboard/customers",
        icon: <FiUsers className="h-5 w-5" />,
        current: location.pathname === "/dashboard/customers"
    },
    {
        name: "Analytics",
        href: "/dashboard/analytics",
        icon: <HiChartBar className="h-5 w-5" />,
        current: location.pathname === "/dashboard/analytics"
    },
    {
        name: "Add New Book",
        href: "/dashboard/add-new-book",
        icon: <HiViewGridAdd className="h-5 w-5" />,
        current: location.pathname === "/dashboard/add-new-book"
    },
    {
        name: "Manage Books",
        href: "/dashboard/manage-books",
        icon: <MdOutlineManageHistory className="h-5 w-5" />,
        current: location.pathname === "/dashboard/manage-books"
    }
];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 flex z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                </div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-700 to-purple-800 transform transition duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 md:static md:inset-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-20 px-4 bg-purple-900">
                        <Link to="/dashboard" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <FiBook className="h-6 w-6 text-purple-600" />
                            </div>
                            <span className="text-white text-xl font-bold">BookStore</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`
                                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                                    ${item.current 
                                        ? 'bg-white text-purple-700 shadow-lg' 
                                        : 'text-purple-100 hover:bg-purple-600 hover:text-white'
                                    }
                                `}
                            >
                                <span className={`mr-3 ${item.current ? 'text-purple-600' : 'text-purple-300'}`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-purple-600">
                        <div className="flex items-center px-4 py-3">
                            <img
                                className="h-10 w-10 rounded-full object-cover border-2 border-purple-300"
                                src={user?.avatar}
                                alt={user?.name}
                            />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{user?.name}</p>
                                <p className="text-xs text-purple-200">{user?.role}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="ml-auto p-2 text-purple-200 hover:text-white hover:bg-purple-600 rounded-lg transition-colors"
                            >
                                <HiLogout className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        {/* Left section */}
                        <div className="flex items-center">
                            <button
                                type="button"
                                className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <HiMenu className="h-6 w-6" />
                            </button>
                            
                            {/* Search bar */}
                            <div className="relative ml-4 md:ml-0 w-64 lg:w-96">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search books, orders, customers..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Right section */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                                <HiBell className="h-5 w-5" />
                                <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                            </button>

                            {/* Settings */}
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                                <HiCog className="h-5 w-5" />
                            </button>

                            {/* User profile */}
                            <div className="flex items-center space-x-3">
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.role}</p>
                                </div>
                                <img
                                    className="h-9 w-9 rounded-full object-cover border-2 border-gray-200"
                                    src={user?.avatar}
                                    alt={user?.name}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-auto bg-gray-50">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Page header */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {location.pathname === '/dashboard' ? 'Dashboard' : 
                                         location.pathname.includes('add-new-book') ? 'Add New Book' :
                                         location.pathname.includes('manage-books') ? 'Manage Books' : 'Dashboard'}
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Manage your bookstore efficiently and effectively
                                    </p>
                                </div>
                                
                                {/* Action buttons */}
                                <div className="mt-4 sm:mt-0 flex space-x-3">
                                    <Link
                                        to="/dashboard/manage-books"
                                        className="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-xl text-purple-700 bg-white hover:bg-purple-50 transition-colors shadow-sm"
                                    >
                                        <MdOutlineManageHistory className="h-4 w-4 mr-2" />
                                        Manage Books
                                    </Link>
                                    <Link
                                        to="/dashboard/add-new-book"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
                                    >
                                        <HiViewGridAdd className="h-4 w-4 mr-2" />
                                        Add New Book
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Page content */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout