import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Star, Zap } from "lucide-react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left Column - Main Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-6">
            <span className="inline-flex items-center bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium border border-orange-500/30">
              <Star className="h-4 w-4 mr-2" />
              #1 Rated Software Development Company
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Hire the Best</span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text drop-shadow-lg">
              Software Developers
            </span>
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl text-white drop-shadow-lg">
              Near You
            </span>
          </h1>
          
          <p className="text-xl text-neutral-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            <strong className="text-orange-400 font-semibold">Nationwide software development company</strong> specializing in 
            custom web applications, SaaS platforms, and mobile apps. From startups to enterprises, 
            we deliver scalable solutions that drive real business growth.
          </p>
          
          {/* Key Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-center text-neutral-300">
              <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
              <span>Free Consultation & Quote</span>
            </div>
            <div className="flex items-center text-neutral-300">
              <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
              <span>10+ Years Experience</span>
            </div>
            <div className="flex items-center text-neutral-300">
              <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
              <span>500+ Projects Delivered</span>
            </div>
            <div className="flex items-center text-neutral-300">
              <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
              <span>24/7 Support & Maintenance</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/contact"
              className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              aria-label="Get free quote for your software development project"
            >
              Get Free Quote Today
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center"
              aria-label="View our software development services"
            >
              View Our Services
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-neutral-400">
            <div className="flex items-center">
              <div className="flex text-orange-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-sm">4.9/5 Client Rating</span>
            </div>
            <div className="text-sm">
              <span className="text-orange-400 font-semibold">200+</span> Happy Clients
            </div>
            <div className="text-sm">
              <span className="text-orange-400 font-semibold">50</span> States Served
            </div>
          </div>
        </div>
        
        {/* Right Column - Visual Elements */}
        <div className="flex-1 max-w-lg mx-auto lg:mx-0">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-xl border border-orange-500/30 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
                <div className="text-orange-400 mb-3">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Fast Delivery</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  40% faster than industry average with agile development
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-xl border border-orange-500/30 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
                <div className="text-orange-400 mb-3">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Quality Assured</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Enterprise-grade security and testing standards
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-xl border border-orange-500/30 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
                <div className="text-orange-400 mb-3">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Expert Team</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Senior developers with proven track records
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-xl border border-orange-500/30 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
                <div className="text-orange-400 mb-3">
                  <ArrowRight className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Scalable Solutions</h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Built to grow with your business needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
