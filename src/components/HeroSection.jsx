import { Link } from "react-router-dom";
import { useState, useEffect, memo, useCallback } from "react";
import { ArrowRight, CheckCircle, Star, Zap } from "lucide-react";
import FancyHeading from "./FancyHeading";

const HeroSection = ({ onOpenSchedule }) => {
  // Rotating fancy headings - cycle through every 2 seconds
  const fancyHeadings = [
    { firstWord: "Scalable", secondWord: "Architecture" },
    { firstWord: "Strategic", secondWord: "Growth" },
    { firstWord: "Product", secondWord: "Engineering" },
    { firstWord: "Enterprise", secondWord: "Performance" },
    { firstWord: "SaaS", secondWord: "Excellence" }
  ];
  
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentHeadingIndex((prevIndex) => 
          (prevIndex + 1) % fancyHeadings.length
        );
        setIsTransitioning(false);
      }, 350); // Slightly longer for smoother transition
    }, 2500); // Change every 2.5 seconds for better readability

    return () => clearInterval(interval);
  }, [fancyHeadings.length]);

  const handleScheduleClick = useCallback(() => {
    if (onOpenSchedule) {
      onOpenSchedule();
    }
  }, [onOpenSchedule]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left Column - Main Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-4 sm:mb-5 md:mb-6">
            <span className="inline-flex items-center bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium border border-orange-500/30">
              <Star className="h-4 w-4 mr-2" />
              Product team that ships to production
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-5 md:mb-6">
            <span className="text-white block">High-Performance</span>
            <span className="text-orange-500 block">Engineering Studio</span>
          </h1>
          
          {/* Rotating Fancy Heading - Enhanced Connective Style */}
          <div className="mb-6 sm:mb-7 md:mb-8 min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px] flex items-start justify-center lg:justify-start relative overflow-hidden">
            <div 
              className={`w-full max-w-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isTransitioning 
                  ? 'opacity-0 transform translate-y-4 scale-95 blur-sm' 
                  : 'opacity-100 transform translate-y-0 scale-100 blur-0'
              }`}
              style={{
                transitionProperty: 'opacity, transform, filter',
              }}
            >
              <FancyHeading 
                firstWord={fancyHeadings[currentHeadingIndex].firstWord}
                secondWord={fancyHeadings[currentHeadingIndex].secondWord}
                textSize="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                className="w-full"
              />
            </div>
            {/* Subtle background glow effect */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20 blur-3xl"
              style={{
                background: 'radial-gradient(circle at 30% 50%, rgba(249, 115, 22, 0.3), transparent 70%)',
                transition: 'opacity 0.7s ease',
              }}
            />
          </div>
          
          <p className="text-lg sm:text-xl text-gray-200 mb-6 sm:mb-7 md:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            We architect the technical foundations for funded startups and scaling SaaS companies. <strong className="text-orange-400 font-semibold">Ondosoft</strong> bridges the gap between visionary product strategy and production-grade engineering.
          </p>
          
          {/* Key Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-center text-gray-200">
              <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" aria-hidden="true" />
              <span>Strategy-first discovery & roadmap</span>
            </div>
            <div className="flex items-center text-gray-200">
              <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" aria-hidden="true" />
              <span>On-time delivery, every time</span>
            </div>
            <div className="flex items-center text-gray-200">
              <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" aria-hidden="true" />
              <span>Dozens of launches across SaaS and enterprise</span>
            </div>
            <div className="flex items-center text-gray-200">
              <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" aria-hidden="true" />
              <span>Ongoing support with measurable uptime</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {onOpenSchedule ? (
              <button
                type="button"
                onClick={handleScheduleClick}
                className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 min-h-[48px] rounded-lg text-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                aria-label="Book Strategy Call"
              >
                Book Strategy Call
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link
                to="/contact"
                className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 min-h-[48px] rounded-lg text-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                aria-label="Schedule a meeting"
              >
                Schedule a meeting
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <Link
              to="/portfolio"
              className="border-2 border-orange-500 text-orange-500 px-8 py-4 min-h-[48px] rounded-lg text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center"
              aria-label="View Case Studies"
            >
              View Case Studies
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
              <span className="text-sm">4.9/5 client satisfaction</span>
            </div>
            <div className="text-sm">
              <span className="text-orange-400 font-semibold">50+</span> launches delivered
            </div>
            <div className="text-sm">
              <span className="text-orange-400 font-semibold">Nationwide</span> collaboration
            </div>
          </div>
        </div>
        
        {/* Right Column - Visual Elements */}
        <div className="flex-1 max-w-lg mx-auto lg:mx-0">
          <div className="opacity-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-xl border border-orange-500/30 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
                <div className="text-orange-400 mb-3">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Fast Delivery</h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  40% faster than industry average with agile development
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-xl border border-orange-500/30 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
                <div className="text-orange-400 mb-3">
                  <CheckCircle className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Quality Assured</h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Enterprise-grade security and testing standards
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-xl border border-orange-500/30 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
                <div className="text-orange-400 mb-3">
                  <Star className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Expert Team</h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Senior developers with proven track records
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-xl border border-orange-500/30 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
                <div className="text-orange-400 mb-3">
                  <ArrowRight className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Scalable Solutions</h3>
                <p className="text-gray-200 text-sm leading-relaxed">
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

export default memo(HeroSection);
