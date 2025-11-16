import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/auth.js';
import { Mail, Plus, Edit, Trash2, Eye, Loader, Search, X, Save, XCircle } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import EmailTemplatePreview from '../../components/EmailTemplatePreview';

const EmailTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewTemplateId, setPreviewTemplateId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [templateData, setTemplateData] = useState({
    name: '',
    subject: '',
    body_html: '',
    body_text: '',
    category: '',
    is_active: true
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.category && template.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates(templates);
    }
  }, [searchTerm, templates]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getEmailTemplatesAdmin();
      setTemplates(data.templates || []);
      setFilteredTemplates(data.templates || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch email templates');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setTemplateData({
      name: '',
      subject: '',
      body_html: '',
      body_text: '',
      category: '',
      is_active: true
    });
    setShowAddModal(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateData({
      name: template.name || '',
      subject: template.subject || '',
      body_html: template.body_html || '',
      body_text: template.body_text || '',
      category: template.category || '',
      is_active: template.is_active !== false
    });
    setShowEditModal(true);
  };

  const handleSaveTemplate = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!templateData.name.trim()) {
        setError('Template name is required');
        return;
      }
      if (!templateData.subject.trim()) {
        setError('Email subject is required');
        return;
      }
      if (!templateData.body_html.trim()) {
        setError('Email body (HTML) is required');
        return;
      }

      if (editingTemplate) {
        await adminAPI.updateEmailTemplate(editingTemplate.id, templateData);
      } else {
        await adminAPI.createEmailTemplate(templateData);
      }

      await fetchTemplates();
      setShowAddModal(false);
      setShowEditModal(false);
      setEditingTemplate(null);
      setTemplateData({
        name: '',
        subject: '',
        body_html: '',
        body_text: '',
        category: '',
        is_active: true
      });
    } catch (err) {
      setError(err.message || 'Failed to save email template');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deleteEmailTemplate(templateId);
      await fetchTemplates();
    } catch (err) {
      setError(err.message || 'Failed to delete email template');
    }
  };

  const handlePreviewTemplate = (templateId) => {
    setPreviewTemplateId(templateId);
    setShowPreview(true);
  };

  const categories = ['welcome', 'product', 'promotional', 'newsletter', 'transactional', 'event', 'feedback', 'other'];

  if (loading) {
    return (
      <>
        <SEOHead title="Email Templates - Admin" />
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Email Templates - Admin" />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="w-8 h-8 text-orange-500" />
                <h1 className="text-3xl font-bold text-white">Email Templates</h1>
              </div>
              <button
                onClick={handleAddTemplate}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Template
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates by name, subject, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {searchTerm ? 'No templates found matching your search' : 'No email templates yet'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddTemplate}
                  className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  Create Your First Template
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-orange-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">{template.name}</h3>
                      {template.category && (
                        <span className="inline-block px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                          {template.category}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {template.is_active ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded">Inactive</span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{template.subject}</p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreviewTemplate(template.id)}
                      className="flex-1 px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                      title="Edit template"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                      title="Delete template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Template Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add Email Template</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <TemplateForm
                  templateData={templateData}
                  setTemplateData={setTemplateData}
                  categories={categories}
                  error={error}
                />
              </div>

              <div className="bg-gray-900/50 p-6 flex items-center justify-end gap-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Template
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Template Modal */}
        {showEditModal && editingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Email Template</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTemplate(null);
                    setError(null);
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <TemplateForm
                  templateData={templateData}
                  setTemplateData={setTemplateData}
                  categories={categories}
                  error={error}
                />
              </div>

              <div className="bg-gray-900/50 p-6 flex items-center justify-end gap-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTemplate(null);
                    setError(null);
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Template
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
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

// Template Form Component
const TemplateForm = ({ templateData, setTemplateData, categories, error }) => {
  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Template Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={templateData.name}
            onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
            placeholder="e.g., Welcome Campaign"
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            value={templateData.category}
            onChange={(e) => setTemplateData({ ...templateData, category: e.target.value })}
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Subject <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={templateData.subject}
          onChange={(e) => setTemplateData({ ...templateData, subject: e.target.value })}
          placeholder="e.g., Welcome to {{company_name}}!"
          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-500 mt-1">You can use placeholders like {'{{name}}'}, {'{{company_name}}'}, etc.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Body (HTML) <span className="text-red-400">*</span>
        </label>
        <textarea
          value={templateData.body_html}
          onChange={(e) => setTemplateData({ ...templateData, body_html: e.target.value })}
          placeholder="Enter HTML content for the email..."
          rows={12}
          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-500 mt-1">Use HTML to format your email. Placeholders will be replaced with actual data.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Body (Plain Text) <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <textarea
          value={templateData.body_text}
          onChange={(e) => setTemplateData({ ...templateData, body_text: e.target.value })}
          placeholder="Enter plain text version of the email..."
          rows={6}
          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-xs text-gray-500 mt-1">Plain text version for email clients that don't support HTML.</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={templateData.is_active}
          onChange={(e) => setTemplateData({ ...templateData, is_active: e.target.checked })}
          className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
        />
        <label htmlFor="is_active" className="text-sm text-gray-300">
          Template is active (visible in campaign creation)
        </label>
      </div>
    </div>
  );
};

export default EmailTemplatesPage;

