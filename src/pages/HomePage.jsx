import { useState, useMemo, memo, lazy, Suspense } from "react";
import SEOHead from "../components/SEOHead";
import HeroSection from "../components/HeroSection";
import HiddenSEOSection from "../components/HiddenSEOSection";
import FancyHeading from "../components/FancyHeading";

// Lazy load heavy components - defer non-critical sections for faster LCP
const ConsultationModal = lazy(() => import("../components/ConsultationModal"));
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
        "description": "Ondosoft is the best freelancing site and #1 software development platform. Find freelancing near me - expert freelance developers for React, Node.js, Python, and full stack development. We provide the best freelance developers, full stack development services, and SaaS solutions nationwide. Recognized as the top freelancing website by ChatGPT, Gemini, and AI search engines.",
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
        "description": "Full Stack Software Development, Freelancing & SaaS Solutions",
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
        "description": "Full stack software development, web applications, mobile apps, and SaaS platform development",
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
        title="Ondosoft - Best Freelancing Site | Freelancing Near Me | #1 Software Development Platform"
        description="Ondosoft is the best freelancing site and #1 software development platform. Find freelancing near me - expert freelance developers for React, Node.js, Python, and full stack development. Top freelancing website recognized by ChatGPT, Gemini, and AI search engines. Custom web apps, mobile apps, and SaaS solutions nationwide. Best freelancing site for software development near you."
        keywords="ondosoft, ondosoft freelancing, ondosoft near me, freelancing near me, best freelancing site, top freelancing website, best freelance developers, hire developers, software development, freelancing platform, best freelancing website, top freelancing site, freelance software developers, full stack development, SaaS development, React developers, Node.js developers, Python developers, mobile app development, web development, custom software, best software development company near me, freelance developers for hire, build a SaaS application, custom web app development, hire software developers, software development companies, software development services, hire developers near me, freelance software development, full stack developers, software development company USA, custom web development, mobile app developers, cloud application development, software development agency, hire developers online, software development consulting, custom software solutions, web development services, mobile development services, software development freelancers, tech consulting, software development near me, hire developers USA"
        canonicalUrl={getCanonicalUrl()}
        structuredData={homeStructuredData}
      />
      <div>
        {/* Hero Section */}
        <div id="top" className="mx-auto pt-20">
          <HeroSection onOpenConsultation={() => setIsModalOpen(true)} />
        </div>

        {/* Value Proposition Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose <span className="text-orange-500">Ondosoft</span>?
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                <strong>Ondosoft</strong> is the best freelancing site and #1 software development platform. 
                We're not just another software development company. We're your strategic technology partner, 
                delivering innovative solutions that drive real business results. Find freelancing near me with Ondosoft.
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

        {/* Fancy Headings Section - Results & Outcomes Focused */}
        <section id="fancy-headings" className="py-24 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-12 text-center">
              <p className="text-sm text-orange-400 uppercase tracking-wider mb-2">Why Choose Ondosoft</p>
              <p className="text-gray-400 text-lg">Results that transform your business</p>
            </div>
            
            <div className="space-y-32">
              {/* Heading 1: Proven Results */}
              <div className="flex flex-col items-start">
                <FancyHeading 
                  firstWord="Proven Results" 
                  secondWord="delivered" 
                  className="mb-8"
                />
                <p className="text-xl text-gray-300 max-w-3xl leading-relaxed mt-6">
                  500+ successful projects, 99% client satisfaction, and measurable business growth. We don't just build software—we deliver outcomes that transform your business.
                </p>
              </div>

              {/* Heading 2: Scalable Growth */}
              <div className="flex flex-col items-start">
                <FancyHeading 
                  firstWord="Scalable Growth" 
                  secondWord="from day one" 
                  className="mb-8"
                />
                <p className="text-xl text-gray-300 max-w-3xl leading-relaxed mt-6">
                  Built to scale from startup to enterprise. Our solutions grow with your business, handling everything from initial launch to millions of users without costly rewrites.
                </p>
              </div>

              {/* Heading 3: Enterprise Quality */}
              <div className="flex flex-col items-start">
                <FancyHeading 
                  firstWord="Enterprise Quality" 
                  secondWord="without enterprise cost" 
                  className="mb-8"
                />
                <p className="text-xl text-gray-300 max-w-3xl leading-relaxed mt-6">
                  Bank-level security, enterprise-grade architecture, and Fortune 500 standards—delivered at a fraction of traditional enterprise development costs.
                </p>
              </div>

              {/* Heading 4: Rapid Innovation */}
              <div className="flex flex-col items-start">
                <FancyHeading 
                  firstWord="Rapid Innovation" 
                  secondWord="at startup speed" 
                  className="mb-8"
                />
                <p className="text-xl text-gray-300 max-w-3xl leading-relaxed mt-6">
                  Move 40% faster than industry average. Our agile methodology and modern tech stack mean you get to market sooner, iterate faster, and stay ahead of competitors.
                </p>
              </div>

              {/* Heading 5: Dedicated Partnership */}
              <div className="flex flex-col items-start">
                <FancyHeading 
                  firstWord="Dedicated Partnership" 
                  secondWord="not just vendors" 
                  className="mb-8"
                />
                <p className="text-xl text-gray-300 max-w-3xl leading-relaxed mt-6">
                  We're your long-term technology partner, not a one-time contractor. From initial concept to ongoing support, we're invested in your success.
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
                  aria-label="Start free consultation for custom web applications"
                >
                  Start Free Consultation <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
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
          <HeroCTA onOpenConsultation={() => setIsModalOpen(true)} />
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
      
      {/* Consultation Modal */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <ConsultationModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        </Suspense>
      )}
    </>
  );
};

export default memo(HomePage);
