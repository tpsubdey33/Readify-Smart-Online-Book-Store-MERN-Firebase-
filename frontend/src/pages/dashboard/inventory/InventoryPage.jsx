import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiSearch, 
  HiFilter, 
  HiPlus, 
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineShoppingCart
} from 'react-icons/hi';
import { 
  MdInventory, 
  MdWarning, 
  MdCheckCircle,
  MdOutlineCategory 
} from 'react-icons/md';

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Mock inventory data
  const inventoryItems = [
    {
      id: 1,
      title: "The Psychology of Money",
      sku: "BK-001",
      category: "Psychology",
      price: 24.99,
      stock: 45,
      minStock: 10,
      status: "in-stock",
      lastUpdated: "2024-11-15",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Atomic Habits",
      sku: "BK-002",
      category: "Self-Help",
      price: 18.99,
      stock: 8,
      minStock: 15,
      status: "low-stock",
      lastUpdated: "2024-11-14",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Deep Work",
      sku: "BK-003",
      category: "Productivity",
      price: 21.99,
      stock: 0,
      minStock: 5,
      status: "out-of-stock",
      lastUpdated: "2024-11-10",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&h=200&fit=crop"
    },
    {
      id: 4,
      title: "The Midnight Library",
      sku: "BK-004",
      category: "Fiction",
      price: 16.99,
      stock: 32,
      minStock: 8,
      status: "in-stock",
      lastUpdated: "2024-11-16",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=150&h=200&fit=crop"
    }
  ];

  const categories = ["All", "Psychology", "Self-Help", "Productivity", "Fiction", "Business", "Science"];
  const stockStatuses = [
    { value: "all", label: "All Stock" },
    { value: "in-stock", label: "In Stock", color: "text-green-600" },
    { value: "low-stock", label: "Low Stock", color: "text-yellow-600" },
    { value: "out-of-stock", label: "Out of Stock", color: "text-red-600" }
  ];

  const getStatusBadge = (status, stock, minStock) => {
    const statusConfig = {
      "in-stock": { color: "bg-green-100 text-green-800", icon: <MdCheckCircle className="h-4 w-4" />, label: "In Stock" },
      "low-stock": { color: "bg-yellow-100 text-yellow-800", icon: <MdWarning className="h-4 w-4" />, label: `Low Stock (${stock})` },
      "out-of-stock": { color: "bg-red-100 text-red-800", icon: <HiOutlineShoppingCart className="h-4 w-4" />, label: "Out of Stock" }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStock = stockFilter === 'all' || item.status === stockFilter;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const stats = {
    totalItems: inventoryItems.length,
    inStock: inventoryItems.filter(item => item.status === 'in-stock').length,
    lowStock: inventoryItems.filter(item => item.status === 'low-stock').length,
    outOfStock: inventoryItems.filter(item => item.status === 'out-of-stock').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your bookstore inventory efficiently</p>
        </div>
        <Link
          to="/dashboard/add-new-book"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          <HiPlus className="h-5 w-5 mr-2" />
          Add New Book
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MdInventory className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <MdCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MdWarning className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <HiOutlineShoppingCart className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category.toLowerCase()}>{category}</option>
              ))}
            </select>
            
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {stockStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Books Inventory</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-9 object-cover rounded border"
                        src={item.image}
                        alt={item.title}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MdOutlineCategory className="h-4 w-4 text-gray-400 mr-2" />
                      {item.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.stock}</div>
                    <div className="text-xs text-gray-500">Min: {item.minStock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status, item.stock, item.minStock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors">
                        <HiOutlineEye className="h-5 w-5" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded transition-colors">
                        <HiOutlinePencil className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors">
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <MdInventory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;