import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/auth';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Megaphone, 
  DollarSign,
  Loader,
  PieChart,
  Activity,
  Database,
  Clock,
  Server
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [requestAnalytics, setRequestAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('users');
  const [activeTab, setActiveTab] = useState('platform'); // 'platform' or 'requests'

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [platformData, requestData] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getRequestAnalytics()
      ]);
      setAnalyticsData(platformData);
      setRequestAnalytics(requestData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const SimpleBarChart = ({ data, maxValue, color = 'bg-blue-500' }) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      );
    }

    return (
      <div className="h-64 flex items-end justify-between gap-1">
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-700 rounded-t relative group" style={{ height: `${height}%` }}>
                <div className={`absolute inset-0 ${color} rounded-t opacity-80 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.count}
                </div>
              </div>
              <span className="text-xs text-gray-400 text-center">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const RevenueChart = ({ data, maxValue }) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      );
    }

    return (
      <div className="h-64 flex items-end justify-between gap-1">
        {data.map((item, index) => {
          const height = maxValue > 0 ? (parseFloat(item.total) / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-700 rounded-t relative group" style={{ height: `${height}%` }}>
                <div className="absolute inset-0 bg-green-500 rounded-t opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {formatCurrency(parseFloat(item.total))}
                </div>
              </div>
              <span className="text-xs text-gray-400 text-center">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const PieChartComponent = ({ data, colors }) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-gray-400">
          No data available
        </div>
      );
    }

    const total = data.reduce((sum, item) => sum + parseInt(item.count), 0);
    let currentAngle = 0;

    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 200 200" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (parseInt(item.count) / total) * 100;
            const angle = (percentage / 100) * 360;
            const largeArc = percentage > 50 ? 1 : 0;
            const x1 = 100 + 100 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 100 + 100 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 100 + 100 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 100 + 100 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            currentAngle += angle;

            return (
              <path
                key={index}
                d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={colors[index % colors.length]}
                className="hover:opacity-80 transition-opacity"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Analytics - Admin" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead title="Analytics - Admin" />
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
          Error: {error}
        </div>
      </>
    );
  }

  const { 
    userGrowth, 
    campaignGrowth, 
    revenueGrowth, 
    usersByRole, 
    campaignsByStatus,
    subscriptionsByStatus,
    topUsersByCampaigns,
    monthlyRevenue
  } = analyticsData || {};

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const maxUserGrowth = userGrowth && userGrowth.length > 0
    ? Math.max(...userGrowth.map(item => item.count))
    : 1;
  const maxCampaignGrowth = campaignGrowth && campaignGrowth.length > 0
    ? Math.max(...campaignGrowth.map(item => item.count))
    : 1;
  const maxRevenue = revenueGrowth && revenueGrowth.length > 0
    ? Math.max(...revenueGrowth.map(item => parseFloat(item.total || 0)))
    : 1;
  const maxMonthlyRevenue = monthlyRevenue && monthlyRevenue.length > 0
    ? Math.max(...monthlyRevenue.map(item => parseFloat(item.total || 0)))
    : 1;

  return (
    <>
      <SEOHead title="Analytics - Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Platform insights and performance metrics</p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('platform')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'platform'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Platform Analytics
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Request Analytics
          </button>
        </div>

        {activeTab === 'requests' && requestAnalytics && (
          <>
            {/* Request Analytics Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-gray-400">Total Data</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {formatBytes(parseInt(requestAnalytics.totalData?.total_bytes || 0))}
                </h3>
                <p className="text-xs text-gray-400 mt-2">
                  {formatBytes(parseInt(requestAnalytics.totalData?.total_request_bytes || 0))} sent / {formatBytes(parseInt(requestAnalytics.totalData?.total_response_bytes || 0))} received
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-gray-400">Total Requests</span>
                </div>
                <h3 className="text-3xl font-bold text-white">
                  {requestAnalytics.totalData?.total_requests || 0}
                </h3>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <span className="text-sm text-gray-400">Avg Response</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {requestAnalytics.avgResponseTime && requestAnalytics.avgResponseTime.length > 0
                    ? `${Math.round(requestAnalytics.avgResponseTime.reduce((sum, item) => sum + parseFloat(item.avg_duration || 0), 0) / requestAnalytics.avgResponseTime.length)}ms`
                    : '0ms'}
                </h3>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Server className="w-6 h-6 text-orange-400" />
                  <span className="text-sm text-gray-400">Endpoints</span>
                </div>
                <h3 className="text-3xl font-bold text-white">
                  {requestAnalytics.requestsByEndpoint?.length || 0}
                </h3>
              </div>
            </div>

            {/* Requests Over Time */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Requests Over Time (Last 30 Days)
              </h2>
              {requestAnalytics.requestsOverTime && requestAnalytics.requestsOverTime.length > 0 ? (
                <SimpleBarChart 
                  data={requestAnalytics.requestsOverTime.map(item => ({ date: item.date, count: item.count }))} 
                  maxValue={Math.max(...requestAnalytics.requestsOverTime.map(item => item.count))} 
                  color="bg-blue-500" 
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
              )}
            </div>

            {/* Requests by Hour */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                Request Frequency by Hour (Last 7 Days)
              </h2>
              {requestAnalytics.requestsByHour && requestAnalytics.requestsByHour.length > 0 ? (
                <SimpleBarChart 
                  data={requestAnalytics.requestsByHour.map(item => ({ date: `${item.hour}:00`, count: item.count }))} 
                  maxValue={Math.max(...requestAnalytics.requestsByHour.map(item => item.count))} 
                  color="bg-green-500" 
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
              )}
            </div>

            {/* Top Endpoints */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-orange-500" />
                Top Endpoints by Request Count
              </h2>
              {requestAnalytics.requestsByEndpoint && requestAnalytics.requestsByEndpoint.length > 0 ? (
                <div className="space-y-3">
                  {requestAnalytics.requestsByEndpoint.slice(0, 10).map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{endpoint.endpoint}</p>
                          <p className="text-sm text-gray-400">
                            <span className={`px-2 py-1 rounded text-xs ${
                              endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                              endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                              endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                              endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {endpoint.method}
                            </span>
                            {' '}
                            Avg: {Math.round(parseFloat(endpoint.avg_duration || 0))}ms
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">{endpoint.count}</p>
                        <p className="text-xs text-gray-400">requests</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatBytes(parseInt(endpoint.total_bytes || 0))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>

            {/* Requests by Status Code */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-500" />
                  Requests by Status Code
                </h3>
                <PieChartComponent 
                  data={requestAnalytics.requestsByStatus || []} 
                  colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280']}
                />
                <div className="mt-4 space-y-2">
                  {requestAnalytics.requestsByStatus && requestAnalytics.requestsByStatus.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className={`text-gray-400 ${
                        item.status_code >= 200 && item.status_code < 300 ? 'text-green-400' :
                        item.status_code >= 300 && item.status_code < 400 ? 'text-blue-400' :
                        item.status_code >= 400 && item.status_code < 500 ? 'text-yellow-400' :
                        item.status_code >= 500 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {item.status_code}
                      </span>
                      <span className="text-white font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Top Users by Requests
                </h3>
                {requestAnalytics.topUsersByRequests && requestAnalytics.topUsersByRequests.length > 0 ? (
                  <div className="space-y-3">
                    {requestAnalytics.topUsersByRequests.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">{user.request_count}</p>
                          <p className="text-xs text-gray-400">requests</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatBytes(parseInt(user.total_bytes || 0))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No data available</p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'platform' && (
          <>

        {/* Chart Selection Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedChart('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedChart === 'users'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            User Growth
          </button>
          <button
            onClick={() => setSelectedChart('campaigns')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedChart === 'campaigns'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Campaign Growth
          </button>
          <button
            onClick={() => setSelectedChart('revenue')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedChart === 'revenue'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Revenue
          </button>
        </div>

        {/* Selected Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
          {selectedChart === 'users' && (
            <>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                User Growth (Last 90 Days)
              </h2>
              <SimpleBarChart data={userGrowth} maxValue={maxUserGrowth} color="bg-blue-500" />
            </>
          )}
          {selectedChart === 'campaigns' && (
            <>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-green-500" />
                Campaign Growth (Last 90 Days)
              </h2>
              <SimpleBarChart data={campaignGrowth} maxValue={maxCampaignGrowth} color="bg-green-500" />
            </>
          )}
          {selectedChart === 'revenue' && (
            <>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Monthly Revenue (Last 12 Months)
              </h2>
              <RevenueChart data={monthlyRevenue} maxValue={maxMonthlyRevenue} />
            </>
          )}
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" />
              Users by Role
            </h3>
            <PieChartComponent 
              data={usersByRole} 
              colors={['#3b82f6', '#f97316', '#10b981']}
            />
            <div className="mt-4 space-y-2">
              {usersByRole && usersByRole.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{item.role}</span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-500" />
              Campaigns by Status
            </h3>
            <PieChartComponent 
              data={campaignsByStatus} 
              colors={['#10b981', '#6b7280', '#ef4444']}
            />
            <div className="mt-4 space-y-2">
              {campaignsByStatus && campaignsByStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 capitalize">{item.status}</span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-orange-500" />
              Subscriptions by Status
            </h3>
            <PieChartComponent 
              data={subscriptionsByStatus} 
              colors={['#10b981', '#6b7280', '#ef4444']}
            />
            <div className="mt-4 space-y-2">
              {subscriptionsByStatus && subscriptionsByStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 capitalize">{item.status}</span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Users by Campaigns */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Top Users by Campaigns
          </h2>
          {topUsersByCampaigns && topUsersByCampaigns.length > 0 ? (
            <div className="space-y-3">
              {topUsersByCampaigns.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-500">{user.campaign_count}</p>
                    <p className="text-xs text-gray-400">campaigns</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No data available</p>
          )}
        </div>
          </>
        )}
      </div>
    </>
  );
};

export default AnalyticsPage;
