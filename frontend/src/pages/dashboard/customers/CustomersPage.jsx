import React, { useState } from 'react';
import { 
  HiSearch, 
  HiFilter, 
  HiMail, 
  HiPhone,
  HiStar,
  HiOutlineStar,
  HiEye,
  HiChat
} from 'react-icons/hi';
import { 
  MdPerson,
  MdLoyalty,
  MdDateRange
} from 'react-icons/md';

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock customers data
  const customers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2023-05-15',
      orders: 12,
      totalSpent: 845.50,
      tier: 'premium',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      lastOrder: '2024-11-15'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@example.com',
      phone: '+1 (555) 234-5678',
      joinDate: '2024-01-20',
      orders: 8,
      totalSpent: 320.75,
      tier: 'regular',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      lastOrder: '2024-11-14'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 (555) 345-6789',
      joinDate: '2022-11-08',
      orders: 25,
      totalSpent: 1560.20,
      tier: 'vip',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      lastOrder: '2024-11-14'
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      email: 'alex@example.com',
      phone: '+1 (555) 456-7890',
      joinDate: '2024-03-12',
      orders: 3,
      totalSpent: 89.97,
      tier: 'regular',
      status: 'inactive',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      lastOrder: '2024-08-22'
    },
    {
      id: 5,
      name: 'Jessica Williams',
      email: 'jessica@example.com',
      phone: '+1 (555) 567-8901',
      joinDate: '2023-08-30',
      orders: 15,
      totalSpent: 720.30,
      tier: 'premium',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      lastOrder: '2024-11-12'
    }
  ];

  const tierOptions = [
    { value: 'all', label: 'All Tiers' },
    { value: 'regular', label: 'Regular', color: 'gray' },
    { value: 'premium', label: 'Premium', color: 'blue' },
    { value: 'vip', label: 'VIP', color: 'purple' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'red' }
  ];

  const getTierBadge = (tier) => {
    const tierConfig = {
      regular: { color: 'bg-gray-100 text-gray-800', label: 'Regular' },
      premium: { color: 'bg-blue-100 text-blue-800', label: 'Premium' },
      vip: { color: 'bg-purple-100 text-purple-800', label: 'VIP' }
    };

    const config = tierConfig[tier];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  const renderStars = (tier) => {
    const stars = {
      regular: 1,
      premium: 2,
      vip: 3
    };
    
    const starCount = stars[tier] || 1;
    return (
      <div className="flex">
        {[...Array(3)].map((_, i) => (
          i < starCount ? 
            <HiStar key={i} className="h-4 w-4 text-yellow-400" /> : 
            <HiOutlineStar key={i} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || customer.tier === tierFilter;
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesTier && matchesStatus;
  });

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    premium: customers.filter(c => c.tier === 'premium' || c.tier === 'vip').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships and insights</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <HiMail className="h-4 w-4 mr-2" />
            Email Campaign
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors">
            <MdLoyalty className="h-4 w-4 mr-2" />
            Loyalty Program
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <MdPerson className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <HiStar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Premium/VIP</p>
              <p className="text-2xl font-bold text-gray-900">{stats.premium}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <MdLoyalty className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <HiStar className="h-6 w-6 text-green-600" />
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
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {tierOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                  src={customer.avatar}
                  alt={customer.name}
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <div className="flex items-center mt-1">
                    {renderStars(customer.tier)}
                    <span className="ml-2 text-sm text-gray-500">{getTierBadge(customer.tier)}</span>
                  </div>
                </div>
              </div>
              {getStatusBadge(customer.status)}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <HiMail className="h-4 w-4 mr-2 text-gray-400" />
                {customer.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <HiPhone className="h-4 w-4 mr-2 text-gray-400" />
                {customer.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MdDateRange className="h-4 w-4 mr-2 text-gray-400" />
                Joined {customer.joinDate}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{customer.orders}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">${customer.totalSpent}</p>
                <p className="text-xs text-gray-500">Total Spent</p>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                <HiEye className="h-4 w-4 mr-1" />
                View
              </button>
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                <HiChat className="h-4 w-4 mr-1" />
                Message
              </button>
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                <HiMail className="h-4 w-4 mr-1" />
                Email
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <MdPerson className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;