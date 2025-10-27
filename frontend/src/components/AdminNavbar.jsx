import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSearchOutline, IoClose, IoLogOutOutline } from "react-icons/io5";
import { HiMenu } from "react-icons/hi2";

const AdminNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const admin = JSON.parse(localStorage.getItem("admin") || '{}');

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Inventory", href: "/dashboard/inventory" },
    { name: "Orders", href: "/dashboard/orders" },
    { name: "Customers", href: "/dashboard/customers" },
    { name: "Analytics", href: "/dashboard/analytics" },
    { name: "Add Book", href: "/dashboard/add-new-book" },
    { name: "Manage Books", href: "/dashboard/manage-books" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center">
          <div className="h-8 w-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold">A</div>
          <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
        </Link>

        {/* Mobile menu button */}
        <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <HiMenu className="h-6 w-6" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-3 py-2 rounded-lg ${location.pathname === item.href ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-100'}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Admin dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 p-2 rounded-lg bg-purple-600 text-white">
            <span>{admin.name || "Admin"}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-medium">{admin.name || "Admin"}</p>
                <p className="text-sm text-gray-500 truncate">{admin.email || "admin@example.com"}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <IoLogOutOutline className="h-5 w-5 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200" ref={mobileRef}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 ${location.pathname === item.href ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-100'}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;
