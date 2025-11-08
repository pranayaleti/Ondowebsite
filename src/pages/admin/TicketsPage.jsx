import React, { useState, useEffect } from 'react';
import { adminTicketAPI } from '../../utils/auth';
import { 
  MessageSquare, 
  Loader, 
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Building2,
  Tag,
  DollarSign,
  Calendar as CalendarIcon,
  Edit,
  Save,
  X
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterEmailRequest, setFilterEmailRequest] = useState('');
  const [editingTicket, setEditingTicket] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [searchTerm, filterStatus, filterPriority, filterProject, filterCategory, filterEmailRequest, tickets]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await adminTicketAPI.getTickets();
      setTickets(data.tickets);
      setFilteredTickets(data.tickets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === filterPriority);
    }

    if (filterProject !== 'all') {
      filtered = filtered.filter(ticket => ticket.project_name === filterProject);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === filterCategory);
    }

    if (filterEmailRequest) {
      filtered = filtered.filter(ticket =>
        ticket.email_request?.toLowerCase().includes(filterEmailRequest.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredTickets(filtered);
  };

  const fetchTicketDetails = async (id) => {
    try {
      const data = await adminTicketAPI.getTicket(id);
      setTicketDetails(data);
      setSelectedTicket(id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTicket = async (updates) => {
    try {
      await adminTicketAPI.updateTicket(selectedTicket, updates);
      fetchTicketDetails(selectedTicket);
      fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (ticket) => {
    setEditingTicket(ticket.id);
    setEditFormData({
      priority: ticket.priority || 'medium',
      status: ticket.status || 'open',
      project_name: ticket.project_name || '',
      email_request: ticket.email_request || '',
      category: ticket.category || '',
      due_date: ticket.due_date ? ticket.due_date.split('T')[0] : '',
      estimated_hours: ticket.estimated_hours || '',
      actual_hours: ticket.actual_hours || '',
      budget: ticket.budget || '',
      tags: ticket.tags || ''
    });
  };

  const handleSave = async (ticketId) => {
    try {
      await adminTicketAPI.updateTicket(ticketId, editFormData);
      setEditingTicket(null);
      fetchTickets();
      if (selectedTicket === ticketId) {
        fetchTicketDetails(ticketId);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditingTicket(null);
    setEditFormData({});
  };

  const getUniqueValues = (field) => {
    return [...new Set(tickets.map(t => t[field]).filter(Boolean))].sort();
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    try {
      await adminTicketAPI.addMessage(selectedTicket, newMessage);
      setNewMessage('');
      fetchTicketDetails(selectedTicket);
      fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'high':
        return 'bg-orange-500/20 text-orange-400';
      case 'urgent':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length,
    highPriority: tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length,
    withProject: tickets.filter(t => t.project_name).length,
    overdue: tickets.filter(t => {
      if (!t.due_date) return false;
      return new Date(t.due_date) < new Date() && t.status !== 'resolved' && t.status !== 'closed';
    }).length
  };

  if (loading && !ticketDetails) {
    return (
      <>
        <SEOHead title="Tickets - Admin" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  if (selectedTicket && ticketDetails) {
    return (
      <>
        <SEOHead title="Ticket Details - Admin" />
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => {
                setSelectedTicket(null);
                setTicketDetails(null);
              }}
              className="text-orange-500 hover:text-orange-400 flex items-center gap-2 mb-4"
            >
              ← Back to Tickets
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">{ticketDetails.ticket.subject}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticketDetails.ticket.status)}`}>
                {ticketDetails.ticket.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticketDetails.ticket.priority)}`}>
                {ticketDetails.ticket.priority} priority
              </span>
              <span className="text-sm text-gray-400">
                Created {new Date(ticketDetails.ticket.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{ticketDetails.ticket.user_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{ticketDetails.ticket.user_email}</span>
              </div>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Ticket Details</h2>
              <button
                onClick={() => editingTicket === ticketDetails.ticket.id ? handleCancel() : handleEdit(ticketDetails.ticket)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                {editingTicket === ticketDetails.ticket.id ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Edit className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {editingTicket === ticketDetails.ticket.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={editFormData.project_name}
                    onChange={(e) => setEditFormData({...editFormData, project_name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Request</label>
                  <input
                    type="email"
                    value={editFormData.email_request}
                    onChange={(e) => setEditFormData({...editFormData, email_request: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                  >
                    <option value="">Select category</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={editFormData.due_date}
                    onChange={(e) => setEditFormData({...editFormData, due_date: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editFormData.estimated_hours}
                    onChange={(e) => setEditFormData({...editFormData, estimated_hours: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Actual Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editFormData.actual_hours}
                    onChange={(e) => setEditFormData({...editFormData, actual_hours: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.budget}
                    onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editFormData.tags}
                    onChange={(e) => setEditFormData({...editFormData, tags: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleSave(ticketDetails.ticket.id)}
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <select
                    value={ticketDetails.ticket.status}
                    onChange={(e) => handleUpdateTicket({ status: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Priority</label>
                  <select
                    value={ticketDetails.ticket.priority}
                    onChange={(e) => handleUpdateTicket({ priority: e.target.value })}
                    className="w-full mt-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                {ticketDetails.ticket.project_name && (
                  <div>
                    <label className="text-sm text-gray-400">Project Name</label>
                    <p className="text-white mt-1">{ticketDetails.ticket.project_name}</p>
                  </div>
                )}
                {ticketDetails.ticket.email_request && (
                  <div>
                    <label className="text-sm text-gray-400">Email Request</label>
                    <p className="text-white mt-1">{ticketDetails.ticket.email_request}</p>
                  </div>
                )}
                {ticketDetails.ticket.category && (
                  <div>
                    <label className="text-sm text-gray-400">Category</label>
                    <p className="text-white mt-1">{ticketDetails.ticket.category}</p>
                  </div>
                )}
                {ticketDetails.ticket.due_date && (
                  <div>
                    <label className="text-sm text-gray-400">Due Date</label>
                    <p className={`mt-1 ${
                      new Date(ticketDetails.ticket.due_date) < new Date() && ticketDetails.ticket.status !== 'resolved' && ticketDetails.ticket.status !== 'closed'
                        ? 'text-red-400'
                        : 'text-white'
                    }`}>
                      {new Date(ticketDetails.ticket.due_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {ticketDetails.ticket.estimated_hours && (
                  <div>
                    <label className="text-sm text-gray-400">Estimated Hours</label>
                    <p className="text-white mt-1">{ticketDetails.ticket.estimated_hours}</p>
                  </div>
                )}
                {ticketDetails.ticket.actual_hours && (
                  <div>
                    <label className="text-sm text-gray-400">Actual Hours</label>
                    <p className="text-white mt-1">{ticketDetails.ticket.actual_hours}</p>
                  </div>
                )}
                {ticketDetails.ticket.budget && (
                  <div>
                    <label className="text-sm text-gray-400">Budget</label>
                    <p className="text-white mt-1">${parseFloat(ticketDetails.ticket.budget).toFixed(2)}</p>
                  </div>
                )}
                {ticketDetails.ticket.tags && (
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-400">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {ticketDetails.ticket.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Description</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{ticketDetails.ticket.description}</p>
          </div>

          {/* Messages */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
            <div className="space-y-4">
              {ticketDetails.messages && ticketDetails.messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border ${
                    message.is_admin
                      ? 'bg-orange-500/10 border-orange-500/30 ml-8'
                      : 'bg-gray-900/50 border-gray-700 mr-8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{message.name}</span>
                      {message.is_admin && (
                        <span className="px-2 py-0.5 rounded text-xs bg-orange-500/20 text-orange-400">
                          Admin
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap">{message.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          {ticketDetails.attachments && ticketDetails.attachments.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Attachments</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ticketDetails.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                  >
                    {attachment.file_type?.startsWith('image/') ? (
                      <img
                        src={attachment.file_url}
                        alt={attachment.file_name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-800 rounded mb-2 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">File</span>
                      </div>
                    )}
                    <p className="text-sm text-white truncate">{attachment.file_name}</p>
                    <a
                      href={attachment.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-500 hover:text-orange-400 mt-2 inline-block"
                    >
                      View →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Message */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Reply to Ticket</h2>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your response..."
              className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
              rows={4}
            />
            <button
              onClick={handleAddMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Send Reply
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Tickets - Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tickets Management</h1>
          <p className="text-gray-400">Manage all support tickets and requests</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
            Error: {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-yellow-400" />
              <span className="text-sm text-gray-400">Open</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.open}</h3>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-orange-400" />
              <span className="text-sm text-gray-400">High Priority</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.highPriority}</h3>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="w-6 h-6 text-red-400" />
              <span className="text-sm text-gray-400">Overdue</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.overdue}</h3>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by subject, user name, email, project name, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Projects</option>
                  {getUniqueValues('project_name').map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {getUniqueValues('category').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Filter by email request..."
                  value={filterEmailRequest}
                  onChange={(e) => setFilterEmailRequest(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </p>
        </div>

        {/* Tickets List */}
        {filteredTickets.length > 0 ? (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => fetchTicketDetails(ticket.id)}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{ticket.subject}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>{ticket.user_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>{ticket.user_email}</span>
                      </div>
                      {ticket.project_name && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                          <Building2 className="w-3 h-3" />
                          {ticket.project_name}
                        </span>
                      )}
                      {ticket.email_request && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                          <Mail className="w-3 h-3" />
                          {ticket.email_request}
                        </span>
                      )}
                      {ticket.category && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          <Tag className="w-3 h-3" />
                          {ticket.category}
                        </span>
                      )}
                      {ticket.due_date && (
                        <span className={`flex items-center gap-1 px-2 py-1 rounded ${
                          new Date(ticket.due_date) < new Date() && ticket.status !== 'resolved' && ticket.status !== 'closed'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          <CalendarIcon className="w-3 h-3" />
                          Due: {new Date(ticket.due_date).toLocaleDateString()}
                        </span>
                      )}
                      {ticket.budget && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          <DollarSign className="w-3 h-3" />
                          ${parseFloat(ticket.budget).toFixed(2)}
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{ticket.description}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Tickets Found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No tickets found in the system'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminTicketsPage;

