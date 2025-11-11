// Import centralized API configuration
import { API_URL } from './apiConfig';

// Token storage utilities
const TOKEN_KEY = 'ondosoft_auth_token';

export const tokenStorage = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error reading token from localStorage:', error);
      return null;
    }
  },
  set: (token) => {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error storing token in localStorage:', error);
    }
  },
  remove: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token from localStorage:', error);
    }
  }
};

// Helper function to get headers with token
const getAuthHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  
  const token = tokenStorage.get();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to make authenticated fetch requests
const authenticatedFetch = async (url, options = {}) => {
  const headers = getAuthHeaders(options.headers);
  
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  // If 401, remove token as it's invalid
  if (response.status === 401) {
    tokenStorage.remove();
    // Redirect to login if not already there
    if (!window.location.pathname.includes('/auth/signin')) {
      window.location.href = '/auth/signin';
    }
  }
  
  return response;
};

// Auth API functions
export const authAPI = {
  async signup(email, password, name, additionalData = {}) {
    try {
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
        let errorMessage = 'Signup failed';
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const error = await response.json();
            errorMessage = error.error || errorMessage;
          } else {
            const text = await response.text();
            if (text) {
              // Check if it's an HTML error page (405, 404, etc.)
              if (text.includes('405') || text.includes('Not Allowed') || text.includes('<!DOCTYPE html>')) {
                errorMessage = 'Backend API is not configured or not accessible. Please ensure the backend server is deployed and VITE_API_URL is set correctly in production.';
              } else if (text.includes('404') || text.includes('Not Found')) {
                errorMessage = 'API endpoint not found. Please check that the backend server is deployed and accessible.';
              } else {
                errorMessage = text.substring(0, 200);
              }
            } else if (response.status === 0 || response.status === 502 || response.status === 503 || response.status === 500) {
              errorMessage = 'Backend server is not running. Please start the server and try again.';
            } else if (response.status === 405) {
              errorMessage = 'Backend API is not configured or not accessible. Please ensure the backend server is deployed and VITE_API_URL is set correctly in production.';
            } else {
              errorMessage = `Server error (${response.status}). Please check if the server is running.`;
            }
          }
        } catch (e) {
          // If response is not JSON or empty, provide a helpful error message
          if (response.status === 0 || response.status === 502 || response.status === 503 || response.status === 500) {
            errorMessage = 'Backend server is not running. Please start the server and try again.';
          } else if (response.status === 405) {
            errorMessage = 'API endpoint not configured. Please set VITE_API_URL environment variable to your production backend URL.';
          } else {
            errorMessage = `Server error (${response.status}). Please check if the server is running.`;
          }
        }
        throw new Error(errorMessage);
      }

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response format. Server may not be running properly. ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      
      // Store token in localStorage if provided
      if (data.token) {
        tokenStorage.set(data.token);
      }
      
      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and ensure the backend server is running on port 5001.');
      }
      throw error;
    }
  },

  async signin(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Signin failed';
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const error = await response.json();
            errorMessage = error.error || errorMessage;
          } else {
            const text = await response.text();
            if (text) {
              // Check if it's an HTML error page (405, 404, etc.)
              if (text.includes('405') || text.includes('Not Allowed') || text.includes('<!DOCTYPE html>')) {
                errorMessage = 'Backend API is not configured or not accessible. Please ensure the backend server is deployed and VITE_API_URL is set correctly in production.';
              } else if (text.includes('404') || text.includes('Not Found')) {
                errorMessage = 'API endpoint not found. Please check that the backend server is deployed and accessible.';
              } else {
                errorMessage = text.substring(0, 200);
              }
            } else if (response.status === 0 || response.status === 502 || response.status === 503 || response.status === 500) {
              errorMessage = 'Backend server is not running. Please start the server and try again.';
            } else if (response.status === 405) {
              errorMessage = 'Backend API is not configured or not accessible. Please ensure the backend server is deployed and VITE_API_URL is set correctly in production.';
            } else {
              errorMessage = `Server error (${response.status}). Please check if the server is running.`;
            }
          }
        } catch (e) {
          // If response is not JSON or empty, provide a helpful error message
          if (response.status === 0 || response.status === 502 || response.status === 503 || response.status === 500) {
            errorMessage = 'Backend server is not running. Please start the server and try again.';
          } else if (response.status === 405) {
            errorMessage = 'API endpoint not configured. Please set VITE_API_URL environment variable to your production backend URL.';
          } else {
            errorMessage = `Server error (${response.status}). Please check if the server is running.`;
          }
        }
        throw new Error(errorMessage);
      }

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response format. Server may not be running properly. ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      
      // Store token in localStorage if provided
      if (data.token) {
        tokenStorage.set(data.token);
      }
      
      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and ensure the backend server is running on port 5001.');
      }
      throw error;
    }
  },

  async signout() {
    try {
      // Remove token from localStorage first
      tokenStorage.remove();
      
      const response = await fetch(`${API_URL}/auth/signout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        // Try to get error message, but don't fail if response is not JSON
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const error = await response.json();
            throw new Error(error.error || 'Signout failed');
          }
        } catch (e) {
          // If we can't parse the error, just throw a generic message
        }
        throw new Error('Signout failed');
      }

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return response.json();
      }
      // If not JSON, return empty object
      return {};
    } catch (error) {
      // Always remove token even if request fails
      tokenStorage.remove();
      
      // Handle network errors gracefully for signout
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Network error during signout. User will be signed out locally.');
        return {};
      }
      throw error;
    }
  },

  async getSession() {
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        // If 401, remove token as it's invalid
        if (response.status === 401) {
          tokenStorage.remove();
        }
        return null;
      }

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // If not JSON, return null (session not valid)
        return null;
      }

      return response.json();
    } catch (error) {
      // Silently handle network errors for session check
      // This prevents errors when the server is not running
      console.debug('Session check failed:', error.message);
      return null;
    }
  },

  async getNotifications() {
    const response = await fetch(`${API_URL}/admin/notifications`, {
      headers: getAuthHeaders(),
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  async markNotificationRead(notificationId) {
    const response = await fetch(`${API_URL}/admin/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
      throw new Error('Failed to mark notification as read');
    }

    return response.json();
  },

  async markAllNotificationsRead() {
    const response = await fetch(`${API_URL}/admin/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
      throw new Error('Failed to mark all notifications as read');
    }

    return response.json();
  },
};

// Portal API functions
export const portalAPI = {
  async getDashboard() {
    try {
      const response = await authenticatedFetch(`${API_URL}/dashboard/dashboard`, {
        method: 'GET',
      });

      if (!response.ok) {
        let errorMessage = 'Failed to fetch dashboard data';
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const error = await response.json();
            errorMessage = error.error || errorMessage;
          } else {
            const text = await response.text();
            if (text) {
              errorMessage = text.substring(0, 200);
            } else if (response.status === 401) {
              errorMessage = 'Authentication required. Please sign in again.';
            } else if (response.status === 403) {
              errorMessage = 'Access denied. Please check your permissions.';
            } else {
              errorMessage = `Server error (${response.status}). Please try again.`;
            }
          }
        } catch (e) {
          if (response.status === 401) {
            errorMessage = 'Authentication required. Please sign in again.';
          } else if (response.status === 403) {
            errorMessage = 'Access denied. Please check your permissions.';
          } else {
            errorMessage = `Server error (${response.status}). Please try again.`;
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and ensure the backend server is running on port 5001.');
      }
      throw error;
    }
  },

  async getSubscriptions() {
    const response = await fetch(`${API_URL}/dashboard/subscriptions`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    return response.json();
  },

  async createSubscription(planData) {
    const response = await fetch(`${API_URL}/dashboard/subscriptions`, {
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
    const response = await fetch(`${API_URL}/dashboard/subscriptions/${subscriptionId}`, {
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
    const response = await fetch(`${API_URL}/dashboard/campaigns`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    return response.json();
  },

  async getAssets() {
    const response = await fetch(`${API_URL}/dashboard/assets`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }

    return response.json();
  },

  async getInvoices() {
    const response = await fetch(`${API_URL}/dashboard/invoices`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    return response.json();
  },

  async getInvoice(invoiceId) {
    const response = await fetch(`${API_URL}/dashboard/invoices/${invoiceId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }

    return response.json();
  },

  async uploadAsset(assetData) {
    const response = await fetch(`${API_URL}/dashboard/assets`, {
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
    const response = await fetch(`${API_URL}/dashboard/assets/${assetId}`, {
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
      const response = await fetch(`${API_URL}/dashboard/invoices`, {
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
    const response = await fetch(`${API_URL}/dashboard/notifications`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  },

  async markNotificationRead(notificationId) {
    const response = await fetch(`${API_URL}/dashboard/notifications/${notificationId}/read`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return response.json();
  },

  async markAllNotificationsRead() {
    const response = await fetch(`${API_URL}/dashboard/notifications/read-all`, {
      method: 'PATCH',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return response.json();
  },

  async remindMeLater(notificationId, remindAt) {
    const response = await fetch(`${API_URL}/dashboard/notifications/${notificationId}/remind`, {
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
    const response = await fetch(`${API_URL}/dashboard/notifications/${notificationId}/dismiss`, {
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
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
      throw new Error('Failed to fetch admin dashboard');
    }

    return response.json();
  },

  async getUsers() {
    const response = await fetch(`${API_URL}/admin/users`, {
      credentials: 'include',
      cache: 'no-store', // Prevent caching
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Clear any cached auth state and redirect to login
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
      throw new Error('Failed to fetch users');
    }

    return response.json();
  },

  async getCampaigns() {
    const response = await fetch(`${API_URL}/admin/campaigns`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
      throw new Error('Failed to fetch campaigns');
    }

    return response.json();
  },

  async getAnalytics() {
    const response = await fetch(`${API_URL}/admin/analytics`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
      throw new Error('Failed to fetch analytics');
    }

    return response.json();
  },

  async getRequestAnalytics() {
    const response = await fetch(`${API_URL}/admin/request-analytics`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
      throw new Error('Failed to fetch request analytics');
    }

    return response.json();
  },

  async getUserAnalytics() {
    const response = await fetch(`${API_URL}/admin/user-analytics`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
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
      cache: 'no-store', // Prevent caching
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Clear any cached auth state and redirect to login
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
      throw new Error('Failed to fetch invoices');
    }

    return response.json();
  },

  async getAssets() {
    const response = await fetch(`${API_URL}/admin/assets`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
      throw new Error('Failed to fetch assets');
    }

    return response.json();
  },

  async getInvoice(invoiceId) {
    const response = await fetch(`${API_URL}/admin/invoices/${invoiceId}`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
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
      cache: 'no-store',
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
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
      cache: 'no-store',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/auth/signin';
        throw new Error('Authentication required. Please sign in again.');
      }
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

  async getConsultationLeads(status = null, limit = 100, offset = 0) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit);
    params.append('offset', offset);

    const response = await fetch(`${API_URL}/admin/consultation-leads?${params.toString()}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch consultation leads');
    }

    return response.json();
  },

  async updateConsultationLead(leadId, updates) {
    const response = await fetch(`${API_URL}/admin/consultation-leads/${leadId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update consultation lead');
    }

    return response.json();
  },

  async getAIConversations(status = null, limit = 100, offset = 0, search = null) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit);
    params.append('offset', offset);
    if (search) params.append('search', search);

    const response = await fetch(`${API_URL}/admin/ai-conversations?${params.toString()}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI conversations');
    }

    return response.json();
  },

  async getAIConversation(conversationId) {
    const response = await fetch(`${API_URL}/admin/ai-conversations/${conversationId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI conversation');
    }

    return response.json();
  },

  async updateAIConversation(conversationId, updates) {
    const response = await fetch(`${API_URL}/admin/ai-conversations/${conversationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update AI conversation');
    }

    return response.json();
  },

  async getAIConversationsAnalytics() {
    const response = await fetch(`${API_URL}/admin/ai-conversations-analytics`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch AI conversations analytics');
    }

    return response.json();
  },

  async getFeedback(status = null, limit = 100, offset = 0) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit);
    params.append('offset', offset);

    const response = await fetch(`${API_URL}/admin/feedback?${params.toString()}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    return response.json();
  },

  async updateFeedback(feedbackId, updates) {
    const response = await fetch(`${API_URL}/admin/feedback/${feedbackId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update feedback');
    }

    return response.json();
  },
};

// Ticket API functions
export const ticketAPI = {
  async createTicket(subject, description, type, priority, additionalData = {}) {
    const response = await fetch(`${API_URL}/dashboard/tickets`, {
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

  async getAssignees() {
    const response = await fetch(`${API_URL}/dashboard/tickets/assignees`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch ticket assignees');
    }

    return response.json();
  },

  async getTickets() {
    const response = await fetch(`${API_URL}/dashboard/tickets`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to fetch tickets' }));
      throw new Error(error.error || 'Failed to fetch tickets');
    }

    return response.json();
  },

  async getTicket(id) {
    const response = await fetch(`${API_URL}/dashboard/tickets/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }

    return response.json();
  },

  async addMessage(ticketId, message) {
    const response = await fetch(`${API_URL}/dashboard/tickets/${ticketId}/messages`, {
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
    const response = await fetch(`${API_URL}/dashboard/tickets/${ticketId}/attachments`, {
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

  async createTicket(payload) {
    const response = await fetch(`${API_URL}/admin/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      const errorMessage = errorData.error || errorData.message || 'Failed to create ticket';
      throw new Error(errorMessage);
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

