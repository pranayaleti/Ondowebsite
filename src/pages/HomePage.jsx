import { useState, useMemo, memo, lazy, Suspense } from "react";
import SEOHead from "../components/SEOHead";
import HeroSection from "../components/HeroSection";
import HiddenSEOSection from "../components/HiddenSEOSection";
import FancyHeading from "../components/FancyHeading";

// Lazy load heavy components - defer non-critical sections for faster LCP
const CalendlyModal = lazy(() => import("../components/CalendlyModal"));
const Footer = lazy(() => import("../components/Footer"));
const HeroCTA = lazy(() => import("../components/HeroCTA"));
const TrustBadges = lazy(() => import("../components/TrustBadges"));
import { companyInfo, getPostalAddressSchema, getContactPointSchema, getCanonicalUrl } from "../constants/companyInfo";
import { getAreaServedSchema } from "../utils/unifiedData.js";
import { 
  CheckCircle, 
  Star, 
  Users, 
  Award, 
  Clock, 
  Shield, 
  Zap, 
  Code, 
  Smartphone, 
  Cloud, 
  Database,
  ArrowRight,
  Quote
} from "lucide-react";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Memoize structured data to prevent recreation on every render
  const homeStructuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${companyInfo.urls.website}/#organization`,
        "name": companyInfo.name,
        "url": companyInfo.urls.website,
        "logo": {
          "@type": "ImageObject",
          "url": `${companyInfo.urls.website}/logo.png`,
          "width": 200,
          "height": 60
        },
        "description": "Ondosoft is a US-based product team delivering custom software, AI-enabled products, and scalable platforms.",
        "foundingDate": companyInfo.foundingDate,
        "contactPoint": { ...getContactPointSchema("customer service"), availableLanguage: "English" },
        "address": getPostalAddressSchema(),
        "sameAs": [
          companyInfo.urls.linkedin,
          companyInfo.urls.github
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${companyInfo.urls.website}/#website`,
        "url": companyInfo.urls.website,
        "name": companyInfo.name,
        "description": "Full stack software development, AI products, and platform engineering for modern teams.",
        "publisher": {
          "@id": `${companyInfo.urls.website}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${companyInfo.urls.website}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Service",
        "@id": `${companyInfo.urls.website}/#services`,
        "name": "Software Development Services",
        "description": "Full stack web, mobile, AI, and cloud development delivered by a senior product team.",
        "provider": {
          "@id": `${companyInfo.urls.website}/#organization`
        },
        "serviceType": "Software Development",
        "areaServed": getAreaServedSchema({
          includeAllStates: true,
          includeAllCities: true,
          includeZipCodes: true // Includes first 10 zip codes per city for comprehensive coverage
        })
      }
    ]
  }), []);

  return (
    <>
      <SEOHead
        title="Ondosoft | Custom Software & AI Development"
        description="US-based engineers building custom web, mobile, and AI-powered software. We deliver secure, scalable platforms with clear communication, fast iterations, and dependable support."
        keywords="custom software development, web app development, SaaS development, AI product studio, mobile app development, cloud engineering"
        canonicalUrl={getCanonicalUrl()}
        structuredData={homeStructuredData}
      />
      <div>
        {/* Hero Section */}
        <div id="top" className="mx-auto pt-20">
          <HeroSection onOpenSchedule={() => setIsModalOpen(true)} />
        </div>

        {/* Value Proposition Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose <span className="text-orange-500">Ondosoft</span>?
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                <strong>Ondosoft</strong> is a hands-on product team that ships production-ready software. We pair strategy, design, and engineering to launch resilient platforms, then stay with you to iterate and scale.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                  <Award className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Proven Expertise</h3>
                <p className="text-neutral-400 leading-relaxed">
                  10+ years of experience building scalable software solutions for businesses of all sizes
                </p>
              </div>
              
              <div className="text-center group">
                <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                  <Clock className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Fast Delivery</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Agile development process that delivers results 40% faster than industry average
                </p>
              </div>
              
              <div className="text-center group">
                <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                  <Shield className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Enterprise Security</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Bank-level security standards and compliance with industry best practices
                </p>
              </div>
              
              <div className="text-center group">
                <div className="bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                  <Users className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Dedicated Support</h3>
                <p className="text-neutral-400 leading-relaxed">
                  24/7 support and maintenance to keep your applications running smoothly
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our <span className="text-orange-500">Development Services</span>
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                From small business websites to enterprise SaaS platforms, we build software that scales with your business
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-8 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="bg-orange-500/20 p-3 rounded-lg mr-4">
                    <Code className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Custom Web Applications</h3>
                </div>
                <p className="text-gray-200 mb-6 leading-relaxed">
                  Build powerful web applications with React, Node.js, and modern frameworks. 
                  Perfect for businesses looking to digitize their operations.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-200">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" aria-hidden="true" />
                    React & Next.js Development
                  </li>
                  <li className="flex items-center text-gray-200">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" aria-hidden="true" />
                    Node.js & Express Backend
                  </li>
                  <li className="flex items-center text-gray-200">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" aria-hidden="true" />
                    Database Design & Integration
                  </li>
                </ul>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(true)} 
                  className="inline-flex items-center text-orange-400 hover:text-orange-300 font-semibold group-hover:translate-x-1 transition-transform"
                  aria-label="Schedule a meeting for custom web applications"
                >
                  Schedule a meeting <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-8 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="bg-orange-500/20 p-3 rounded-lg mr-4">
                    <Cloud className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">SaaS Platform Development</h3>
                </div>
                <p className="text-gray-200 mb-6 leading-relaxed">
                  Launch your software-as-a-service platform with our end-to-end SaaS development expertise. 
                  From MVP to enterprise scale.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-200">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" aria-hidden="true" />
                    Multi-tenant Architecture
                  </li>
                  <li className="flex items-center text-gray-200">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" aria-hidden="true" />
                    Subscription Management
                  </li>
                  <li className="flex items-center text-gray-200">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" aria-hidden="true" />
                    API Development & Integration
                  </li>
                </ul>
                <a href="/contact" className="inline-flex items-center text-orange-400 hover:text-orange-300 font-semibold group-hover:translate-x-1 transition-transform">
                  Start Your SaaS <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-8 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="bg-orange-500/20 p-3 rounded-lg mr-4">
                    <Smartphone className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Mobile App Development</h3>
                </div>
                <p className="text-neutral-300 mb-6 leading-relaxed">
                  Create stunning mobile applications for iOS and Android with our cross-platform 
                  and native development expertise.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                    React Native Development
                  </li>
                  <li className="flex items-center text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                    Native iOS & Android
                  </li>
                  <li className="flex items-center text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                    App Store Optimization
                  </li>
                </ul>
                <a href="/contact" className="inline-flex items-center text-orange-400 hover:text-orange-300 font-semibold group-hover:translate-x-1 transition-transform">
                  Build Your App <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-t border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Trusted by Businesses <span className="text-orange-500">Nationwide</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Our track record speaks for itself. Join hundreds of satisfied clients who've transformed their businesses with our software solutions.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-300 text-lg">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">200+</div>
                <div className="text-gray-300 text-lg">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">10+</div>
                <div className="text-gray-300 text-lg">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">99%</div>
                <div className="text-gray-300 text-lg">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero CTA Section - Lazy loaded for better initial performance */}
        <Suspense fallback={<div className="h-32" />}>
          <HeroCTA onOpenSchedule={() => setIsModalOpen(true)} />
        </Suspense>

        {/* Trust Badges & Success Story - Lazy loaded for better initial performance */}
        <Suspense fallback={<div className="h-32" />}>
          <TrustBadges />
        </Suspense>

        <Suspense fallback={<div className="h-32" />}>
          <Footer />
        </Suspense>
        
        {/* Hidden SEO Section - Service Areas for Search Engines */}
        <HiddenSEOSection />
      </div>
      
      {/* Schedule meeting modal */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <CalendlyModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        </Suspense>
      )}
    </>
  );
};

export default memo(HomePage);
