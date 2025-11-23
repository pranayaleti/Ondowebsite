import { useState, useEffect, useCallback } from 'react';
import { X, Eye, Mail, FileText, Loader } from 'lucide-react';
import { portalAPI, adminAPI } from '../utils/auth.js';
import { sanitizeHtml, escapeHtml } from '../utils/security.js';

const EmailTemplatePreview = ({ templateId, isOpen, onClose, isAdmin = false }) => {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');

  const fetchTemplate = useCallback(async () => {
    if (!templateId) {
      setError('No template ID provided');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const api = isAdmin ? adminAPI : portalAPI;
      
      // Verify API has the method
      if (!api || typeof api.getEmailTemplate !== 'function') {
        throw new Error(`API method not available. isAdmin: ${isAdmin}, api type: ${typeof api}`);
      }
      
      // Ensure templateId is a number
      const templateIdNum = typeof templateId === 'string' ? parseInt(templateId, 10) : templateId;
      if (isNaN(templateIdNum) || templateIdNum <= 0) {
        throw new Error(`Invalid template ID: ${templateId}`);
      }
      
      if (import.meta.env.DEV) {
        console.log('Fetching template with ID:', templateIdNum, 'isAdmin:', isAdmin);
      }
      const data = await api.getEmailTemplate(templateIdNum);
      
      if (!data || !data.template) {
        throw new Error('Template data not found in response');
      }
      
      // Verify we got the correct template
      if (import.meta.env.DEV) {
        console.log('Received template:', data.template.name, 'ID:', data.template.id);
        if (data.template.id !== templateIdNum) {
          console.warn('Template ID mismatch! Expected:', templateIdNum, 'Got:', data.template.id);
        }
      }
      
      setTemplate(data.template);
      
      // Replace placeholders with sample data for preview
      const sampleData = {
        name: 'John Doe',
        company_name: 'OndoSoft',
        website_url: 'https://ondosoft.com',
        product_name: 'Premium Plan',
        product_description: 'Our most comprehensive solution with all features included.',
        product_url: 'https://ondosoft.com/products/premium',
        offer_title: 'Limited Time Offer',
        offer_discount: '50% OFF',
        offer_description: 'Get 50% off on all annual plans. Valid for new customers only.',
        offer_expiry: 'December 31, 2024',
        offer_url: 'https://ondosoft.com/offers',
        newsletter_title: 'Monthly Updates',
        article_1_title: 'New Features Released',
        article_1_summary: 'We\'ve added exciting new features to improve your experience.',
        article_1_url: 'https://ondosoft.com/news',
        order_number: 'ORD-12345',
        item_name: 'Premium Subscription',
        item_quantity: '1',
        item_price: '$99.00',
        order_total: '$99.00',
        shipping_address: '123 Main St, City, State 12345',
        order_tracking_url: 'https://ondosoft.com/track/ORD-12345',
        reset_url: 'https://ondosoft.com/reset-password?token=abc123',
        reset_expiry: '24',
        invoice_number: 'INV-67890',
        invoice_amount: '$199.00',
        due_date: 'January 15, 2025',
        invoice_description: 'Monthly subscription fee',
        payment_url: 'https://ondosoft.com/pay/INV-67890',
        activation_url: 'https://ondosoft.com/activate?token=xyz789',
        activation_expiry: '48',
        event_name: 'Product Launch Webinar',
        event_date: 'January 20, 2025',
        event_time: '2:00 PM EST',
        event_location: 'Online - Zoom',
        event_duration: '1 hour',
        event_description: 'Join us for an exclusive preview of our latest product features.',
        event_highlight_1: 'Live product demonstration',
        event_highlight_2: 'Q&A session with our team',
        event_highlight_3: 'Exclusive early access offers',
        rsvp_url: 'https://ondosoft.com/events/webinar',
        feature_name: 'Advanced Analytics Dashboard',
        feature_description: 'Track your performance with our new comprehensive analytics dashboard.',
        benefit_1: 'Real-time data visualization',
        benefit_2: 'Customizable reports',
        benefit_3: 'Export data in multiple formats',
        feature_url: 'https://ondosoft.com/features/analytics'
      };

      let html = data.template.body_html || '';
      Object.keys(sampleData).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        // Escape HTML in sample data to prevent XSS
        const safeValue = escapeHtml(String(sampleData[key]));
        html = html.replace(regex, safeValue);
      });
      
      // Sanitize the final HTML before setting
      setPreviewHtml(sanitizeHtml(html));
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error fetching template:', err);
      }
      // Provide more detailed error message
      if (err.message.includes('404') || err.message.includes('not found')) {
        setError('Template not found. It may have been deleted or is inactive.');
      } else if (err.message.includes('401') || err.message.includes('403')) {
        setError('Authentication required. Please sign in again.');
      } else {
        setError(err.message || 'Failed to fetch email template. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [templateId, isAdmin]);

  useEffect(() => {
    if (isOpen && templateId) {
      // Reset state when modal opens with a new template
      setTemplate(null);
      setPreviewHtml('');
      setError(null);
      fetchTemplate();
    } else if (!isOpen) {
      // Clear state when modal closes
      setTemplate(null);
      setPreviewHtml('');
      setError(null);
    }
  }, [isOpen, templateId, fetchTemplate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">Email Template Preview</h2>
              {template ? (
                <p className="text-sm text-orange-100 mt-1">{template.name}</p>
              ) : templateId ? (
                <p className="text-sm text-orange-100 mt-1">Loading template...</p>
              ) : null}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <X className="w-5 h-5 text-red-400 mt-0.5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-red-400 font-semibold mb-1">Error Loading Template</h4>
                  <p className="text-red-300 text-sm">{error}</p>
                  <button
                    onClick={fetchTemplate}
                    className="mt-3 text-xs text-red-400 hover:text-red-300 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ) : template ? (
            <div className="space-y-4">
              {/* Template Info */}
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 uppercase">Subject</label>
                    <p className="text-white font-medium mt-1">{template.subject}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase">Category</label>
                    <p className="text-white font-medium mt-1 capitalize">{template.category || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white rounded-lg border-2 border-gray-700 overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600 font-medium">Email Preview</span>
                </div>
                <div 
                  className="p-4"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                  style={{ 
                    maxHeight: '60vh',
                    overflow: 'auto'
                  }}
                />
              </div>

              {/* Placeholders Info */}
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">Available Placeholders</h3>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>This template uses dynamic placeholders that will be replaced with actual data when sent.</p>
                  <p className="mt-2 text-cyan-400">Example: {'{{name}}'} will be replaced with the recipient's name</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-gray-900/50 p-6 flex items-center justify-end gap-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatePreview;

