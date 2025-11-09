// Import centralized API configuration
import { API_URL } from './apiConfig';

// Auth API functions
export const authAPI = {
  async signup(email, password, name, additionalData = {}) {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        email, 
        password, 
        name,
        ...additionalData
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    return response.json();
  },

  async signin(email, password) {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signin failed');
    }

    return response.json();
  },

  async signout() {
    const response = await fetch(`${API_URL}/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Signout failed');
    }

    return response.json();
  },

  async getSession() {
    const response = await fetch(`${API_URL}/auth/session`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  async getNotifications() {
    const response = await fetch(`${API_URL}/admin/notifications`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  async markNotificationRead(notificationId) {
    const response = await fetch(`${API_URL}/admin/notifications/${notificationId}/read`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return response.json();
  },

  async markAllNotificationsRead() {
    const response = await fetch(`${API_URL}/admin/notifications/read-all`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return response.json();
  },
};

// Portal API functions
export const portalAPI = {
  async getDashboard() {
    const response = await fetch(`${API_URL}/portal/dashboard`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    return response.json();
  },

  async getSubscriptions() {
    const response = await fetch(`${API_URL}/portal/subscriptions`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    return response.json();
  },

  async createSubscription(planData) {
    const response = await fetch(`${API_URL}/portal/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(planData),
    });

    // Check content type
    const contentType = response.headers.get('content-type') || '';
    
    if (!contentType.includes('application/json')) {
      // Not JSON, read as text
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error(`Server error (${response.status}). Please refresh the page and try again.`);
    }

    // Parse JSON response
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to create subscription (${response.status})`);
    }

    return data;
  },

  async updateSubscription(subscriptionId, updates) {
    const response = await fetch(`${API_URL}/portal/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update subscription');
    }

    return response.json();
  },

  async getCampaigns() {
    const response = await fetch(`${API_URL}/portal/campaigns`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    return response.json();
  },

  async getAssets() {
    const response = await fetch(`${API_URL}/portal/assets`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }

    return response.json();
  },

  async getInvoices() {
    const response = await fetch(`${API_URL}/portal/invoices`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    return response.json();
  },

  async getInvoice(invoiceId) {
    const response = await fetch(`${API_URL}/portal/invoices/${invoiceId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }

    return response.json();
  },

  async uploadAsset(assetData) {
    const response = await fetch(`${API_URL}/portal/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(assetData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload asset');
    }

    return response.json();
  },

  async deleteAsset(assetId) {
    const response = await fetch(`${API_URL}/portal/assets/${assetId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete asset');
    }

    return response.json();
  },

  async createInvoice(invoiceData) {
    try {
      const response = await fetch(`${API_URL}/portal/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create invoice';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.status === 404 
            ? 'Invoice endpoint not found. Please check if the server is running.'
            : response.status === 401 || response.status === 403
            ? 'Authentication failed. Please sign in again.'
            : `Server error: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.message) {
        throw error;
      }
      // Network error
      throw new Error('Network error. Please check your connection and ensure the server is running.');
    }
  },

  async getNotifications() {
    const response = await fetch(`${API_URL}/portal/notifications`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  async markNotificationRead(notificationId) {
    const response = await fetch(`${API_URL}/portal/notifications/${notificationId}/read`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return response.json();
  },

  async markAllNotificationsRead() {
    const response = await fetch(`${API_URL}/portal/notifications/read-all`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return response.json();
  },

  async remindMeLater(notificationId, remindAt) {
    const response = await fetch(`${API_URL}/portal/notifications/${notificationId}/remind`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ remind_at: remindAt }),
    });

    if (!response.ok) {
      throw new Error('Failed to set reminder');
    }

    return response.json();
  },

  async dismissNotification(notificationId) {
    const response = await fetch(`${API_URL}/portal/notifications/${notificationId}/dismiss`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to dismiss notification');
    }

    return response.json();
  },
};

// Admin API functions
export const adminAPI = {
  async getDashboard() {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch admin dashboard');
    }

    return response.json();
  },

  async getUsers() {
    const response = await fetch(`${API_URL}/admin/users`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },

  async getCampaigns() {
    const response = await fetch(`${API_URL}/admin/campaigns`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    return response.json();
  },

  async getAnalytics() {
    const response = await fetch(`${API_URL}/admin/analytics`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    return response.json();
  },

  async getRequestAnalytics() {
    const response = await fetch(`${API_URL}/admin/request-analytics`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch request analytics');
    }

    return response.json();
  },

  async getUserAnalytics() {
    const response = await fetch(`${API_URL}/admin/user-analytics`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user analytics');
    }

    return response.json();
  },

  async updateUser(userId, updates) {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }

    return response.json();
  },

  async getInvoices() {
    const response = await fetch(`${API_URL}/admin/invoices`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    return response.json();
  },

  async getAssets() {
    const response = await fetch(`${API_URL}/admin/assets`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }

    return response.json();
  },

  async getInvoice(invoiceId) {
    const response = await fetch(`${API_URL}/admin/invoices/${invoiceId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }

    return response.json();
  },

  async createInvoice(invoiceData) {
    const response = await fetch(`${API_URL}/admin/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create invoice');
    }

    return response.json();
  },

  async updateInvoice(invoiceId, updates) {
    const response = await fetch(`${API_URL}/admin/invoices/${invoiceId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update invoice');
    }

    return response.json();
  },

  async getNotifications() {
    const response = await fetch(`${API_URL}/admin/notifications`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  async markNotificationRead(notificationId) {
    const response = await fetch(`${API_URL}/admin/notifications/${notificationId}/read`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return response.json();
  },

  async markAllNotificationsRead() {
    const response = await fetch(`${API_URL}/admin/notifications/read-all`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return response.json();
  },
};

// Ticket API functions
export const ticketAPI = {
  async createTicket(subject, description, type, priority, additionalData = {}) {
    const response = await fetch(`${API_URL}/portal/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        subject, 
        description, 
        type, 
        priority,
        ...additionalData
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create ticket');
    }

    return response.json();
  },

  async getTickets() {
    const response = await fetch(`${API_URL}/portal/tickets`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch tickets' }));
      throw new Error(error.error || 'Failed to fetch tickets');
    }

    return response.json();
  },

  async getTicket(id) {
    const response = await fetch(`${API_URL}/portal/tickets/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }

    return response.json();
  },

  async addMessage(ticketId, message) {
    const response = await fetch(`${API_URL}/portal/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add message');
    }

    return response.json();
  },

  async uploadAttachment(ticketId, fileData, messageId = null) {
    const response = await fetch(`${API_URL}/portal/tickets/${ticketId}/attachments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        file_name: fileData.name,
        file_url: fileData.url,
        file_type: fileData.type,
        file_size: fileData.size,
        message_id: messageId
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload attachment');
    }

    return response.json();
  },

  async getNotifications() {
    const response = await fetch(`${API_URL}/admin/notifications`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  async markNotificationRead(notificationId) {
    const response = await fetch(`${API_URL}/admin/notifications/${notificationId}/read`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return response.json();
  },

  async markAllNotificationsRead() {
    const response = await fetch(`${API_URL}/admin/notifications/read-all`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return response.json();
  },

  async remindMeLater(notificationId, remindAt) {
    const response = await fetch(`${API_URL}/admin/notifications/${notificationId}/remind`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ remind_at: remindAt }),
    });

    if (!response.ok) {
      throw new Error('Failed to set reminder');
    }

    return response.json();
  },

  async dismissNotification(notificationId) {
    const response = await fetch(`${API_URL}/admin/notifications/${notificationId}/dismiss`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to dismiss notification');
    }

    return response.json();
  },
};

// Admin ticket API functions
export const adminTicketAPI = {
  async getTickets() {
    const response = await fetch(`${API_URL}/admin/tickets`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return response.json();
  },

  async getTicket(id) {
    const response = await fetch(`${API_URL}/admin/tickets/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }

    return response.json();
  },

  async updateTicket(id, updates) {
    const response = await fetch(`${API_URL}/admin/tickets/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update ticket');
    }

    return response.json();
  },

  async addMessage(ticketId, message) {
    const response = await fetch(`${API_URL}/admin/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add message');
    }

    return response.json();
  },
};

