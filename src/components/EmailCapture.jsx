import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const EmailCapture = ({ title = "Get More Business Tips" }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would send the email to your backend
      console.log('Email captured:', email);
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 text-white border border-gray-700">
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:active {
          box-shadow: 0 0 0px 1000px #1f2937 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
      <div className="text-center">
        <Mail className="h-12 w-12 mx-auto mb-4 text-orange-500" />
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300 mb-6">
          Join 100+ small business owners getting weekly tips on automation, 
          software, and growing their business.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-300 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600"
            >
              {isSubmitting ? 'Joining...' : 'Join Free'}
            </button>
          </div>
        </form>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-500 rounded-lg flex items-center justify-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
            <span className="text-green-300">Welcome! Check your email for confirmation.</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-lg flex items-center justify-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-400" />
            <span className="text-red-300">Something went wrong. Please try again.</span>
          </div>
        )}

        <p className="text-gray-400 text-sm mt-4">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </div>
  );
};

export default EmailCapture;
