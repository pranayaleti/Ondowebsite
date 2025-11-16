import { useState, useEffect } from 'react';
import { portalAPI } from '../../utils/auth.js';
import { Megaphone, Loader, Plus, X, Eye } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import EmailTemplatePreview from '../../components/EmailTemplatePreview';
import { formatDateTimeUserTimezone } from '../../utils/dateFormat.js';

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCampaignData, setNewCampaignData] = useState({
    name: '',
    status: 'active',
    email_template_id: ''
  });
  const [creating, setCreating] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [previewTemplateId, setPreviewTemplateId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchEmailTemplates();
  }, []);

  const fetchEmailTemplates = async () => {
    try {
      const data = await portalAPI.getEmailTemplates();
      setEmailTemplates(data.templates || []);
    } catch (err) {
      console.error('Error fetching email templates:', err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await portalAPI.getCampaigns();
      setCampaigns(data.campaigns);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCampaign = async () => {
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
      await portalAPI.createCampaign(campaignData);
      setShowAddModal(false);
      setNewCampaignData({
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

  if (loading) {
    return (
      <>
        <SEOHead title="Campaigns - Dashboard" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Campaigns - Dashboard" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Campaigns</h1>
            <p className="text-gray-400">View and manage your campaigns</p>
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

        {campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Megaphone className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                      <p className="text-sm text-gray-400">
                        Created: {formatDateTimeUserTimezone(campaign.created_at)}
                      </p>
                      {campaign.template_name && (
                        <p className="text-xs text-cyan-400 mt-1">
                          Template: {campaign.template_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {campaign.email_template_id && (
                      <button
                        onClick={() => {
                          setPreviewTemplateId(campaign.email_template_id);
                          setShowPreview(true);
                        }}
                        className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
                        title="Preview email template"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>
                    )}
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <Megaphone className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Campaigns</h3>
            <p className="text-gray-400">You don't have any campaigns yet.</p>
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
                  disabled={creating || !newCampaignData.name.trim() || !newCampaignData.email_template_id}
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
          isAdmin={false}
        />
      </div>
    </>
  );
};

export default CampaignsPage;

