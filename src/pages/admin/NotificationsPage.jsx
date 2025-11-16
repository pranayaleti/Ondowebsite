import { useState, useEffect } from 'react';
import { Bell, MessageSquare, FileText, AlertCircle, CheckCircle2, Clock, Trash2, CheckCheck, X } from 'lucide-react';
import { adminAPI } from '../../utils/auth.js';
import { useAuth } from '../../contexts/AuthContext';
import SEOHead from '../../components/SEOHead';
import { useNavigate } from 'react-router-dom';
import { formatDateTimeMST } from '../../utils/dateFormat.js';

const AdminNotificationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getNotifications();
      // Filter out dismissed notifications and those with future remind_at dates
      const now = new Date();
      const filtered = (data.notifications || []).filter(n => {
        if (n.is_dismissed) return false;
        if (n.remind_at) {
          const remindDate = new Date(n.remind_at);
          return remindDate <= now;
        }
        return true;
      });
      setNotifications(filtered);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await adminAPI.markNotificationRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await adminAPI.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const remindMeLater = async (notificationId, hours = 24) => {
    try {
      const remindAt = new Date();
      remindAt.setHours(remindAt.getHours() + hours);
      
      await adminAPI.remindMeLater(notificationId, remindAt.toISOString());
      
      // Remove from current list (will reappear after remind_at time)
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Failed to set reminder:', err);
    }
  };

  const dismissNotification = async (notificationId) => {
    try {
      await adminAPI.dismissNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Failed to dismiss notification:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ticket_message':
      case 'ticket_update':
        return <MessageSquare className="w-5 h-5" />;
      case 'invoice':
        return <FileText className="w-5 h-5" />;
      case 'subscription':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'ticket_message':
      case 'ticket_update':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'invoice':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'subscription':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <>
      <SEOHead 
        title="Notifications | Admin"
        description="View and manage your notifications"
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-gray-400">
              {unreadCount > 0 
                ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : 'All caught up! No unread notifications.'
              }
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-colors flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-400">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-600 opacity-50" />
            <p className="text-xl font-medium text-white mb-2">No notifications</p>
            <p className="text-gray-400">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border transition-colors ${
                  !notification.is_read 
                    ? 'border-orange-500/30 bg-orange-500/5' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} flex-shrink-0`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTimeMST(notification.created_at)}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <span className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="px-4 py-2 text-sm text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => remindMeLater(notification.id, 24)}
                    className="px-4 py-2 text-sm text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors flex items-center gap-2"
                    title="Remind me in 24 hours"
                  >
                    <Clock className="w-4 h-4" />
                    Remind later
                  </button>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="px-4 py-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    title="Dismiss"
                  >
                    <Trash2 className="w-4 h-4" />
                    Dismiss
                  </button>
                  {notification.link && (
                    <button
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead(notification.id);
                        }
                        navigate(notification.link);
                      }}
                      className="ml-auto px-4 py-2 text-sm text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminNotificationsPage;

