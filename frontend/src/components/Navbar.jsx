import { Link, useNavigate } from "react-router-dom";
import { 
  HiMiniBars3CenterLeft, 
  HiOutlineHeart, 
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineShoppingBag
} from "react-icons/hi2";
import { IoSearchOutline, IoClose, IoLogOutOutline } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartItems = useSelector(state => state.cart.cartItems);
  const { currentUser, logout, backendUser } = useAuth(); // Added backendUser
  const navigate = useNavigate();
  
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // FIXED: Enhanced logout handler
  const handleLogOut = async () => {
    try {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      await logout();
      // Navigation will happen automatically due to state changes
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const navigation = [
    { name: "Home", href: "/", icon: HiOutlineHome },
    { name: "Books", href: "/books", icon: HiOutlineBookOpen },
    { name: "Dashboard", href: "/user-dashboard", icon: HiOutlineUser },
    { name: "Orders", href: "/orders", icon: HiOutlineShoppingBag },
    { name: "Cart", href: "/cart", icon: HiOutlineShoppingCart },
  ];

  const totalCartItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  // FIXED: Use backendUser for authentication check to be consistent
  const isAuthenticated = !!backendUser;

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Mobile menu button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <HiMiniBars3CenterLeft className="h-6 w-6" />
            </button>

            {/* Logo/Brand */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                Readify
              </span>
            </Link>
          </div>

          {/* Center - Search Bar (Desktop) */}
          <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors, categories..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                />
              </div>
            </form>
          </div>

          {/* Right side - Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Button (Mobile) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <IoSearchOutline className="h-6 w-6" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative group"
            >
              <HiOutlineHeart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center hidden group-hover:flex">
                0
              </span>
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Wishlist
              </div>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative group"
            >
              <HiOutlineShoppingCart className="h-6 w-6" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems > 99 ? '99+' : totalCartItems}
                </span>
              )}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Cart ({totalCartItems})
              </div>
            </Link>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              {isAuthenticated ? ( // FIXED: Use backendUser for consistent authentication state
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {backendUser?.username?.charAt(0).toUpperCase() || 
                       currentUser?.displayName?.charAt(0).toUpperCase() || 
                       currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-gray-700 font-medium hidden sm:block">
                      {backendUser?.username ||
                       currentUser?.displayName || 
                       currentUser?.email?.split('@')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {backendUser?.username || currentUser?.displayName || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {backendUser?.email || currentUser?.email}
                        </p>
                      </div>

                      {/* Navigation Links */}
                      <div className="py-2">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          >
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.name}
                          </Link>
                        ))}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <IoLogOutOutline className="h-5 w-5 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <HiOutlineUser className="h-6 w-6" />
                  <span className="hidden sm:block">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="lg:hidden fixed inset-0 bg-white z-50 p-4">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <IoClose className="h-6 w-6" />
              </button>
              <span className="text-lg font-semibold">Search Books</span>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, authors, categories..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-white z-50" ref={mobileMenuRef}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">Readify</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <IoClose className="h-6 w-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    <item.icon className="h-6 w-6 mr-3" />
                    {item.name}
                  </Link>
                ))}
                
                {isAuthenticated && ( // FIXED: Use consistent authentication check
                  <button
                    onClick={handleLogOut}
                    className="flex items-center w-full px-4 py-3 text-lg text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <IoLogOutOutline className="h-6 w-6 mr-3" />
                    Sign Out
                  </button>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;