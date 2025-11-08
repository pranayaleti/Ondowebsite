import React, { useState } from 'react';
import { companyInfo } from "../constants/companyInfo";
import { X, Calendar, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import SelectField from './SelectField';

const ConsultationWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    timeline: '',
    budget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({ email: '', phone: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'phone' ? value.replace(/\D+/g, '') : value;
    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
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
      selectedPlan: '',
      selectedPlanPrice: '',
      timestamp: new Date().toISOString(),
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    };

    try {
      // Save locally
      const key = 'consultation_leads';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(payload);
      localStorage.setItem(key, JSON.stringify(existing));

      // Optional webhook
      if (companyInfo.leadWebhookUrl) {
        try {
          await fetch(companyInfo.leadWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          console.warn('Lead webhook failed', err);
        }
      }

      setSubmitStatus('success');

      // Redirect to Calendly with context
      const params = new URLSearchParams({
        utm_source: 'website',
        utm_medium: 'floating_widget',
        utm_campaign: 'consultation',
        utm_content: formData.budget || 'general',
        a2: formData.email || '',
        a3: formData.company || ''
      });
      const calendlyUrl = `${companyInfo.calendlyUrl}?${params.toString()}`;
      window.location.href = calendlyUrl;

      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        timeline: '',
        budget: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Widget */}
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 md:right-24">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          aria-label="Book a free consultation"
        >
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full animate-pulse">
            Free
          </div>
        </button>
        
        {/* Enhanced Tooltip - Hidden on mobile, shown on hover for desktop */}
        <div className="hidden sm:block absolute bottom-full right-0 mb-3 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg pointer-events-none">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Book Free Consultation</span>
          </div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Book Your Free Consultation</h2>
                <p className="text-gray-600 mt-1">Get expert advice on your project in 30 minutes</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="text-green-500 mr-3" />
                  <p className="text-green-700">Thank you! We'll contact you within 24 hours to schedule your consultation.</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="text-red-500 mr-3" />
                  <p className="text-red-700">Something went wrong. Please try again or contact us directly.</p>
                </div>
              )}

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

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
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
                    options={[
                      { value: 'asap', label: 'ASAP (Rush job)' },
                      { value: '1month', label: 'Within 1 month' },
                      { value: '3months', label: 'Within 3 months' },
                      { value: '6months', label: 'Within 6 months' },
                      { value: 'flexible', label: 'Flexible' }
                    ]}
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
                    options={[
                      { value: 'under-2k', label: 'Under $2,000' },
                      { value: '2k-5k', label: '$2,000 - $5,000' },
                      { value: '5k-10k', label: '$5,000 - $10,000' },
                      { value: '10k-25k', label: '$10,000 - $25,000' },
                      { value: '25k-plus', label: '$25,000+' },
                      { value: 'discuss', label: "Let's discuss" }
                    ]}
                  />
                </div>

                {/* Message */}
                <div className="md:col-span-2">
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

              {/* Submit Button */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-5 w-5 mr-2" />
                      Continue to Booking
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultationWidget;
