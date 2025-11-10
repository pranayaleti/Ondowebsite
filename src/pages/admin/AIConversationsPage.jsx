import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/auth';
import { 
  MessageSquare, 
  Loader, 
  Search, 
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Bot,
  ArrowRight,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  ExternalLink
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const AIConversationsPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchConversations();
    fetchAnalytics();
  }, [filters]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAIConversations(
        filters.status || null,
        100,
        0,
        filters.search || null
      );
      setConversations(data.conversations);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await adminAPI.getAIConversationsAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleViewConversation = async (id) => {
    try {
      const data = await adminAPI.getAIConversation(id);
      setSelectedConversation(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading && !conversations.length) {
    return (
      <>
        <SEOHead title="AI Conversations - Admin" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="AI Conversations - Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Conversations</h1>
          <p className="text-gray-400">View and analyze all AI chat conversations with Arjun</p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {analytics.totalConversations}
              </h3>
              <p className="text-sm text-gray-400">Total Conversations</p>
              <p className="text-xs text-gray-500 mt-2">
                {analytics.activeConversations} active
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {analytics.totalMessages}
              </h3>
              <p className="text-sm text-gray-400">Total Messages</p>
              <p className="text-xs text-gray-500 mt-2">
                Avg: {analytics.avgMessages} per conversation
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {formatDuration(analytics.avgDuration)}
              </h3>
              <p className="text-sm text-gray-400">Avg Duration</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {analytics.byStatus?.find(s => s.status === 'active')?.count || 0}
              </h3>
              <p className="text-sm text-gray-400">Active Now</p>
            </div>
            
            {analytics.feedback && (
              <>
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <ThumbsUp className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {analytics.feedback.positive}
                  </h3>
                  <p className="text-sm text-gray-400">Thumbs Up</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {analytics.feedback.score}% positive
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <ThumbsDown className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {analytics.feedback.negative}
                  </h3>
                  <p className="text-sm text-gray-400">Thumbs Down</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {analytics.feedback.total} total feedback
                  </p>
                </div>
              </>
            )}
            
            {analytics.linkClicks > 0 && (
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <ExternalLink className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  {analytics.linkClicks}
                </h3>
                <p className="text-sm text-gray-400">Link Clicks</p>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email, name, or session ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Conversations ({total})</h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-4">
              Error: {error}
            </div>
          )}

          {conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No conversations found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => handleViewConversation(conv.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">
                            {conv.name || conv.user_name || conv.email || conv.user_email || 'Anonymous'}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {conv.email || conv.user_email || 'No email'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {conv.total_messages} messages
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(conv.started_at)}
                        </span>
                        {conv.conversation_duration_seconds && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(conv.conversation_duration_seconds)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          conv.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {conv.status || 'active'}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversation Detail Modal */}
        {selectedConversation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Conversation Details</h2>
                  <p className="text-sm text-green-100 mt-1">
                    {formatDate(selectedConversation.conversation.started_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Conversation Info */}
                <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">Conversation Info</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className="text-white font-medium">{selectedConversation.conversation.status}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Total Messages</p>
                      <p className="text-white font-medium">{selectedConversation.conversation.total_messages}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">User Messages</p>
                      <p className="text-white font-medium">{selectedConversation.conversation.total_user_messages}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">AI Messages</p>
                      <p className="text-white font-medium">{selectedConversation.conversation.total_ai_messages}</p>
                    </div>
                    {selectedConversation.conversation.conversation_duration_seconds && (
                      <div>
                        <p className="text-gray-400">Duration</p>
                        <p className="text-white font-medium">
                          {formatDuration(selectedConversation.conversation.conversation_duration_seconds)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-400">Session ID</p>
                      <p className="text-white font-medium text-xs">{selectedConversation.conversation.session_id}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">Messages</h3>
                  <div className="space-y-4">
                    {selectedConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'user'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-700 text-white'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatDate(msg.created_at)}
                          </p>
                        </div>
                        {msg.role === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytics Events */}
                {selectedConversation.analytics && selectedConversation.analytics.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Analytics Events & Feedback</h3>
                    <div className="space-y-2">
                      {selectedConversation.analytics.map((event, idx) => {
                        const eventData = typeof event.event_data === 'string' 
                          ? JSON.parse(event.event_data) 
                          : event.event_data;
                        
                        return (
                          <div key={idx} className="bg-gray-900/50 rounded-lg p-3 text-sm border border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-white font-medium capitalize">
                                {event.event_type === 'feedback' 
                                  ? (eventData.feedback === 'positive' ? '👍 Thumbs Up' : '👎 Thumbs Down')
                                  : event.event_type === 'link_click'
                                  ? '🔗 Link Clicked'
                                  : event.event_type}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {formatDate(event.timestamp)}
                              </p>
                            </div>
                            
                            {event.event_type === 'feedback' && eventData.messageContent && (
                              <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs">
                                <p className="text-gray-300 mb-1">Message:</p>
                                <p className="text-gray-400 whitespace-pre-wrap">{eventData.messageContent}</p>
                              </div>
                            )}
                            
                            {event.event_type === 'link_click' && eventData.linkUrl && (
                              <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs">
                                <p className="text-gray-300 mb-1">Link:</p>
                                <a 
                                  href={eventData.linkUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-orange-400 hover:text-orange-300 underline break-all"
                                >
                                  {eventData.linkUrl}
                                </a>
                              </div>
                            )}
                            
                            {eventData.messageId && (
                              <p className="text-gray-500 text-xs mt-1">
                                Message ID: {eventData.messageId}
                              </p>
                            )}
                          </div>
                        );
                      })}
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

export default AIConversationsPage;

