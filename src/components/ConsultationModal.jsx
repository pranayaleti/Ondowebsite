import { useEffect, useState, useRef } from 'react';
import { companyInfo } from "../constants/companyInfo";
import { X, Calendar, CheckCircle, AlertCircle, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import SelectField from './SelectField';
import analyticsTracker from '../utils/analytics.js';
import { API_URL } from '../utils/apiConfig.js';
import { isValidEmail, formatPhoneNumber } from '../utils/security.js';

const ConsultationModal = ({ isOpen, onClose, preset, utmMedium = 'pricing' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    selectedPlan: preset?.name || '',
    timeline: '',
    budget: '',
    message: '',
    timezone: 'America/Denver',
    qaResponses: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({ email: '', phone: '' });
  const [showYesNoSection, setShowYesNoSection] = useState(false);
  const [showTextAnswerSection, setShowTextAnswerSection] = useState(false);
  const [showProjectDescriptionSection, setShowProjectDescriptionSection] = useState(false);
  const [showRedirectingPopup, setShowRedirectingPopup] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const saveDraftTimeoutRef = useRef(null);

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

  // Yes/No questions
  const yesNoQuestions = [
    {
      id: 'needs_ecommerce',
      question: 'Do you need e-commerce functionality (online payments, shopping cart)?'
    },
    {
      id: 'needs_user_auth',
      question: 'Do you need user authentication and login functionality?'
    },
    {
      id: 'has_existing_system',
      question: 'Do you have an existing system or website that needs to be integrated or replaced?'
    }
  ];

  // One-line answer questions
  const textAnswerQuestions = [
    {
      id: 'key_features',
      question: 'What are the 3 most important features you need?'
    },
    {
      id: 'main_challenge',
      question: 'What is the main challenge you\'re trying to solve?'
    },
    {
      id: 'target_audience',
      question: 'Who is your primary target audience?'
    }
  ];

  // Save draft to localStorage and backend (debounced)
  const saveDraft = async (data) => {
    try {
      // Save to localStorage immediately
      const draftKey = 'consultation_draft';
      localStorage.setItem(draftKey, JSON.stringify(data));

      // Save to backend (debounced - only if we have sessionId or email)
      const sessionId = analyticsTracker.sessionId;
      const email = data.email?.trim();
      
      if (sessionId || email) {
        try {
          await fetch(`${API_URL}/consultation/draft`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              sessionId: sessionId || null,
              email: email || null,
              formData: data
            })
          });
        } catch (error) {
          // Non-blocking: log error but don't interrupt user flow
          console.warn('Failed to save draft to backend:', error);
        }
      }
    } catch (error) {
      console.warn('Failed to save draft:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData;
    
    if (name === 'phone') {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits
      const limitedDigits = digitsOnly.slice(0, 10);
      // Format the phone number
      const formatted = formatPhoneNumber(limitedDigits);
      updatedData = {
        ...formData,
        [name]: formatted
      };
    } else {
      updatedData = {
        ...formData,
        [name]: value
      };
    }
    
    setFormData(updatedData);
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Debounce draft save (wait 1 second after user stops typing)
    if (saveDraftTimeoutRef.current) {
      clearTimeout(saveDraftTimeoutRef.current);
    }
    saveDraftTimeoutRef.current = setTimeout(() => {
      saveDraft(updatedData);
    }, 1000);
  };

  const handleQAChange = (questionId, value) => {
    const updatedData = {
      ...formData,
      qaResponses: {
        ...formData.qaResponses,
        [questionId]: value
      }
    };
    setFormData(updatedData);

    // Debounce draft save
    if (saveDraftTimeoutRef.current) {
      clearTimeout(saveDraftTimeoutRef.current);
    }
    saveDraftTimeoutRef.current = setTimeout(() => {
      saveDraft(updatedData);
    }, 1000);
  };

  // Use centralized validation functions from security.js
  const validateEmail = (val) => isValidEmail(val);
  const validatePhone = (val) => {
    // Remove non-digits for validation - US phone numbers are 10 digits
    const digitsOnly = val.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

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

    // Format Q&A responses for storage
    const allQuestions = [...yesNoQuestions, ...textAnswerQuestions];
    const qaFormatted = Object.entries(formData.qaResponses)
      .filter(([_, value]) => value && value.trim() !== '')
      .map(([questionId, answer]) => {
        const question = allQuestions.find(q => q.id === questionId);
        return {
          question: question ? question.question : questionId,
          answer: answer
        };
      });

    const payload = {
      ...formData,
      selectedPlan: formData.selectedPlan || preset?.name || '',
      selectedPlanPrice: preset?.price || '',
      timestamp: new Date().toISOString(),
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      qaResponses: qaFormatted
    };

    try {
      // Get session ID from analytics tracker
      const sessionId = analyticsTracker.sessionId;

      // Track analytics event for consultation submission
      analyticsTracker.trackUserInteraction('consultation_submit', {
        formId: 'consultation_modal',
        name: payload.name,
        email: payload.email,
        selectedPlan: payload.selectedPlan,
        budget: payload.budget,
        timeline: payload.timeline
      });

      // Track form submission in analytics
      analyticsTracker.trackFormInteraction('consultation_modal', 'submit');

      // Save to backend API for tracking
      try {
        // Format message to include Q&A responses
        const messageWithQA = payload.message 
          ? `${payload.message}\n\n--- Q&A Responses ---\n${qaFormatted.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')}`
          : qaFormatted.length > 0 
            ? `--- Q&A Responses ---\n${qaFormatted.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')}`
            : null;

        const apiPayload = {
          sessionId: sessionId,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          company: payload.company || null,
          selectedPlan: payload.selectedPlan || null,
          selectedPlanPrice: payload.selectedPlanPrice || null,
          timeline: payload.timeline || null,
          budget: payload.budget || null,
          message: messageWithQA,
          qaResponses: JSON.stringify(qaFormatted),
          timezone: payload.timezone || null,
          pageUrl: payload.pageUrl || null,
          userAgent: payload.userAgent || null,
          utmMedium: utmMedium || null,
          utmSource: 'website',
          utmCampaign: 'consultation',
          utmContent: payload.selectedPlan || payload.budget || 'general',
          referrer: payload.referrer || null
        };

        await fetch(`${API_URL}/consultation/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(apiPayload)
        });
      } catch (apiError) {
        // Non-blocking: log error but don't interrupt user flow
        console.warn('Failed to save consultation to backend:', apiError);
      }

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

      // Build Calendly URL with helpful context
      const params = new URLSearchParams({
        utm_source: 'website',
        utm_medium: utmMedium,
        utm_campaign: 'consultation',
        utm_content: payload.selectedPlan || payload.budget || 'general',
        a1: payload.selectedPlan || '',
        a2: payload.email || '',
        a3: payload.company || ''
      });
      const calendlyUrl = `${companyInfo.calendlyUrl}?${params.toString()}`;

      // Show redirecting popup
      setShowRedirectingPopup(true);

      // Open Calendly in new tab after a brief delay
      setTimeout(() => {
        window.open(calendlyUrl, '_blank');
        // Close popup and modal after showing for a few seconds
        setTimeout(() => {
          setShowRedirectingPopup(false);
          onClose();
        }, 2500);
      }, 500);

      // Clear draft data after successful submission
      try {
        const sessionId = analyticsTracker.sessionId;
        const email = payload.email?.trim();
        
        // Clear localStorage draft
        localStorage.removeItem('consultation_draft');
        
        // Clear backend draft
        if (sessionId || email) {
          try {
            await fetch(`${API_URL}/consultation/draft`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                sessionId: sessionId || null,
                email: email || null
              })
            });
          } catch (error) {
            // Non-blocking
            console.warn('Failed to clear draft:', error);
          }
        }
      } catch (error) {
        // Non-blocking
        console.warn('Failed to clear draft:', error);
      }

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
        timezone: 'America/Denver',
        qaResponses: {}
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

  // Load draft data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const loadDraft = async () => {
      setIsLoadingDraft(true);
      try {
        // First, try to load from localStorage (fastest)
        const draftKey = 'consultation_draft';
        const localDraft = localStorage.getItem(draftKey);
        
        let draftData = null;
        
        if (localDraft) {
          try {
            draftData = JSON.parse(localDraft);
          } catch (e) {
            console.warn('Failed to parse local draft:', e);
          }
        }

        // Also try to load from backend (may have more recent data)
        const sessionId = analyticsTracker.sessionId;
        const email = draftData?.email?.trim() || '';
        
        if (sessionId || email) {
          try {
            const params = new URLSearchParams();
            if (sessionId) params.append('sessionId', sessionId);
            if (email) params.append('email', email);
            
            const response = await fetch(`${API_URL}/consultation/draft?${params.toString()}`, {
              method: 'GET',
              credentials: 'include'
            });
            
            if (response.ok) {
              const result = await response.json();
              if (result.success && result.formData) {
                // Use backend data if available (may be more recent)
                draftData = result.formData;
                // Update localStorage with backend data
                localStorage.setItem(draftKey, JSON.stringify(draftData));
              }
            }
          } catch (error) {
            // Non-blocking: if backend fails, use localStorage data
            console.warn('Failed to load draft from backend:', error);
          }
        }

        // Merge draft data with current form data (preserve preset if provided)
        if (draftData) {
          setFormData(prev => ({
            ...draftData,
            selectedPlan: preset?.name || draftData.selectedPlan || prev.selectedPlan,
            timezone: draftData.timezone || prev.timezone,
            qaResponses: draftData.qaResponses || prev.qaResponses
          }));
        } else if (preset?.name) {
          // If no draft, apply preset
          setFormData(prev => ({
            ...prev,
            selectedPlan: preset.name,
            message: prev.message || `Plan Selected: ${preset.name} (${preset.price} ${preset.cadence}).\n\nPlease describe your specific requirements: \n- What are the core features you need? \n- Who is the primary user? \n- Any deadlines or milestones? \n- Integrations or existing systems?`
          }));
        }
      } catch (error) {
        console.warn('Failed to load draft:', error);
      } finally {
        setIsLoadingDraft(false);
      }
    };

    loadDraft();

    // Cleanup timeout on unmount or close
    return () => {
      if (saveDraftTimeoutRef.current) {
        clearTimeout(saveDraftTimeoutRef.current);
      }
    };
  }, [isOpen, preset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-black to-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-orange-500">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Book Your Free Consultation</h2>
            <p className="text-gray-300 mt-1">Get expert advice on your project in 30 minutes</p>
          </div>
          <button
            onClick={onClose}
            className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 hover:text-white rounded-full p-2 transition-all duration-200 border border-orange-500/50 hover:border-orange-500 shadow-lg hover:shadow-orange-500/50"
            aria-label="Close consultation modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Messages */}
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-center">
              <AlertCircle className="text-red-400 mr-3" />
              <p className="text-red-300">Something went wrong. Please try again or contact us directly.</p>
            </div>
          )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
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
                placeholder={companyInfo.placeholders.email}
              />
                {fieldErrors.email && <p className="text-sm text-red-400 mt-2">{fieldErrors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
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
                inputMode="tel"
                pattern="^\(\d{3}\) \d{3}-\d{4}$"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
                placeholder="(123) 456-7890"
              />
                {fieldErrors.phone && <p className="text-sm text-red-400 mt-2">{fieldErrors.phone}</p>}
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
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
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">
                Project Timeline
              </label>
              <SelectField
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                placeholder="Select timeline"
                variant="light"
                options={timelineOptions.map(t => ({ value: t, label: t }))}
              />
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                Budget Range
              </label>
              <SelectField
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Select budget range"
                variant="light"
                options={budgetRanges.map(b => ({ value: b, label: b }))}
              />
            </div>

            
          </div>

          {/* Section 1: Yes/No Questions */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowYesNoSection(!showYesNoSection)}
              className="w-full flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-300">
                  Quick Yes/No Questions (Optional)
                </span>
                <span className="text-xs text-gray-500">
                  Help us understand your needs
                </span>
              </div>
              {showYesNoSection ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {showYesNoSection && (
              <div className="mt-4 space-y-4">
                {yesNoQuestions.map((q, index) => (
                  <div key={q.id} className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                    <div className="mb-3">
                      <p className="text-white font-medium text-sm">
                        {index + 1}. {q.question}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleQAChange(q.id, 'Yes')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          formData.qaResponses[q.id] === 'Yes'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQAChange(q.id, 'No')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                          formData.qaResponses[q.id] === 'No'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: One-Line Answer Questions */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowTextAnswerSection(!showTextAnswerSection)}
              className="w-full flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-300">
                  Quick One-Line Questions (Optional)
                </span>
                <span className="text-xs text-gray-500">
                  Share key details about your project
                </span>
              </div>
              {showTextAnswerSection ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {showTextAnswerSection && (
              <div className="mt-4 space-y-4">
                {textAnswerQuestions.map((q, index) => (
                  <div key={q.id} className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
                    <div className="mb-3">
                      <p className="text-white font-medium text-sm">
                        {index + 1}. {q.question}
                      </p>
                    </div>
                    <input
                      type="text"
                      value={formData.qaResponses[q.id] || ''}
                      onChange={(e) => handleQAChange(q.id, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Project Description */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowProjectDescriptionSection(!showProjectDescriptionSection)}
              className="w-full flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-300">
                  Project Description (Optional)
                </span>
                <span className="text-xs text-gray-500">
                  Share more details about your project
                </span>
              </div>
              {showProjectDescriptionSection ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            {showProjectDescriptionSection && (
              <div className="mt-4">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Share your project vision, goals, and requirements. What challenges are you facing? What outcomes are you hoping to achieve? Any specific features, integrations, or deadlines we should know about?"
                />
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h3 className="font-semibold text-white mb-3">What you'll get from this free consultation:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
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
              onClick={onClose}
              className="px-6 py-4 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Redirecting Popup */}
      {showRedirectingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
          <div className="bg-gradient-to-b from-black to-gray-900 rounded-2xl max-w-md w-full mx-4 border-2 border-orange-500 p-8 text-center">
            <div className="mb-4">
              <Loader className="h-12 w-12 text-orange-500 mx-auto animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Redirecting to Calendly</h3>
            <p className="text-gray-300">We're opening your booking page in a new tab...</p>
          </div>
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
    </div>
  );
};

export default ConsultationModal;
