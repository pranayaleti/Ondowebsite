import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/auth.js';
import { 
  MessageSquare, Loader, Search, Filter, Calendar, Mail, Phone, Building2, 
  Globe, MapPin, Clock, Tag, Edit, Save, X, CheckCircle, AlertCircle,
  DollarSign, TrendingUp, FileText, Eye, ExternalLink
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import { formatDateTimeMST } from '../../utils/dateFormat.js';

const ConsultationLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingLead, setEditingLead] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0,
    newThisWeek: 0
  });

  useEffect(() => {
    fetchLeads();
  }, [filterStatus]);

  useEffect(() => {
    filterLeads();
  }, [searchTerm, filterStatus, leads]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getConsultationLeads(filterStatus === 'all' ? null : filterStatus);
      setLeads(data.leads || []);
      setFilteredLeads(data.leads || []);
      
      // Calculate stats
      const total = data.leads?.length || 0;
      const newCount = data.leads?.filter(l => l.status === 'new').length || 0;
      const contactedCount = data.leads?.filter(l => l.status === 'contacted').length || 0;
      const convertedCount = data.leads?.filter(l => l.status === 'converted').length || 0;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const newThisWeek = data.leads?.filter(l => new Date(l.created_at) >= weekAgo).length || 0;
      
      setStats({
        total: data.total || 0,
        new: newCount,
        contacted: contactedCount,
        converted: convertedCount,
        newThisWeek
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.selected_plan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.qa_responses && JSON.stringify(lead.qa_responses).toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredLeads(filtered);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead.id);
    setEditFormData({
      status: lead.status || 'new',
      notes: lead.notes || ''
    });
  };

  const handleSave = async (leadId) => {
    try {
      await adminAPI.updateConsultationLead(leadId, editFormData);
      setEditingLead(null);
      fetchLeads();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditingLead(null);
    setEditFormData({});
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return formatDateTimeMST(dateString, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Consultation Leads - Admin" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Consultation Leads - Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Consultation Leads</h1>
          <p className="text-gray-400">Manage and track all consultation requests</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
            Error: {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              <span className="text-sm text-gray-400">Total Leads</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-gray-400">New</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.new}</h3>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-6 h-6 text-yellow-400" />
              <span className="text-sm text-gray-400">Contacted</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.contacted}</h3>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-sm text-gray-400">Converted</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.converted}</h3>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <span className="text-sm text-gray-400">This Week</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.newThisWeek}</h3>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, company, plan, or message..."
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
                className="w-full md:w-48 pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Showing {filteredLeads.length} of {stats.total} leads
          </p>
        </div>

        {/* Leads List */}
        {filteredLeads.length > 0 ? (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                      {lead.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{lead.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            lead.status === 'new'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : lead.status === 'contacted'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : lead.status === 'converted'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          {lead.status || 'new'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${lead.email}`} className="text-orange-400 hover:text-orange-300">
                            {lead.email}
                          </a>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${lead.phone}`} className="text-orange-400 hover:text-orange-300">
                              {lead.phone}
                            </a>
                          </div>
                        )}
                        {lead.company && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {lead.company}
                          </div>
                        )}
                        {lead.selected_plan && (
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            <span className="text-cyan-400">Plan: {lead.selected_plan}</span>
                            {lead.selected_plan_price && (
                              <span className="text-gray-500">({lead.selected_plan_price})</span>
                            )}
                          </div>
                        )}
                        {lead.budget && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-orange-400">Budget: {lead.budget}</span>
                          </div>
                        )}
                        {lead.timeline && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Timeline: {lead.timeline}</span>
                          </div>
                        )}
                        {lead.page_url && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <a 
                              href={lead.page_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
                            >
                              Source Page <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                        {lead.utm_medium && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs">UTM: {lead.utm_medium}</span>
                          </div>
                        )}
                      </div>
                      {lead.message && (
                        <div className="mt-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                          <p className="text-sm text-gray-300 whitespace-pre-wrap">{lead.message}</p>
                        </div>
                      )}
                      {lead.qa_responses && (
                        <div className="mt-3 p-4 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                          <p className="text-xs text-cyan-400 font-medium mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Q&A Responses
                          </p>
                          <div className="space-y-3">
                            {(() => {
                              try {
                                const qaData = typeof lead.qa_responses === 'string' 
                                  ? JSON.parse(lead.qa_responses) 
                                  : lead.qa_responses;
                                if (Array.isArray(qaData) && qaData.length > 0) {
                                  return qaData.map((qa, idx) => (
                                    <div key={idx} className="p-3 bg-gray-900/50 rounded border border-gray-700">
                                      <p className="text-xs font-medium text-cyan-300 mb-1">Q: {qa.question}</p>
                                      <p className="text-sm text-white">{qa.answer}</p>
                                    </div>
                                  ));
                                }
                                return null;
                              } catch (e) {
                                return null;
                              }
                            })()}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Submitted: {formatDate(lead.created_at)}
                        </div>
                        {lead.timezone && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {lead.timezone}
                          </div>
                        )}
                        {lead.session_id && (
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            Session: {lead.session_id.substring(0, 8)}...
                          </div>
                        )}
                      </div>
                      {lead.notes && (
                        <div className="mt-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                          <p className="text-xs text-yellow-400 font-medium mb-1">Admin Notes:</p>
                          <p className="text-sm text-yellow-300 whitespace-pre-wrap">{lead.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => editingLead === lead.id ? handleCancel() : handleEdit(lead)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  >
                    {editingLead === lead.id ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Edit className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {editingLead === lead.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                        <select
                          value={editFormData.status}
                          onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                        <textarea
                          value={editFormData.notes}
                          onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                          rows={3}
                          placeholder="Add notes about this lead for follow-up..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleSave(lead.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Leads Found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No consultation leads found yet'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultationLeadsPage;

