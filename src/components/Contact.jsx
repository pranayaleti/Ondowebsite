import { CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { sanitizeInput, validateFormData, validationRules, rateLimiter, generateCSRFToken } from "../utils/security.js";
import { companyInfo } from "../constants/companyInfo";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    message: ''
  });
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  // Generate CSRF token on component mount
  useEffect(() => {
    setCsrfToken(generateCSRFToken());
    
    // Read URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    const priceParam = urlParams.get('price');
    
    if (packageParam && priceParam) {
      setSelectedPackage(decodeURIComponent(packageParam));
      setSelectedPrice(decodeURIComponent(priceParam));
      
      // Map package names to project types
      let projectType = '';
      if (packageParam.includes('UI/UX Master Suite')) {
        projectType = 'website';
      } else if (packageParam.includes('Full Stack Development Platform')) {
        projectType = 'webapp';
      } else if (packageParam.includes('Complete SaaS Ecosystem')) {
        projectType = 'saas';
      }
      
      // Pre-populate form with selected package info
      setFormData(prev => ({
        ...prev,
        projectType: projectType,
        message: `I'm interested in the ${decodeURIComponent(packageParam)} package (${decodeURIComponent(priceParam)}). Please provide more details about this service.`
      }));
    }
  }, []);

  const validateForm = () => {
    // Sanitize all inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      company: sanitizeInput(formData.company),
      message: sanitizeInput(formData.message)
    };
    
    // Validate using security rules
    const newErrors = validateFormData(sanitizedData, validationRules);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Rate limiting check
    const clientId = 'contact-form'; // In a real app, use user IP or session ID
    if (!rateLimiter.isAllowed(clientId)) {
      setSubmitStatus('error');
      setErrors({ general: 'Too many requests. Please try again later.' });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send this to your backend
      if (import.meta.env.DEV) {
        console.log('Form submitted:', formData);
      }
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20" id="contact">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-8 tracking-wide">
        <span className="text-white">Let’s Build Your</span>
        <br />
        <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text drop-shadow-lg">
          Next Big Thing.
        </span>
      </h2>
      <p className="text-center text-neutral-200 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
        Book a call or drop a message — let’s turn your idea into a scalable product.
      </p>
      
      {/* Selected Package Indicator */}
      {selectedPackage && selectedPrice && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-orange-900/20 border border-orange-500/50 rounded-lg">
          <p className="text-orange-400 text-center">
            <span className="font-semibold">Selected Package:</span> {selectedPackage} - {selectedPrice}
          </p>
        </div>
      )}
      
      {/* Success/Error Messages */}
      {submitStatus === 'success' && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg flex items-center">
          <CheckCircle className="text-green-500 mr-3" />
          <p className="text-green-400">Thank you! We'll get back to you within 24 hours.</p>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center">
          <AlertCircle className="text-red-500 mr-3" />
          <p className="text-red-400">Something went wrong. Please try again or contact us directly.</p>
        </div>
      )}
      
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:active {
          box-shadow: 0 0 0px 1000px #1a1a1a inset !important;
          -webkit-text-fill-color: #fff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default Contact; 