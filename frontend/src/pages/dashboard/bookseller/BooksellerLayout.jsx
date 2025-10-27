// BooksellerLayout.jsx
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useEffect } from 'react';

const BooksellerLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Safely get auth context
    let auth = null;
    try {
        auth = useAuth();
    } catch (error) {
        console.error('Auth context error in BooksellerLayout:', error);
        navigate('/login');
        return null;
    }

    const { backendUser, logout } = auth || {};

    // If no backendUser but we have token, try to redirect
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !backendUser) {
            // Wait a bit for auth context to load
            const timer = setTimeout(() => {
                if (!backendUser) {
                    navigate('/login');
                }
            }, 1000);
            
            return () => clearTimeout(timer);
        }
    }, [backendUser, navigate]);

    if (!backendUser) {
        return <div>Loading...</div>;
    }

    const navigation = [
        { name: 'Dashboard', href: '/bookseller', icon: '📊' },
        { name: 'Add New Book', href: '/bookseller/add-new-book', icon: '➕' },
        { name: 'Manage Books', href: '/bookseller/manage-books', icon: '📚' },
        { name: 'Orders', href: '/bookseller/orders', icon: '📦' },
        { name: 'Inventory', href: '/bookseller/inventory', icon: '📋' },
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Bookseller Panel</h1>
                            <p className="text-sm text-gray-600">{backendUser?.profile?.storeName}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    isActive(item.href)
                                        ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-600'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <span className="mr-3 text-lg">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                    {backendUser?.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {backendUser?.username}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {backendUser?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="pl-64">
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default BooksellerLayout;