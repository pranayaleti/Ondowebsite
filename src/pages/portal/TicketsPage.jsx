import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketAPI } from '../../utils/auth';
import { 
  MessageSquare, 
  Plus, 
  Loader, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Paperclip,
  Image as ImageIcon,
  FileText,
  ArrowRight
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    type: 'support',
    priority: 'medium',
    project_name: '',
    email_request: '',
    category: '',
    due_date: '',
    estimated_hours: '',
    budget: '',
    tags: ''
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketAPI.getTickets();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message || 'Failed to fetch tickets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (id) => {
    try {
      const data = await ticketAPI.getTicket(id);
      setTicketDetails(data);
      setSelectedTicket(id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const additionalData = {
        project_name: formData.project_name || null,
        email_request: formData.email_request || null,
        category: formData.category || null,
        due_date: formData.due_date || null,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        tags: formData.tags || null
      };
      await ticketAPI.createTicket(
        formData.subject,
        formData.description,
        formData.type,
        formData.priority,
        additionalData
      );
      setShowCreateModal(false);
      setFormData({ 
        subject: '', 
        description: '', 
        type: 'support', 
        priority: 'medium',
        project_name: '',
        email_request: '',
        category: '',
        due_date: '',
        estimated_hours: '',
        budget: '',
        tags: ''
      });
      fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    try {
      await ticketAPI.addMessage(selectedTicket, newMessage);
      setNewMessage('');
      fetchTicketDetails(selectedTicket);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileUpload = async (e, ticketId) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      // Convert file to base64 for now (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        await ticketAPI.uploadAttachment(ticketId, {
          name: file.name,
          url: base64String,
          type: file.type,
          size: file.size
        });
        setUploadingFile(false);
        if (selectedTicket) {
          fetchTicketDetails(selectedTicket);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message);
      setUploadingFile(false);
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

  if (loading && !ticketDetails) {
    return (
      <>
        <SEOHead title="Tickets - Portal" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  if (selectedTicket && ticketDetails) {
    return (
      <>
        <SEOHead title="Ticket Details - Portal" />
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
            <div className="flex items-center gap-4">
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
                      <FileText className="w-12 h-12 text-gray-500 mx-auto mb-2" />
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
            <h2 className="text-xl font-bold text-white mb-4">Add Message</h2>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
              rows={4}
            />
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, selectedTicket)}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                  <Paperclip className="w-4 h-4" />
                  {uploadingFile ? 'Uploading...' : 'Attach File'}
                </div>
              </label>
              <button
                onClick={handleAddMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Send Message
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Tickets - Portal" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Support Tickets</h1>
            <p className="text-gray-400">Raise tickets for support, improvements, or enhancements</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Ticket
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
            Error: {error}
          </div>
        )}

        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map((ticket) => (
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
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">{ticket.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Created {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {ticket.type}
                      </span>
                      {ticket.project_name && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          Project: {ticket.project_name}
                        </span>
                      )}
                      {ticket.email_request && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                          Email: {ticket.email_request}
                        </span>
                      )}
                      {ticket.category && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                          {ticket.category}
                        </span>
                      )}
                      {ticket.due_date && (
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">
                          Due: {new Date(ticket.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Tickets</h3>
            <p className="text-gray-400 mb-6">You haven't created any tickets yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Your First Ticket
            </button>
          </div>
        )}

        {/* Create Ticket Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Ticket</h2>
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Brief description of your request"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="support">Support</option>
                    <option value="improvement">Improvement Request</option>
                    <option value="enhancement">Feature Enhancement</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Describe your request in detail. You can attach screenshots after creating the ticket."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.project_name}
                      onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Project name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Request (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email_request}
                      onChange={(e) => setFormData({ ...formData, email_request: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category (Optional)
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estimated Hours (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.estimated_hours}
                      onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Budget (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tags (Optional, comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full p-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    Create Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TicketsPage;

