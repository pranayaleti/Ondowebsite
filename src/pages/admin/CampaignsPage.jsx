import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/auth';
import { Megaphone, Loader, Search, Filter, Calendar, User, Mail } from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const AdminCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [searchTerm, filterStatus, campaigns]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getCampaigns();
      setCampaigns(data.campaigns);
      setFilteredCampaigns(data.campaigns);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterCampaigns = () => {
    let filtered = [...campaigns];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === filterStatus);
    }

    setFilteredCampaigns(filtered);
  };

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    inactive: campaigns.filter(c => c.status !== 'active').length,
    thisMonth: campaigns.filter(c => {
      const created = new Date(c.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Campaigns - Admin" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Campaigns - Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Campaigns Management</h1>
          <p className="text-gray-400">View and manage all platform campaigns</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
            Error: {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Megaphone className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-gray-400">Total Campaigns</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Megaphone className="w-6 h-6 text-green-400" />
              <span className="text-sm text-gray-400">Active</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.active}</h3>
          </div>

          <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 backdrop-blur-sm rounded-xl p-6 border border-gray-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Megaphone className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-400">Inactive</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.inactive}</h3>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Megaphone className="w-6 h-6 text-orange-400" />
              <span className="text-sm text-gray-400">This Month</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.thisMonth}</h3>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by campaign name, user name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </p>
        </div>

        {/* Campaigns List */}
        {filteredCampaigns.length > 0 ? (
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Megaphone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{campaign.name}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{campaign.user_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{campaign.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Created {new Date(campaign.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      campaign.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : campaign.status === 'paused'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : campaign.status === 'completed'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <Megaphone className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Campaigns Found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No campaigns found in the system'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminCampaignsPage;
