import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';

const ConsultationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    timeline: '',
    budget: '',
    message: '',
    preferredTime: '',
    timezone: 'EST'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const projectTypes = [
    'Small Business Website',
    'Custom Web Application', 
    'SaaS Platform',
    'Mobile App',
    'E-commerce Solution',
    'Technical Consulting',
    'Other'
  ];

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

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Consultation booking:', formData);
      
      // In a real implementation, you would:
      // 1. Send data to your backend
      // 2. Create calendar event via Google Calendar API
      // 3. Send confirmation email
      // 4. Integrate with Calendly or similar service
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        timeline: '',
        budget: '',
        message: '',
        preferredTime: '',
        timezone: 'EST'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCalendly = () => {
    // In a real implementation, this would open Calendly widget
    window.open('https://calendly.com/ondosoft/consultation', '_blank');
  };

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="your@email.com"
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="(555) 123-4567"
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Your company name"
              />
            </div>

            {/* Project Type */}
            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                Project Type *
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select project type</option>
                {projectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Project Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select timeline</option>
                {timelineOptions.map(timeline => (
                  <option key={timeline} value={timeline}>{timeline}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select budget range</option>
                {budgetRanges.map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </div>

            {/* Preferred Time */}
            <div>
              <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time Slot
              </label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select preferred time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time} EST</option>
                ))}
              </select>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Tell us about your project goals, requirements, and any specific challenges you're facing..."
            />
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">What you'll get from this consultation:</h3>
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
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Booking...
                </>
              ) : (
                <>
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Free Consultation
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={openCalendly}
              className="px-6 py-4 border-2 border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center"
            >
              <Clock className="h-5 w-5 mr-2" />
              Use Calendly
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Or call us directly: <a href="tel:+15551234567" className="text-orange-600 font-semibold">(555) 123-4567</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationModal;
