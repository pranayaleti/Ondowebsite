import React, { useEffect, useState } from 'react';
import { companyInfo } from "../constants/companyInfo";
import { X, Calendar, Clock, User, Mail, Phone, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import SelectField from './SelectField';

const ConsultationModal = ({ isOpen, onClose, preset }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    selectedPlan: preset?.name || '',
    timeline: '',
    budget: '',
    message: '',
    timezone: 'MST'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({ email: '', phone: '' });

  const timelineOptions = [
    'ASAP (Rush job)',
    'Within 1 month',
    'Within 3 months',
    'Within 6 months',
    'Flexible timeline'
  ];

  const budgetRanges = [
    'Under $2,000',
    '$2,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+',
    'Let\'s discuss'
  ];

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'phone' ? value.replace(/\D+/g, '') : value;
    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (val) => /^(?:[a-zA-Z0-9_'^&\-]+(?:\.[a-zA-Z0-9_'^&\-]+)*)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(val);
  const validatePhone = (val) => /^\d{7,15}$/.test(val);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'email' && value) {
      if (!validateEmail(value)) setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
    }
    if (name === 'phone') {
      if (!validatePhone(value)) setFieldErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number.' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Final validation gate
    const emailOk = validateEmail(formData.email);
    const phoneOk = validatePhone(formData.phone);
    if (!emailOk || !phoneOk) {
      setFieldErrors(prev => ({
        ...prev,
        email: emailOk ? '' : (prev.email || 'Please enter a valid email address.'),
        phone: phoneOk ? '' : (prev.phone || 'Please enter a valid phone number.')
      }));
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      selectedPlan: formData.selectedPlan || preset?.name || '',
      selectedPlanPrice: preset?.price || '',
      timestamp: new Date().toISOString(),
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    };

    try {
      // Save locally for a lightweight record
      const key = 'consultation_leads';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(payload);
      localStorage.setItem(key, JSON.stringify(existing));

      // Optional webhook to your backend/automation (Zapier, Make, Cloud Function, etc.)
      if (companyInfo.leadWebhookUrl) {
        try {
          await fetch(companyInfo.leadWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          // Non-blocking: ignore webhook failure
          console.warn('Lead webhook failed', err);
        }
      }

      setSubmitStatus('success');

      // Build Calendly URL with helpful context
      const params = new URLSearchParams({
        utm_source: 'website',
        utm_medium: 'pricing',
        utm_campaign: 'consultation',
        utm_content: payload.selectedPlan || 'unknown',
        a1: payload.selectedPlan || '',
        a2: payload.email || '',
        a3: payload.company || ''
      });
      const calendlyUrl = `${companyInfo.calendlyUrl}?${params.toString()}`;

      // Redirect to Calendly
      window.location.href = calendlyUrl;

      // Reset form in the background
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        selectedPlan: preset?.name || '',
        timeline: '',
        budget: '',
        message: '',
        timezone: 'MST'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCalendly = () => {
    window.open('https://calendly.com/scheduleondo', '_blank');
  };

  useEffect(() => {
    if (isOpen && preset?.name) {
      setFormData(prev => ({
        ...prev,
        selectedPlan: preset.name,
        message: prev.message || `Plan Selected: ${preset.name} (${preset.price} ${preset.cadence}).\n\nPlease describe your specific requirements: \n- What are the core features you need? \n- Who is the primary user? \n- Any deadlines or milestones? \n- Integrations or existing systems?`
      }));
    }
  }, [isOpen, preset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-orange-500 p-3 rounded-lg mr-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book Your Free Consultation</h2>
              <p className="text-gray-600">30-minute expert consultation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {preset?.name && (
            <div className="mb-6 p-4 rounded-lg border border-orange-200 bg-orange-50 text-sm text-gray-800">
              <div className="font-semibold">Selected Plan: {preset.name}</div>
              <div className="mt-1 text-gray-700">{preset.price} {preset.cadence}</div>
              <div className="mt-3 text-gray-700">We'll tailor questions to your needs. Please share specifics below.</div>
            </div>
          )}
          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="text-green-500 mr-3" />
              <div>
                <p className="text-green-700 font-semibold">Consultation Booked Successfully!</p>
                <p className="text-green-600 text-sm">We'll send you a calendar invite and confirmation email shortly.</p>
              </div>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="text-red-500 mr-3" />
              <p className="text-red-700">Something went wrong. Please try again or contact us directly.</p>
            </div>
          )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="your@email.com"
              />
                {fieldErrors.email && <p className="text-sm text-red-600 mt-2">{fieldErrors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                  type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  inputMode="numeric"
                  pattern="\\d*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="(555) 123-4567"
              />
                {fieldErrors.phone && <p className="text-sm text-red-600 mt-2">{fieldErrors.phone}</p>}
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company/Business
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="Your company name"
              />
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Project Timeline
              </label>
              <SelectField
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                placeholder="Select timeline"
                options={timelineOptions.map(t => ({ value: t, label: t }))}
              />
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <SelectField
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Select budget range"
                options={budgetRanges.map(b => ({ value: b, label: b }))}
              />
            </div>

            
          </div>

          {/* Message */}
          <div className="mt-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Project Details *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
              placeholder="Tell us about your project goals, requirements, and any specific challenges you're facing..."
            />
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">What you'll get from this free consultation:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                <span>30-minute expert consultation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                <span>Project roadmap & timeline</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                <span>Technology recommendations</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                <span>Cost estimation & next steps</span>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center disabled:opacity-70"
            >
              <Calendar className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Saving...' : 'Continue to Booking'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Urgent requests note */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            For urgent requests or mobile services, please call us at <a href={`tel:${companyInfo.urgentPhoneE164}`} className="text-orange-600 font-semibold">{companyInfo.urgentPhoneDisplay}</a>
          </p>
        </form>
      </div>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:active {
          box-shadow: 0 0 0px 1000px #fff inset !important;
          -webkit-text-fill-color: #1f2937 !important; /* text-gray-900 */
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default ConsultationModal;
