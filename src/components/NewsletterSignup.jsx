import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Send } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Newsletter signup:', email);
      setSubmitStatus('success');
      setEmail('');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join 100+ SMBs Growing with Tech Tips
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Get weekly insights on software development, business automation, and scaling your tech stack. 
            No spam, just valuable content.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Benefits */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What You'll Get:</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Weekly Tech Tips</h4>
                    <p className="text-gray-600 text-sm">Actionable advice for small businesses</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Industry Insights</h4>
                    <p className="text-gray-600 text-sm">Latest trends in software development</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Portfolio</h4>
                    <p className="text-gray-600 text-sm">Real success stories from our clients</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Exclusive Offers</h4>
                    <p className="text-gray-600 text-sm">Special discounts on our services</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Signup Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle className="text-green-500 mr-3" />
                    <p className="text-green-700">Welcome! Check your email for confirmation.</p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <AlertCircle className="text-red-500 mr-3" />
                    <p className="text-red-700">Something went wrong. Please try again.</p>
                  </div>
                )}

                <div>
                  <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Join these businesses already growing with us:</p>
              <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
                <div className="bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-700">TechStart</div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-700">DataFlow</div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-700">GrowthCo</div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-700">RetailMax</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:active {
          box-shadow: 0 0 0px 1000px #fff inset !important;
          -webkit-text-fill-color: #1f2937 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </section>
  );
};

export default NewsletterSignup;
