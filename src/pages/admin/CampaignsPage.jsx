import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/auth';
import { Megaphone, Loader, Search, Filter, Calendar, User, Mail, Plus, X, Eye } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import EmailTemplatePreview from '../../components/EmailTemplatePreview';

const AdminCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCampaignData, setNewCampaignData] = useState({
    user_id: '',
    name: '',
    status: 'active',
    email_template_id: ''
  });
  const [creating, setCreating] = useState(false);
  const [users, setUsers] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [previewTemplateId, setPreviewTemplateId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchUsers();
    fetchEmailTemplates();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchEmailTemplates = async () => {
    try {
      const data = await adminAPI.getEmailTemplates();
      setEmailTemplates(data.templates || []);
    } catch (err) {
      console.error('Error fetching email templates:', err);
    }
  };

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

  const handleAddCampaign = async () => {
    if (!newCampaignData.user_id) {
      setError('Please select a user');
      return;
    }

    if (!newCampaignData.name || !newCampaignData.name.trim()) {
      setError('Campaign name is required');
      return;
    }

    if (!newCampaignData.email_template_id) {
      setError('Please select an email template');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const campaignData = {
        ...newCampaignData,
        email_template_id: parseInt(newCampaignData.email_template_id)
      };
      await adminAPI.createCampaign(campaignData);
      setShowAddModal(false);
      setNewCampaignData({
        user_id: '',
        name: '',
        status: 'active',
        email_template_id: ''
      });
      fetchCampaigns();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Campaigns Management</h1>
            <p className="text-gray-400">View and manage all platform campaigns</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Campaign
          </button>
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
                        {campaign.template_name && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400">Template: {campaign.template_name}</span>
                          </div>
                        )}
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

        {/* Add Campaign Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Add New Campaign</h2>
                  <p className="text-sm text-orange-100 mt-1">Create a new campaign</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                    setNewCampaignData({
                      user_id: '',
                      name: '',
                      status: 'active',
                      email_template_id: ''
                    });
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* User Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Client <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={newCampaignData.user_id}
                      onChange={(e) => setNewCampaignData({...newCampaignData, user_id: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select a client</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Campaign Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Campaign Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCampaignData.name}
                      onChange={(e) => setNewCampaignData({...newCampaignData, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter campaign name"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={newCampaignData.status}
                      onChange={(e) => setNewCampaignData({...newCampaignData, status: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Email Template */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Template <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <select
                          value={newCampaignData.email_template_id}
                          onChange={(e) => setNewCampaignData({...newCampaignData, email_template_id: e.target.value})}
                          className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        >
                          <option value="">Select a template</option>
                          {emailTemplates.map(template => (
                            <option key={template.id} value={template.id}>
                              {template.name} {template.category ? `(${template.category})` : ''}
                            </option>
                          ))}
                        </select>
                        {newCampaignData.email_template_id && (
                          <button
                            type="button"
                            onClick={() => {
                              const selectedTemplate = emailTemplates.find(t => t.id === parseInt(newCampaignData.email_template_id));
                              if (selectedTemplate) {
                                console.log('Previewing template:', selectedTemplate.name, 'ID:', selectedTemplate.id);
                              }
                              setPreviewTemplateId(newCampaignData.email_template_id);
                              setShowPreview(true);
                            }}
                            className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0"
                            title="Preview template"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">Preview</span>
                          </button>
                        )}
                      </div>
                    </div>
                    {newCampaignData.email_template_id && (
                      <div className="mt-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <p className="text-xs text-gray-400 mb-1">Subject:</p>
                        <p className="text-sm text-white">
                          {emailTemplates.find(t => t.id === parseInt(newCampaignData.email_template_id))?.subject}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const selectedTemplate = emailTemplates.find(t => t.id === parseInt(newCampaignData.email_template_id));
                            if (selectedTemplate) {
                              console.log('Previewing template:', selectedTemplate.name, 'ID:', selectedTemplate.id);
                            }
                            setPreviewTemplateId(newCampaignData.email_template_id);
                            setShowPreview(true);
                          }}
                          className="text-xs text-cyan-400 hover:text-cyan-300 mt-2 underline cursor-pointer"
                        >
                          Click here to preview the full email template
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-900/50 p-6 flex items-center justify-end gap-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                    setNewCampaignData({
                      user_id: '',
                      name: '',
                      status: 'active',
                      email_template_id: ''
                    });
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCampaign}
                  disabled={creating || !newCampaignData.user_id || !newCampaignData.name.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Campaign
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Template Preview Modal */}
        <EmailTemplatePreview
          templateId={previewTemplateId}
          isOpen={showPreview}
          onClose={() => {
            setShowPreview(false);
            setPreviewTemplateId(null);
          }}
          isAdmin={true}
        />
      </div>
    </>
  );
};

export default AdminCampaignsPage;
