import React, { useState, useEffect } from 'react';
import { 
  HiSearch, 
  HiMail, 
  HiStar,
  HiOutlineStar,
  HiEye,
  HiChat,
  HiUser,
  HiUserGroup,
  HiCheckCircle,
  HiXCircle,
  HiRefresh
} from 'react-icons/hi';
import { 
  MdDateRange,
  MdStore,
  MdEmail
} from 'react-icons/md';
import { adminAPI } from '../../../utils/api';

const CustomersPage = () => {
  // Direct localStorage theke token r user niye neo
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [backendUser, setBackendUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });
  
  const isAdmin = backendUser?.role === 'admin';
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [booksellers, setBooksellers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    premium: 0,
    totalRevenue: 0,
    booksellers: 0,
    pendingBooksellers: 0
  });

  console.log('Direct Access Debug:', {
    token: token ? 'Token exists' : 'No token',
    backendUser,
    isAdmin
  });

  // Fetch data when component mounts or filters change
  useEffect(() => {
    if (isAdmin && token) {
      fetchData();
    }
  }, [activeTab, searchTerm, tierFilter, token, isAdmin]);

  const fetchData = async () => {
    if (!token) {
      console.error('No token available');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 50,
        ...(searchTerm && { search: searchTerm })
      };

      console.log('Fetching data with token:', token.substring(0, 20) + '...');

      // Fetch users
      if (activeTab === 'all' || activeTab === 'users') {
        const usersResponse = await adminAPI.getUsers(token, {
          ...params,
          role: activeTab === 'users' ? 'user' : undefined
        });
        
        console.log('Users API Response:', usersResponse);
        
        if (usersResponse.success) {
          setUsers(usersResponse.data?.users || []);
        } else {
          console.error('Failed to fetch users:', usersResponse.message);
        }
      }

      // Fetch booksellers
      if (activeTab === 'all' || activeTab === 'booksellers') {
        const booksellersResponse = await adminAPI.getBooksellers(token, params);
        
        console.log('Booksellers API Response:', booksellersResponse);
        
        if (booksellersResponse.success) {
          setBooksellers(booksellersResponse.data?.booksellers || []);
        } else {
          console.error('Failed to fetch booksellers:', booksellersResponse.message);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  useEffect(() => {
    const allData = [...users, ...booksellers];
    const activeUsers = allData.filter(u => u.isActive);
    const premiumUsers = allData.filter(u => 
      u.role === 'bookseller' && u.profile?.storeStatus === 'approved'
    );
    const pendingBooksellers = booksellers.filter(b => 
      b.profile?.storeStatus === 'pending'
    );
    
    setStats({
      total: allData.length,
      active: activeUsers.length,
      premium: premiumUsers.length,
      totalRevenue: 0,
      booksellers: booksellers.length,
      pendingBooksellers: pendingBooksellers.length
    });
  }, [users, booksellers]);

  // Handle user status update
  const handleUserStatusUpdate = async (userId, isActive) => {
    if (!token) return;
    
    try {
      const response = await adminAPI.updateUserStatus(token, userId, isActive);
      if (response.success) {
        // Update local state
        setUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, isActive } : u
        ));
        setBooksellers(prev => prev.map(b => 
          b._id === userId ? { ...b, isActive } : b
        ));
      } else {
        console.error('Failed to update user status:', response.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Handle bookseller approval
  const handleBooksellerApproval = async (userId, action) => {
    if (!token) return;
    
    try {
      const response = await adminAPI.updateBooksellerStatus(token, userId, action);
      if (response.success) {
        // Update local state
        setBooksellers(prev => prev.map(b => 
          b._id === userId ? { 
            ...b, 
            profile: { 
              ...b.profile, 
              storeStatus: action === 'approve' ? 'approved' : 'rejected' 
            } 
          } : b
        ));
      } else {
        console.error('Failed to update bookseller status:', response.message);
      }
    } catch (error) {
      console.error('Error updating bookseller status:', error);
    }
  };

  // Get user tier
  const getUserTier = (userData) => {
    if (userData.role === 'bookseller') {
      if (userData.profile?.storeStatus === 'approved') return 'premium';
      if (userData.profile?.storeStatus === 'pending') return 'regular';
      return 'regular';
    }
    return 'regular';
  };

  const getTierBadge = (tier) => {
    const tierConfig = {
      regular: { color: 'bg-gray-100 text-gray-800', label: 'Regular' },
      premium: { color: 'bg-blue-100 text-blue-800', label: 'Premium' },
      vip: { color: 'bg-purple-100 text-purple-800', label: 'VIP' }
    };

    const config = tierConfig[tier] || tierConfig.regular;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (userData) => {
    if (userData.role === 'bookseller') {
      const status = userData.profile?.storeStatus;
      if (status === 'approved') {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      } else if (status === 'pending') {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      } else {
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      }
    }

    return userData.isActive ? (
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

  // Filter data
  const getFilteredData = () => {
    let data = [];
    
    if (activeTab === 'all') {
      data = [...users, ...booksellers];
    } else if (activeTab === 'users') {
      data = users.filter(user => user.role === 'user');
    } else if (activeTab === 'booksellers') {
      data = booksellers;
    }

    return data.filter(item => {
      const matchesSearch = 
        item.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.profile?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.role === 'bookseller' && item.profile?.storeName?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTier = tierFilter === 'all' || getUserTier(item) === tierFilter;
      
      return matchesSearch && matchesTier;
    });
  };

  const filteredData = getFilteredData();

  const tierOptions = [
    { value: 'all', label: 'All Tiers' },
    { value: 'regular', label: 'Regular', color: 'gray' },
    { value: 'premium', label: 'Premium', color: 'blue' },
    { value: 'vip', label: 'VIP', color: 'purple' }
  ];

  // Access check
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <HiUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500">Admin privileges required to view this page.</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>Current User: {backendUser?.username}</p>
            <p>Role: {backendUser?.role}</p>
            <p>Token: {token ? 'Available' : 'Missing'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships and insights</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={fetchData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <HiRefresh className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['all', 'users', 'booksellers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'all' ? 'All Customers' : tab}
              {tab === 'booksellers' && stats.pendingBooksellers > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {stats.pendingBooksellers}
                </span>
              )}
            </button>
          ))}
        </nav>
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
              <HiUserGroup className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <HiUser className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Booksellers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.booksellers}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <MdStore className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingBooksellers}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <HiStar className="h-6 w-6 text-yellow-600" />
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
              placeholder="Search by name, email, or store name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {tierOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => {
          const tier = getUserTier(item);
          const isBookseller = item.role === 'bookseller';
          
          return (
            <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {item.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.profile?.fullName || item.username || 'Unknown User'}
                    </h3>
                    <div className="flex items-center mt-1">
                      {renderStars(tier)}
                      <span className="ml-2 text-sm text-gray-500">{getTierBadge(tier)}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(item)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <HiMail className="h-4 w-4 mr-2 text-gray-400" />
                  {item.email || 'No email'}
                </div>
                {isBookseller && item.profile?.storeName && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MdStore className="h-4 w-4 mr-2 text-gray-400" />
                    {item.profile.storeName}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <MdDateRange className="h-4 w-4 mr-2 text-gray-400" />
                  Joined {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <HiUser className="h-4 w-4 mr-2 text-gray-400" />
                  {item.role ? item.role.charAt(0).toUpperCase() + item.role.slice(1) : 'User'}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200">
                {isBookseller && item.profile?.storeStatus === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleBooksellerApproval(item._id, 'approve')}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
                      <HiCheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                    <button 
                      onClick={() => handleBooksellerApproval(item._id, 'reject')}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      <HiXCircle className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                  </>
                )}
                
                {!isBookseller && (
                  <button 
                    onClick={() => handleUserStatusUpdate(item._id, !item.isActive)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      item.isActive 
                        ? 'text-red-600 hover:text-red-700' 
                        : 'text-green-600 hover:text-green-700'
                    } transition-colors`}
                  >
                    {item.isActive ? (
                      <>
                        <HiXCircle className="h-4 w-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <HiCheckCircle className="h-4 w-4 mr-1" />
                        Activate
                      </>
                    )}
                  </button>
                )}
                
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  <HiEye className="h-4 w-4 mr-1" />
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <HiUserGroup className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;