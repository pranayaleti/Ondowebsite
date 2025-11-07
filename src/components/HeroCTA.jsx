import React from 'react';
import { ArrowRight, Calculator, MessageCircle, Star, CheckCircle } from 'lucide-react';

const HeroCTA = ({ onOpenConsultation }) => {
  return (
    <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-16 border-t border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your <span className="text-orange-500">Business?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join 200+ businesses that have scaled with our custom software solutions. 
            Start your free consultation and get a project estimate in under 24 hours.
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {onOpenConsultation ? (
            <button 
              type="button"
              onClick={onOpenConsultation}
              className="group bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              aria-label="Start free consultation for your software development project"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Start Free Consultation
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <a 
              href="/contact" 
              className="group bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              aria-label="Start free consultation for your software development project"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Start Free Consultation
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
          
          <a 
            href="/pricing" 
            className="group border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300 flex items-center justify-center"
            aria-label="Estimate project cost and view pricing"
          >
            <Calculator className="h-5 w-5 mr-2" />
            Estimate Project Cost
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        
        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="text-white">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-5 w-5 text-orange-500 mr-1" />
              <span className="text-2xl font-bold">4.9/5</span>
            </div>
            <div className="text-gray-300 text-sm">Client Rating</div>
          </div>
          
          <div className="text-white">
            <div className="text-2xl font-bold mb-2">200+</div>
            <div className="text-gray-300 text-sm">Happy Clients</div>
          </div>
          
          <div className="text-white">
            <div className="text-2xl font-bold mb-2">24h</div>
            <div className="text-gray-300 text-sm">Response Time</div>
          </div>
          
          <div className="text-white">
            <div className="text-2xl font-bold mb-2">100%</div>
            <div className="text-gray-300 text-sm">Satisfaction</div>
          </div>
        </div>
        
        {/* Key Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center text-gray-300">
            <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
            <span className="text-sm">Free consultation & project planning</span>
          </div>
          <div className="flex items-center text-gray-300">
            <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
            <span className="text-sm">Transparent pricing with no hidden fees</span>
          </div>
          <div className="flex items-center text-gray-300">
            <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
            <span className="text-sm">24/7 support & maintenance included</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCTA;
