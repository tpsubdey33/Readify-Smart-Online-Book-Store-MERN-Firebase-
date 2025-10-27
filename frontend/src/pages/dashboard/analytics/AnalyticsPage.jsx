import React, { useState } from 'react';
import { 
  HiTrendingUp, 
  HiTrendingDown, 
  HiShoppingCart,
  HiUsers,
  HiCurrencyDollar,
  HiChartBar
} from 'react-icons/hi';
import { 
  MdAnalytics,
  MdShowChart,
  MdPieChart,
  MdTimeline
} from 'react-icons/md';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [activeChart, setActiveChart] = useState('revenue');

  // Mock analytics data
  const analyticsData = {
    overview: {
      revenue: { current: 12540, previous: 10890, change: 15.2 },
      orders: { current: 342, previous: 298, change: 14.8 },
      customers: { current: 189, previous: 156, change: 21.2 },
      conversion: { current: 4.2, previous: 3.8, change: 10.5 }
    },
    charts: {
      revenue: [1200, 1900, 3000, 5000, 2000, 3000, 4800, 3600, 4200, 3800, 4500, 5200],
      orders: [45, 52, 48, 55, 58, 62, 54, 68, 72, 75, 78, 80],
      customers: [120, 135, 130, 145, 150, 165, 158, 172, 180, 175, 185, 189]
    },
    topProducts: [
      { name: 'The Psychology of Money', sales: 45, revenue: 1125 },
      { name: 'Atomic Habits', sales: 38, revenue: 722 },
      { name: 'Deep Work', sales: 32, revenue: 703 },
      { name: 'The Midnight Library', sales: 28, revenue: 475 },
      { name: 'Thinking, Fast and Slow', sales: 25, revenue: 625 }
    ],
    trafficSources: [
      { source: 'Direct', visitors: 1245, percentage: 35 },
      { source: 'Google', visitors: 890, percentage: 25 },
      { source: 'Social Media', visitors: 712, percentage: 20 },
      { source: 'Email', visitors: 534, percentage: 15 },
      { source: 'Referral', visitors: 178, percentage: 5 }
    ]
  };

  const timeRanges = [
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
    { value: 'year', label: 'Last Year' }
  ];

  const chartTypes = [
    { value: 'revenue', label: 'Revenue', icon: <HiCurrencyDollar className="h-5 w-5" /> },
    { value: 'orders', label: 'Orders', icon: <HiShoppingCart className="h-5 w-5" /> },
    { value: 'customers', label: 'Customers', icon: <HiUsers className="h-5 w-5" /> }
  ];

  const getTrendIcon = (change) => {
    return change >= 0 ? 
      <HiTrendingUp className="h-4 w-4 text-green-500" /> : 
      <HiTrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}k`;
    }
    return `$${num}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your bookstore performance</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(analyticsData.overview).map(([key, data]) => (
          <div key={key} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 capitalize">
                  {key === 'conversion' ? 'Conversion Rate' : key}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {key === 'revenue' ? formatNumber(data.current) : 
                   key === 'conversion' ? `${data.current}%` : data.current}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                {key === 'revenue' && <HiCurrencyDollar className="h-6 w-6 text-purple-600" />}
                {key === 'orders' && <HiShoppingCart className="h-6 w-6 text-purple-600" />}
                {key === 'customers' && <HiUsers className="h-6 w-6 text-purple-600" />}
                {key === 'conversion' && <MdAnalytics className="h-6 w-6 text-purple-600" />}
              </div>
            </div>
            <div className="flex items-center">
              {getTrendIcon(data.change)}
              <span className={`ml-1 text-sm font-medium ${getTrendColor(data.change)}`}>
                {data.change >= 0 ? '+' : ''}{data.change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from previous period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              {chartTypes.map(chart => (
                <button
                  key={chart.value}
                  onClick={() => setActiveChart(chart.value)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeChart === chart.value 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {chart.icon}
                  <span className="ml-2">{chart.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-80 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MdShowChart className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-600 font-medium">Interactive Chart</p>
              <p className="text-purple-400 text-sm">Showing {activeChart} data for {timeRange}</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 text-xs rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">${product.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
            <div className="space-y-3">
              {analyticsData.trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{source.source}</span>
                    <span className="text-sm text-gray-500">{source.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{source.visitors.toLocaleString()} visitors</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <div className="space-y-4">
            {[
              { step: 'Visitors', count: 3560, percentage: 100 },
              { step: 'Product Views', count: 2340, percentage: 65.7 },
              { step: 'Add to Cart', count: 890, percentage: 25 },
              { step: 'Checkout', count: 450, percentage: 12.6 },
              { step: 'Purchases', count: 342, percentage: 9.6 }
            ].map((funnel, index) => (
              <div key={funnel.step}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{funnel.step}</span>
                  <span className="text-sm text-gray-500">{funnel.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${funnel.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{funnel.count.toLocaleString()} users</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-green-600">4.8</span>
            </div>
            <p className="text-gray-600 mb-2">Average Rating</p>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <HiTrendingUp key={star} className="h-5 w-5 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">Based on 234 reviews</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">Generate Report</span>
              <MdAnalytics className="h-5 w-5 text-purple-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">Export Data</span>
              <HiTrendingUp className="h-5 w-5 text-purple-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">Schedule Analysis</span>
              <MdTimeline className="h-5 w-5 text-purple-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
              <span className="text-sm font-medium text-gray-900">Compare Periods</span>
              <MdPieChart className="h-5 w-5 text-purple-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;