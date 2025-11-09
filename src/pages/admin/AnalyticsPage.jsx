import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/auth';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Megaphone, 
  DollarSign,
  Loader,
  PieChart,
  Activity,
  Database,
  Clock,
  Server,
  MousePointer,
  Navigation,
  Scroll,
  FileText,
  Eye,
  Link as LinkIcon,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Maximize2,
  Minimize2,
  Zap,
  Target,
  Award,
  UserPlus,
  Calendar,
  Percent
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [requestAnalytics, setRequestAnalytics] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('users');
  const [activeTab, setActiveTab] = useState('platform'); // 'platform', 'requests', or 'user'
  const [selectedCard, setSelectedCard] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Check if getUserAnalytics exists (defensive check for module reload issues)
      if (!adminAPI.getUserAnalytics) {
        console.error('getUserAnalytics function not found in adminAPI. Please refresh the page.');
        throw new Error('getUserAnalytics function not available. Please refresh the page.');
      }
      
      const [platformData, requestData, userData] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getRequestAnalytics(),
        adminAPI.getUserAnalytics()
      ]);
      setAnalyticsData(platformData);
      setRequestAnalytics(requestData);
      setUserAnalytics(userData);
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

  const SimpleBarChart = ({ data, maxValue, color = 'bg-blue-500', labelFormat = 'date' }) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      );
    }

    const formatLabel = (dateString) => {
      if (labelFormat === 'hour' || dateString.includes(':')) {
        // Handle hour format (e.g., "0:00", "1:00")
        return dateString;
      }
      // Handle date format
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return dateString; // Return as-is if invalid date
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch (error) {
        return dateString; // Return as-is if parsing fails
      }
    };

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
                {formatLabel(item.date)}
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

  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  const calculateGrowthRate = (data) => {
    if (!data || data.length < 2) return { value: 0, isPositive: true };
    const recent = data.slice(-7); // Last 7 days
    const previous = data.slice(-14, -7); // Previous 7 days
    const recentAvg = recent.reduce((sum, item) => sum + (item.count || 0), 0) / recent.length;
    const previousAvg = previous.reduce((sum, item) => sum + (item.count || 0), 0) / previous.length;
    return calculateTrend(recentAvg, previousAvg);
  };

  const LineChart = ({ data, color = 'blue', height = 200 }) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-48 flex items-center justify-center text-gray-400">
          No data available
        </div>
      );
    }

    const maxValue = Math.max(...data.map(item => item.count || 0));
    const minValue = Math.min(...data.map(item => item.count || 0));
    const range = maxValue - minValue || 1;
    const width = 100 / data.length;

    const colorClasses = {
      blue: 'stroke-blue-400',
      green: 'stroke-green-400',
      orange: 'stroke-orange-400',
      purple: 'stroke-purple-400',
      red: 'stroke-red-400'
    };

    const fillClasses = {
      blue: 'fill-blue-400/20',
      green: 'fill-green-400/20',
      orange: 'fill-orange-400/20',
      purple: 'fill-purple-400/20',
      red: 'fill-red-400/20'
    };

    const points = data.map((item, index) => {
      const x = (index * width) + (width / 2);
      const y = 100 - ((item.count - minValue) / range) * 80;
      return `${x},${y}`;
    }).join(' ');

    const heightClass = height === 200 ? 'h-48' : height === 150 ? 'h-36' : 'h-48';
    const gradientId = `gradient-${color}-${Date.now()}`;

    return (
      <div className={`${heightClass} w-full`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color === 'blue' ? '#60a5fa' : color === 'green' ? '#34d399' : color === 'orange' ? '#fb923c' : color === 'purple' ? '#a78bfa' : '#f87171'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color === 'blue' ? '#60a5fa' : color === 'green' ? '#34d399' : color === 'orange' ? '#fb923c' : color === 'purple' ? '#a78bfa' : '#f87171'} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline
            points={`0,100 ${points} 100,100`}
            fill={`url(#${gradientId})`}
            className={fillClasses[color]}
          />
          <polyline
            points={points}
            fill="none"
            strokeWidth="2"
            className={colorClasses[color]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((item, index) => {
            const x = (index * width) + (width / 2);
            const y = 100 - ((item.count - minValue) / range) * 80;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                className={colorClasses[color]}
                fill="currentColor"
              />
            );
            })}
        </svg>
      </div>
    );
  };

  const MetricCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = 'blue', 
    trend, 
    onClick,
    data,
    details
  }) => {
    const colorClasses = {
      blue: { bg: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30', icon: 'text-blue-400', trendUp: 'text-blue-400', trendDown: 'text-red-400' },
      green: { bg: 'from-green-500/20 to-green-600/20', border: 'border-green-500/30', icon: 'text-green-400', trendUp: 'text-green-400', trendDown: 'text-red-400' },
      orange: { bg: 'from-orange-500/20 to-orange-600/20', border: 'border-orange-500/30', icon: 'text-orange-400', trendUp: 'text-orange-400', trendDown: 'text-red-400' },
      purple: { bg: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/30', icon: 'text-purple-400', trendUp: 'text-purple-400', trendDown: 'text-red-400' },
      red: { bg: 'from-red-500/20 to-red-600/20', border: 'border-red-500/30', icon: 'text-red-400', trendUp: 'text-red-400', trendDown: 'text-red-400' }
    };

    const colors = colorClasses[color];

    return (
      <div
        onClick={onClick}
        className={`bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-xl p-6 border ${colors.border} transition-all cursor-pointer hover:scale-105 hover:shadow-lg ${
          expandedCard === title ? 'ring-2 ring-orange-500' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${colors.icon}`} />
            <span className="text-sm text-gray-400">{title}</span>
          </div>
          {onClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandedCard(expandedCard === title ? null : title);
              }}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              {expandedCard === title ? (
                <Minimize2 className="w-4 h-4 text-gray-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            {subtitle && (
              <p className="text-xs text-gray-400">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 ${trend.isPositive ? colors.trendUp : colors.trendDown}`}>
              {trend.isPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">{trend.value}%</span>
            </div>
          )}
        </div>
        {data && expandedCard === title && (
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <LineChart data={data} color={color} height={150} />
          </div>
        )}
        {details && expandedCard === title && (
          <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-2">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{detail.label}</span>
                <span className="text-white font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
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
          <button
            onClick={() => setActiveTab('user')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'user'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            User Analytics
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
                  labelFormat="hour"
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

        {activeTab === 'user' && userAnalytics && (
          <>
            {/* User Analytics Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <MousePointerClick className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-gray-400">Total Clicks</span>
                </div>
                <h3 className="text-3xl font-bold text-white">
                  {userAnalytics.totalClicks?.toLocaleString() || 0}
                </h3>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-gray-400">Total Page Views</span>
                </div>
                <h3 className="text-3xl font-bold text-white">
                  {userAnalytics.totalPageViews?.toLocaleString() || 0}
                </h3>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  <span className="text-sm text-gray-400">Unique Sessions</span>
                </div>
                <h3 className="text-3xl font-bold text-white">
                  {userAnalytics.uniqueSessions?.toLocaleString() || 0}
                </h3>
                <p className="text-xs text-gray-400 mt-2">Last 30 days</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <Scroll className="w-6 h-6 text-orange-400" />
                  <span className="text-sm text-gray-400">Avg Scroll Depth</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {userAnalytics.scrollDepthStats?.avg_depth 
                    ? `${Math.round(userAnalytics.scrollDepthStats.avg_depth)}%`
                    : '0%'}
                </h3>
              </div>
            </div>

            {/* Clicks Over Time */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MousePointerClick className="w-5 h-5 text-blue-500" />
                Clicks Over Time (Last 30 Days)
              </h2>
              {userAnalytics.clicksOverTime && userAnalytics.clicksOverTime.length > 0 ? (
                <SimpleBarChart 
                  data={userAnalytics.clicksOverTime.map(item => ({ date: item.date, count: item.count }))} 
                  maxValue={Math.max(...userAnalytics.clicksOverTime.map(item => item.count))} 
                  color="bg-blue-500" 
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
              )}
            </div>

            {/* Page Views Over Time */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-500" />
                Page Views Over Time (Last 30 Days)
              </h2>
              {userAnalytics.pageViewsOverTime && userAnalytics.pageViewsOverTime.length > 0 ? (
                <SimpleBarChart 
                  data={userAnalytics.pageViewsOverTime.map(item => ({ date: item.date, count: item.count }))} 
                  maxValue={Math.max(...userAnalytics.pageViewsOverTime.map(item => item.count))} 
                  color="bg-green-500" 
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
              )}
            </div>

            {/* Most Viewed Pages */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-purple-500" />
                Most Viewed Pages
              </h2>
              {userAnalytics.mostViewedPages && userAnalytics.mostViewedPages.length > 0 ? (
                <div className="space-y-3">
                  {userAnalytics.mostViewedPages.slice(0, 15).map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{page.pathname || '/'}</p>
                          <p className="text-sm text-gray-400">
                            {page.unique_sessions} unique sessions
                            {page.avg_load_time && ` • Avg load: ${Math.round(page.avg_load_time)}ms`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">{page.views}</p>
                        <p className="text-xs text-gray-400">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>

            {/* Top Clicked Links */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-orange-500" />
                Top Clicked Links
              </h2>
              {userAnalytics.topClickedLinks && userAnalytics.topClickedLinks.length > 0 ? (
                <div className="space-y-3">
                  {userAnalytics.topClickedLinks.slice(0, 15).map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium break-all">{link.href}</p>
                          <p className="text-sm text-gray-400">
                            {link.unique_sessions} unique sessions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">{link.count}</p>
                        <p className="text-xs text-gray-400">clicks</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>

            {/* Clicks by Element Type */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-blue-500" />
                Clicks by Element Type
              </h2>
              {userAnalytics.clicksByElementType && userAnalytics.clicksByElementType.length > 0 ? (
                <>
                  <PieChartComponent 
                    data={userAnalytics.clicksByElementType} 
                    colors={['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4']}
                  />
                  <div className="mt-4 space-y-2">
                    {userAnalytics.clicksByElementType.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 capitalize">{item.element_type}</span>
                        <span className="text-white font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>

            {/* Scroll Depth Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Scroll className="w-5 h-5 text-green-500" />
                  Scroll Depth Statistics
                </h3>
                {userAnalytics.scrollDepthStats ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <span className="text-gray-300">Reached 25%</span>
                      <span className="text-white font-bold">{userAnalytics.scrollDepthStats.reached_25 || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <span className="text-gray-300">Reached 50%</span>
                      <span className="text-white font-bold">{userAnalytics.scrollDepthStats.reached_50 || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <span className="text-gray-300">Reached 75%</span>
                      <span className="text-white font-bold">{userAnalytics.scrollDepthStats.reached_75 || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <span className="text-gray-300">Reached 100%</span>
                      <span className="text-white font-bold">{userAnalytics.scrollDepthStats.reached_100 || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <span className="text-gray-300">Average Depth</span>
                      <span className="text-white font-bold">
                        {userAnalytics.scrollDepthStats.avg_depth 
                          ? `${Math.round(userAnalytics.scrollDepthStats.avg_depth)}%`
                          : '0%'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">No data available</p>
                )}
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Average Time on Page
                </h3>
                {userAnalytics.avgTimeOnPage && userAnalytics.avgTimeOnPage.length > 0 ? (
                  <div className="space-y-3">
                    {userAnalytics.avgTimeOnPage.slice(0, 10).map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div>
                          <p className="text-white font-medium text-sm">{page.pathname || '/'}</p>
                          <p className="text-xs text-gray-400">{page.count} visits</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">
                            {Math.round(page.avg_time / 1000)}s
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

            {/* Navigation Flow */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-purple-500" />
                Navigation Flow (Top Paths)
              </h2>
              {userAnalytics.navigationFlow && userAnalytics.navigationFlow.length > 0 ? (
                <div className="space-y-3">
                  {userAnalytics.navigationFlow.slice(0, 20).map((flow, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400 text-sm">{flow.from_path || '/'}</div>
                        <div className="text-gray-500">→</div>
                        <div className="text-white font-medium text-sm">{flow.to_path || '/'}</div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{flow.count}</p>
                        <p className="text-xs text-gray-400">transitions</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>

            {/* Form Interactions */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Form Interactions
              </h2>
              {userAnalytics.formInteractions && userAnalytics.formInteractions.length > 0 ? (
                <div className="space-y-3">
                  {userAnalytics.formInteractions.slice(0, 20).map((form, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div>
                        <p className="text-white font-medium">{form.form_id || 'Unnamed Form'}</p>
                        <p className="text-sm text-gray-400 capitalize">{form.action}</p>
                        {form.field_name && (
                          <p className="text-xs text-gray-500">Field: {form.field_name}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">{form.count}</p>
                        <p className="text-xs text-gray-400">interactions</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>

            {/* User Interaction Types */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                User Interaction Types
              </h2>
              {userAnalytics.userInteractionTypes && userAnalytics.userInteractionTypes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userAnalytics.userInteractionTypes.map((interaction, index) => (
                    <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                      <p className="text-white font-medium capitalize mb-2">
                        {interaction.interaction_type.replace(/_/g, ' ')}
                      </p>
                      <p className="text-2xl font-bold text-orange-500">{interaction.count}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>

            {/* Sessions by Hour */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Sessions by Hour (Last 7 Days)
              </h2>
              {userAnalytics.sessionsByHour && userAnalytics.sessionsByHour.length > 0 ? (
                <SimpleBarChart 
                  data={userAnalytics.sessionsByHour.map(item => ({ date: `${item.hour}:00`, count: item.sessions }))} 
                  maxValue={Math.max(...userAnalytics.sessionsByHour.map(item => item.sessions))} 
                  color="bg-blue-500"
                  labelFormat="hour"
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
              )}
            </div>
          </>
        )}

        {activeTab === 'platform' && (
          <>
        {/* Enhanced Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={analyticsData?.totalUsers || usersByRole?.reduce((sum, item) => sum + item.count, 0) || 0}
            subtitle="All platform users"
            icon={Users}
            color="blue"
            trend={userGrowth && userGrowth.length > 0 ? calculateGrowthRate(userGrowth) : null}
            data={userGrowth?.slice(-30) || []}
            details={[
              { label: 'Admins', value: usersByRole?.find(u => u.role === 'ADMIN')?.count || 0 },
              { label: 'Regular Users', value: usersByRole?.find(u => u.role === 'USER')?.count || 0 },
              { label: 'New This Month', value: userGrowth?.slice(-30).reduce((sum, item) => sum + item.count, 0) || 0 }
            ]}
            onClick={() => setSelectedCard('users')}
          />
          <MetricCard
            title="Total Campaigns"
            value={analyticsData?.totalCampaigns || campaignsByStatus?.reduce((sum, item) => sum + item.count, 0) || 0}
            subtitle="All campaigns"
            icon={Megaphone}
            color="green"
            trend={campaignGrowth && campaignGrowth.length > 0 ? calculateGrowthRate(campaignGrowth) : null}
            data={campaignGrowth?.slice(-30) || []}
            details={[
              { label: 'Active', value: campaignsByStatus?.find(c => c.status === 'active')?.count || 0 },
              { label: 'Inactive', value: campaignsByStatus?.find(c => c.status === 'inactive')?.count || 0 },
              { label: 'This Month', value: campaignGrowth?.slice(-30).reduce((sum, item) => sum + item.count, 0) || 0 }
            ]}
            onClick={() => setSelectedCard('campaigns')}
          />
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(monthlyRevenue?.reduce((sum, item) => sum + parseFloat(item.total || 0), 0) || 0)}
            subtitle="All time revenue"
            icon={DollarSign}
            color="orange"
            trend={monthlyRevenue && monthlyRevenue.length > 1 ? calculateTrend(
              parseFloat(monthlyRevenue[monthlyRevenue.length - 1]?.total || 0),
              parseFloat(monthlyRevenue[monthlyRevenue.length - 2]?.total || 0)
            ) : null}
            data={monthlyRevenue?.map(item => ({ date: item.month, count: parseFloat(item.total || 0) })) || []}
            details={[
              { label: 'This Month', value: formatCurrency(parseFloat(monthlyRevenue?.[monthlyRevenue.length - 1]?.total || 0)) },
              { label: 'Last Month', value: formatCurrency(parseFloat(monthlyRevenue?.[monthlyRevenue.length - 2]?.total || 0)) },
              { label: 'Average Monthly', value: formatCurrency((monthlyRevenue?.reduce((sum, item) => sum + parseFloat(item.total || 0), 0) || 0) / (monthlyRevenue?.length || 1)) }
            ]}
            onClick={() => setSelectedCard('revenue')}
          />
          <MetricCard
            title="Active Subscriptions"
            value={subscriptionsByStatus?.find(s => s.status === 'active')?.count || 0}
            subtitle="Active subscriptions"
            icon={Award}
            color="purple"
            details={[
              { label: 'Active', value: subscriptionsByStatus?.find(s => s.status === 'active')?.count || 0 },
              { label: 'Cancelled', value: subscriptionsByStatus?.find(s => s.status === 'cancelled')?.count || 0 },
              { label: 'Total', value: subscriptionsByStatus?.reduce((sum, item) => sum + item.count, 0) || 0 }
            ]}
            onClick={() => setSelectedCard('subscriptions')}
          />
        </div>

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

        {/* Detailed Modal */}
        {selectedCard && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <div 
              className="relative max-w-4xl w-full max-h-[90vh] bg-gray-900 rounded-xl border border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/50">
                <h2 className="text-2xl font-bold text-white">
                  {selectedCard === 'users' && 'User Analytics Details'}
                  {selectedCard === 'campaigns' && 'Campaign Analytics Details'}
                  {selectedCard === 'revenue' && 'Revenue Analytics Details'}
                  {selectedCard === 'subscriptions' && 'Subscription Analytics Details'}
                </h2>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-auto max-h-[calc(90vh-100px)]">
                {selectedCard === 'users' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">User Growth Trend (Last 30 Days)</h3>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <LineChart data={userGrowth?.slice(-30) || []} color="blue" height={200} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Total Users</h4>
                        <p className="text-2xl font-bold text-white">{usersByRole?.reduce((sum, item) => sum + item.count, 0) || 0}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Growth Rate</h4>
                        <p className="text-2xl font-bold text-white">
                          {userGrowth && userGrowth.length > 0 ? `${calculateGrowthRate(userGrowth).value}%` : '0%'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Users by Role</h4>
                      <div className="space-y-2">
                        {usersByRole?.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <span className="text-white">{item.role}</span>
                            <span className="text-white font-semibold">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {selectedCard === 'campaigns' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Campaign Growth Trend (Last 30 Days)</h3>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <LineChart data={campaignGrowth?.slice(-30) || []} color="green" height={200} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Total Campaigns</h4>
                        <p className="text-2xl font-bold text-white">{campaignsByStatus?.reduce((sum, item) => sum + item.count, 0) || 0}</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Growth Rate</h4>
                        <p className="text-2xl font-bold text-white">
                          {campaignGrowth && campaignGrowth.length > 0 ? `${calculateGrowthRate(campaignGrowth).value}%` : '0%'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Campaigns by Status</h4>
                      <div className="space-y-2">
                        {campaignsByStatus?.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <span className="text-white capitalize">{item.status}</span>
                            <span className="text-white font-semibold">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {selectedCard === 'revenue' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend (Last 12 Months)</h3>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <LineChart 
                          data={monthlyRevenue?.map(item => ({ date: item.month, count: parseFloat(item.total || 0) })) || []} 
                          color="orange" 
                          height={200} 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">This Month</h4>
                        <p className="text-xl font-bold text-white">
                          {formatCurrency(parseFloat(monthlyRevenue?.[monthlyRevenue.length - 1]?.total || 0))}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Last Month</h4>
                        <p className="text-xl font-bold text-white">
                          {formatCurrency(parseFloat(monthlyRevenue?.[monthlyRevenue.length - 2]?.total || 0))}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Average Monthly</h4>
                        <p className="text-xl font-bold text-white">
                          {formatCurrency((monthlyRevenue?.reduce((sum, item) => sum + parseFloat(item.total || 0), 0) || 0) / (monthlyRevenue?.length || 1))}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Monthly Breakdown</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {monthlyRevenue?.slice().reverse().map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <span className="text-white">{item.month}</span>
                            <span className="text-white font-semibold">{formatCurrency(parseFloat(item.total || 0))}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {selectedCard === 'subscriptions' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Active</h4>
                        <p className="text-2xl font-bold text-white">
                          {subscriptionsByStatus?.find(s => s.status === 'active')?.count || 0}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Cancelled</h4>
                        <p className="text-2xl font-bold text-white">
                          {subscriptionsByStatus?.find(s => s.status === 'cancelled')?.count || 0}
                        </p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Total</h4>
                        <p className="text-2xl font-bold text-white">
                          {subscriptionsByStatus?.reduce((sum, item) => sum + item.count, 0) || 0}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">Subscriptions by Status</h4>
                      <div className="space-y-2">
                        {subscriptionsByStatus?.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <span className="text-white capitalize">{item.status}</span>
                            <span className="text-white font-semibold">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AnalyticsPage;
