import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { portalAPI, adminAPI } from '../utils/auth.js';
import { useAuth } from '../contexts/AuthContext';

const NotificationCenter = () => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, isAdmin]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = isAdmin 
        ? await adminAPI.getNotifications()
        : await portalAPI.getNotifications();
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
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const notificationsPath = isAdmin ? '/admin/notifications' : '/dashboard/notifications';
  const isActive = location.pathname === notificationsPath;

  return (
    <Link
      to={notificationsPath}
      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
        isActive
          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
      aria-label="Notifications"
    >
      <Bell className="w-4 h-4 flex-shrink-0" />
      <span className="truncate flex-1 text-left">Notifications</span>
      {unreadCount > 0 && (
        <span className="w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationCenter;
