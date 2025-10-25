import React from 'react';
import { ArrowRight, Calculator, MessageCircle, Star, CheckCircle } from 'lucide-react';

const HeroCTA = () => {
  return (
    <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
            Join 200+ businesses that have scaled with our custom software solutions. 
            Get your free quote and project estimate in under 24 hours.
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a 
            href="/contact" 
            className="group bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            aria-label="Get free quote for your software development project"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Get Free Quote
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
          
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
              <Star className="h-5 w-5 text-orange-200 mr-1" />
              <span className="text-2xl font-bold">4.9/5</span>
            </div>
            <div className="text-orange-100 text-sm">Client Rating</div>
          </div>
          
          <div className="text-white">
            <div className="text-2xl font-bold mb-2">200+</div>
            <div className="text-orange-100 text-sm">Happy Clients</div>
          </div>
          
          <div className="text-white">
            <div className="text-2xl font-bold mb-2">24h</div>
            <div className="text-orange-100 text-sm">Response Time</div>
          </div>
          
          <div className="text-white">
            <div className="text-2xl font-bold mb-2">100%</div>
            <div className="text-orange-100 text-sm">Satisfaction</div>
          </div>
        </div>
        
        {/* Key Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center text-orange-100">
            <CheckCircle className="h-5 w-5 text-orange-200 mr-3 flex-shrink-0" />
            <span className="text-sm">Free consultation & project planning</span>
          </div>
          <div className="flex items-center text-orange-100">
            <CheckCircle className="h-5 w-5 text-orange-200 mr-3 flex-shrink-0" />
            <span className="text-sm">Transparent pricing with no hidden fees</span>
          </div>
          <div className="flex items-center text-orange-100">
            <CheckCircle className="h-5 w-5 text-orange-200 mr-3 flex-shrink-0" />
            <span className="text-sm">24/7 support & maintenance included</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCTA;
