import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import {
  CreditCard,
  Megaphone,
  FolderOpen,
  DollarSign,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  LayoutDashboard,
  Lock,
} from 'lucide-react';

// Static sample data for the demo dashboard (read-only)
const SAMPLE_DATA = {
  user: { name: 'Sample User' },
  subscription: { plan_name: 'Starter', status: 'active' },
  campaignCount: 3,
  assetCount: 12,
  totalRevenue: 2400,
  pendingInvoices: 1,
  recentCampaigns: [
    { id: 1, name: 'Q1 Product Launch', status: 'active', created_at: '2025-01-10T14:00:00Z' },
    { id: 2, name: 'Email Newsletter', status: 'active', created_at: '2025-01-05T09:30:00Z' },
    { id: 3, name: 'Holiday Campaign', status: 'completed', created_at: '2024-12-01T11:00:00Z' },
  ],
  recentInvoices: [
    { id: 1001, amount: 499, status: 'paid', created_at: '2025-01-15T10:00:00Z' },
    { id: 1002, amount: 299, status: 'pending', created_at: '2025-02-01T08:00:00Z' },
    { id: 1000, amount: 499, status: 'paid', created_at: '2024-12-20T16:00:00Z' },
  ],
  recentAssets: [
    { id: 1, name: 'Logo-Primary.svg', type: 'Image', created_at: '2025-01-18T12:00:00Z' },
    { id: 2, name: 'Brand-Guidelines.pdf', type: 'Document', created_at: '2025-01-12T09:00:00Z' },
    { id: 3, name: 'Hero-Banner-1200.jpg', type: 'Image', created_at: '2025-01-08T14:30:00Z' },
  ],
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const formatDemoDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const DemoPage = () => {
  const {
    user,
    subscription,
    campaignCount,
    assetCount,
    totalRevenue,
    pendingInvoices,
    recentCampaigns,
    recentInvoices,
    recentAssets,
  } = SAMPLE_DATA;

  return (
    <>
      <SEOHead
        title="Sample Dashboard | OndoSoft Client Portal Demo"
        description="View a sample of the OndoSoft client dashboard. See how clients manage campaigns, assets, invoices, and subscriptions."
        keywords="dashboard demo, client portal sample, OndoSoft dashboard"
      />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        {/* Demo banner */}
        <div className="bg-orange-500/20 border-b border-orange-500/30 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-orange-300">
              <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Sample dashboard — view only. No sign-in required.</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/auth/signin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition-colors"
              >
                <Lock className="w-4 h-4" />
                Sign in for your dashboard
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 font-medium text-sm transition-colors"
              >
                Request Demo
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white text-sm">
                ← Home
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-400">Here's an overview of your account (sample data)</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 cursor-default">
              <div className="flex items-center justify-between mb-4">
                <CreditCard className="w-8 h-8 text-orange-400" />
                <span className="text-sm text-gray-400">Plan</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{subscription.plan_name}</h3>
              <p className="text-sm text-green-400">{subscription.status}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 cursor-default">
              <div className="flex items-center justify-between mb-4">
                <Megaphone className="w-8 h-8 text-blue-400" />
                <span className="text-sm text-gray-400">Active</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{campaignCount}</h3>
              <p className="text-sm text-gray-400">Campaigns</p>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 cursor-default">
              <div className="flex items-center justify-between mb-4">
                <FolderOpen className="w-8 h-8 text-green-400" />
                <span className="text-sm text-gray-400">Stored</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{assetCount}</h3>
              <p className="text-sm text-gray-400">Assets</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 cursor-default">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-purple-400" />
                <span className="text-sm text-gray-400">Revenue</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(totalRevenue)}</h3>
              <p className="text-sm text-gray-400">Total Paid</p>
              {pendingInvoices > 0 && (
                <p className="text-xs text-yellow-400 mt-2">
                  {pendingInvoices} pending invoice{pendingInvoices > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions (disabled / visual only) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 opacity-80 cursor-default">
              <div className="flex items-center gap-3 mb-3">
                <Megaphone className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-bold text-white">Create Campaign</h3>
              </div>
              <p className="text-sm text-gray-400">Start a new marketing campaign</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 opacity-80 cursor-default">
              <div className="flex items-center gap-3 mb-3">
                <FolderOpen className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-bold text-white">Upload Assets</h3>
              </div>
              <p className="text-sm text-gray-400">Store and manage your assets</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 opacity-80 cursor-default">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-bold text-white">Manage Plan</h3>
              </div>
              <p className="text-sm text-gray-400">View and upgrade your subscription</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Campaigns */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <Megaphone className="w-5 h-5 text-blue-500" />
                Recent Campaigns
              </h2>
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          campaign.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      />
                      <div>
                        <h3 className="text-white font-medium">{campaign.name}</h3>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Created {formatDemoDate(campaign.created_at)}
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
            </div>

            {/* Recent Invoices */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-500" />
                Recent Invoices
              </h2>
              <div className="space-y-4">
                {recentInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
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
                          {formatDemoDate(invoice.created_at)}
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
            </div>
          </div>

          {/* Recent Assets */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <FolderOpen className="w-5 h-5 text-green-500" />
              Recent Assets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FolderOpen className="w-5 h-5 text-green-500" />
                    <h3 className="text-white font-medium truncate">{asset.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{asset.type}</p>
                  <p className="text-xs text-gray-500">{formatDemoDate(asset.created_at)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-12 border-t border-gray-700/50">
            <p className="text-gray-400 mb-4">This is a sample. Get your own dashboard when you work with us.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/auth/signin"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
              >
                Sign in to your account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 font-semibold transition-colors"
              >
                Request a demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoPage;
