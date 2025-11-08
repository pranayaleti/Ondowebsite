import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/auth';
import { 
  Users, 
  Megaphone, 
  CreditCard, 
  TrendingUp, 
  Loader,
  DollarSign,
  FileText,
  FolderOpen,
  ArrowUp,
  ArrowRight,
  Calendar,
  Activity
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Admin Dashboard" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead title="Admin Dashboard" />
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
          Error: {error}
        </div>
      </>
    );
  }

  const { stats, recentUsers, recentCampaigns, recentSubscriptions, userGrowth } = dashboardData;

  // Calculate growth percentage
  const userGrowthPercentage = stats.totalUsers > 0 
    ? ((stats.newUsersLast7Days / stats.totalUsers) * 100).toFixed(1)
    : 0;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Simple bar chart component
  const SimpleBarChart = ({ data, maxValue }) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-gray-400">
          No data available
        </div>
      );
    }

    return (
      <div className="h-48 flex items-end justify-between gap-2">
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-700 rounded-t relative" style={{ height: `${height}%` }}>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                  {item.count}
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const maxGrowthValue = userGrowth && userGrowth.length > 0
    ? Math.max(...userGrowth.map(item => item.count))
    : 1;

  return (
    <>
      <SEOHead title="Admin Dashboard" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Platform overview and analytics</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>{userGrowthPercentage}%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.totalUsers}
            </h3>
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-xs text-gray-500 mt-2">{stats.newUsersLast7Days} new this week</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <Megaphone className="w-8 h-8 text-green-400" />
              <span className="text-xs text-gray-400">{stats.activeCampaigns} active</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.totalCampaigns}
            </h3>
            <p className="text-sm text-gray-400">Total Campaigns</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-8 h-8 text-orange-400" />
              <span className="text-xs text-gray-400">{stats.activeSubscriptions} active</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.totalSubscriptions}
            </h3>
            <p className="text-sm text-gray-400">Subscriptions</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-purple-400" />
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {formatCurrency(stats.totalRevenue)}
            </h3>
            <p className="text-sm text-gray-400">Total Revenue</p>
            {stats.pendingRevenue > 0 && (
              <p className="text-xs text-yellow-400 mt-2">
                {formatCurrency(stats.pendingRevenue)} pending
              </p>
            )}
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <FolderOpen className="w-6 h-6 text-green-500" />
              <span className="text-sm text-gray-400">Assets</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.totalAssets}</h3>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-blue-500" />
              <span className="text-sm text-gray-400">Invoices</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.totalInvoices}</h3>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6 text-orange-500" />
              <span className="text-sm text-gray-400">Active Campaigns</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.activeCampaigns}</h3>
          </div>
        </div>

        {/* Charts and Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                User Growth (Last 30 Days)
              </h2>
            </div>
            <SimpleBarChart data={userGrowth} maxValue={maxGrowthValue} />
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentSubscriptions && recentSubscriptions.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{recentSubscriptions[0].plan_name}</p>
                    <p className="text-xs text-gray-400">{recentSubscriptions[0].user_name}</p>
                    {recentSubscriptions[0].price_display && (
                      <p className="text-xs text-orange-400 font-medium mt-1">
                        {recentSubscriptions[0].price_display}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(recentSubscriptions[0].created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {recentCampaigns && recentCampaigns.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <Megaphone className="w-5 h-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm text-white">New campaign created</p>
                    <p className="text-xs text-gray-400">{recentCampaigns[0].user_name}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(recentCampaigns[0].created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
              {recentUsers && recentUsers.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-white">New user registered</p>
                    <p className="text-xs text-gray-400">{recentUsers[0].name}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(recentUsers[0].created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Recent Users
            </h2>
            <Link
              to="/admin/clients"
              className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-sm"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentUsers && recentUsers.length > 0 ? (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No users yet</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/campaigns"
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Megaphone className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white">Manage Campaigns</h3>
            </div>
            <p className="text-sm text-gray-400">View and manage all platform campaigns</p>
          </Link>

          <Link
            to="/admin/clients"
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white">Manage Clients</h3>
            </div>
            <p className="text-sm text-gray-400">View and manage all platform users</p>
          </Link>

          <Link
            to="/admin/analytics"
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white">View Analytics</h3>
            </div>
            <p className="text-sm text-gray-400">Detailed platform analytics and insights</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
