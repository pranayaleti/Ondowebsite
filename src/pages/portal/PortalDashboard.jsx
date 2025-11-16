import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { portalAPI } from '../../utils/auth.js';
import { 
  CreditCard, 
  Megaphone, 
  FolderOpen, 
  TrendingUp,
  ArrowRight,
  Loader,
  DollarSign,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import { formatDateUserTimezone, formatDateTimeUserTimezone } from '../../utils/dateFormat.js';

const PortalDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await portalAPI.getDashboard();
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
        <SEOHead title="Dashboard" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead title="Dashboard" />
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
          Error: {error}
        </div>
      </>
    );
  }

  const { 
    user, 
    subscription, 
    campaignCount, 
    assetCount, 
    recentCampaigns,
    recentAssets,
    recentInvoices,
    totalRevenue,
    pendingInvoices
  } = dashboardData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <SEOHead title="Dashboard" />
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-gray-400">Here's an overview of your account</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/dashboard/subscriptions"
            className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 hover:border-orange-500/50 transition-colors cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-8 h-8 text-orange-400" />
              <span className="text-sm text-gray-400">Plan</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {subscription?.plan_name || 'No Plan'}
            </h3>
            <p className={`text-sm ${
              subscription?.status === 'active' 
                ? 'text-green-400' 
                : 'text-gray-400'
            }`}>
              {subscription?.status || 'Not subscribed'}
            </p>
            <span className="text-xs text-orange-400 hover:text-orange-300 mt-2 inline-block">
              {!subscription ? 'View plans →' : 'Manage plan →'}
            </span>
          </Link>

          <Link
            to="/dashboard/campaigns"
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 hover:border-blue-500/50 transition-colors cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-4">
              <Megaphone className="w-8 h-8 text-blue-400" />
              <span className="text-sm text-gray-400">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {campaignCount}
            </h3>
            <p className="text-sm text-gray-400">Campaigns</p>
            <span className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block">
              Manage →
            </span>
          </Link>

          <Link
            to="/dashboard/assets"
            className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 hover:border-green-500/50 transition-colors cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-4">
              <FolderOpen className="w-8 h-8 text-green-400" />
              <span className="text-sm text-gray-400">Stored</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {assetCount}
            </h3>
            <p className="text-sm text-gray-400">Assets</p>
            <span className="text-xs text-green-400 hover:text-green-300 mt-2 inline-block">
              View all →
            </span>
          </Link>

          <Link
            to="/dashboard/invoices"
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-colors cursor-pointer block"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-purple-400" />
              <span className="text-sm text-gray-400">Revenue</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {formatCurrency(totalRevenue)}
            </h3>
            <p className="text-sm text-gray-400">Total Paid</p>
            {pendingInvoices > 0 && (
              <p className="text-xs text-yellow-400 mt-2">
                {pendingInvoices} pending invoice{pendingInvoices > 1 ? 's' : ''}
              </p>
            )}
            <span className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-block">
              View invoices →
            </span>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/dashboard/campaigns"
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Megaphone className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white">Create Campaign</h3>
            </div>
            <p className="text-sm text-gray-400">Start a new marketing campaign</p>
          </Link>

          <Link
            to="/dashboard/assets"
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <FolderOpen className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white">Upload Assets</h3>
            </div>
            <p className="text-sm text-gray-400">Store and manage your assets</p>
          </Link>

          <Link
            to="/dashboard/subscriptions"
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-orange-500/50 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white">Manage Plan</h3>
            </div>
            <p className="text-sm text-gray-400">View and upgrade your subscription</p>
          </Link>
        </div>

        {/* Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Campaigns */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-500" />
                Recent Campaigns
              </h2>
              <Link
                to="/dashboard/campaigns"
                className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-sm"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentCampaigns && recentCampaigns.length > 0 ? (
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        campaign.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <h3 className="text-white font-medium">{campaign.name}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Created {formatDateTimeUserTimezone(campaign.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Megaphone className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No campaigns yet</p>
                <Link
                  to="/dashboard/campaigns"
                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400"
                >
                  Create your first campaign
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Recent Invoices
              </h2>
              <Link
                to="/dashboard/invoices"
                className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-sm"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentInvoices && recentInvoices.length > 0 ? (
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      {invoice.status === 'paid' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : invoice.status === 'pending' ? (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-500" />
                      )}
                      <div>
                        <h3 className="text-white font-medium">Invoice #{invoice.id}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateTimeUserTimezone(invoice.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatCurrency(invoice.amount)}</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-500/20 text-green-400'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No invoices yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Assets */}
        {recentAssets && recentAssets.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-green-500" />
                Recent Assets
              </h2>
              <Link
                to="/dashboard/assets"
                className="text-orange-500 hover:text-orange-400 flex items-center gap-2 text-sm"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-default"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FolderOpen className="w-5 h-5 text-green-500" />
                    <h3 className="text-white font-medium truncate">{asset.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{asset.type}</p>
                  {asset.url && (
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-500 hover:text-orange-400"
                    >
                      View Asset →
                    </a>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDateTimeUserTimezone(asset.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PortalDashboard;
