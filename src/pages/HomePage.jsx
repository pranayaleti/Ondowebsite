import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import HeroSection from "../components/HeroSection";
import HeroCTA from "../components/HeroCTA";
import TestimonialCarousel from "../components/TestimonialCarousel";
import NewsletterSignup from "../components/NewsletterSignup";
import TrustBadges from "../components/TrustBadges";
import ConsultationWidget from "../components/ConsultationWidget";
import ConsultationModal from "../components/ConsultationModal";
import LiveChatWidget from "../components/LiveChatWidget";
import Footer from "../components/Footer";
import { SERVICE_AREAS } from "../utils/unifiedData";
import { companyInfo, getPostalAddressSchema, getContactPointSchema } from "../constants/companyInfo";
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
  
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${companyInfo.urls.website}/#organization`,
        "name": companyInfo.name,
        "url": companyInfo.urls.website,
        "logo": {
          "@type": "ImageObject",
          "url": `${companyInfo.urls.website}/logo2.png`,
          "width": 200,
          "height": 60
        },
        "description": "Full stack software development, freelancing, and SaaS solutions company serving businesses across the USA",
        "foundingDate": "2024",
        "contactPoint": { ...getContactPointSchema("customer service"), availableLanguage: "English" },
        "address": getPostalAddressSchema(),
        "sameAs": [
          "https://linkedin.com/company/ondosoft",
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
        "areaServed": [
          {
            "@type": "Country",
            "name": "United States"
          },
          {
            "@type": "City",
            "name": "Los Angeles",
            "containedInPlace": {
              "@type": "State",
              "name": "California"
            }
          },
          {
            "@type": "City",
            "name": "New York",
            "containedInPlace": {
              "@type": "State",
              "name": "New York"
            }
          },
          {
            "@type": "City",
            "name": "Chicago",
            "containedInPlace": {
              "@type": "State",
              "name": "Illinois"
            }
          },
          {
            "@type": "City",
            "name": "Houston",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          },
          {
            "@type": "City",
            "name": "Phoenix",
            "containedInPlace": {
              "@type": "State",
              "name": "Arizona"
            }
          },
          {
            "@type": "City",
            "name": "Philadelphia",
            "containedInPlace": {
              "@type": "State",
              "name": "Pennsylvania"
            }
          },
          {
            "@type": "City",
            "name": "San Antonio",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          },
          {
            "@type": "City",
            "name": "San Diego",
            "containedInPlace": {
              "@type": "State",
              "name": "California"
            }
          },
          {
            "@type": "City",
            "name": "Dallas",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          },
          {
            "@type": "City",
            "name": "San Jose",
            "containedInPlace": {
              "@type": "State",
              "name": "California"
            }
          },
          {
            "@type": "City",
            "name": "Austin",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          },
          {
            "@type": "City",
            "name": "Jacksonville",
            "containedInPlace": {
              "@type": "State",
              "name": "Florida"
            }
          },
          {
            "@type": "City",
            "name": "Fort Worth",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          },
          {
            "@type": "City",
            "name": "Columbus",
            "containedInPlace": {
              "@type": "State",
              "name": "Ohio"
            }
          },
          {
            "@type": "City",
            "name": "Charlotte",
            "containedInPlace": {
              "@type": "State",
              "name": "North Carolina"
            }
          },
          {
            "@type": "City",
            "name": "San Francisco",
            "containedInPlace": {
              "@type": "State",
              "name": "California"
            }
          },
          {
            "@type": "City",
            "name": "Indianapolis",
            "containedInPlace": {
              "@type": "State",
              "name": "Indiana"
            }
          },
          {
            "@type": "City",
            "name": "Seattle",
            "containedInPlace": {
              "@type": "State",
              "name": "Washington"
            }
          },
          {
            "@type": "City",
            "name": "Denver",
            "containedInPlace": {
              "@type": "State",
              "name": "Colorado"
            }
          },
          {
            "@type": "City",
            "name": "Washington",
            "containedInPlace": {
              "@type": "State",
              "name": "District of Columbia"
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Ondosoft - Hire Freelance Developers for Custom Web Apps & SaaS | Best Software Development Company Near Me"
        description="Looking for the best software development company near you? Ondosoft is a nationwide leader in custom web app development, SaaS applications, and freelance software development. Hire expert developers for React, Node.js, Python projects. Serving all 50 states with end-to-end solutions from small business websites to enterprise SaaS platforms. Get your free quote today!"
        keywords="best software development company near me, freelance developers for hire, build a SaaS application, custom web app development, hire software developers, software development companies, React developers, Node.js developers, Python developers, mobile app development, web application development, SaaS development, custom software development, software development services, hire developers near me, freelance software development, full stack developers, software development company USA, custom web development, mobile app developers, cloud application development, software development agency, hire developers online, software development consulting, custom software solutions, web development services, mobile development services, software development freelancers, tech consulting, software development near me, hire developers USA"
        canonicalUrl="https://ondosoft.com"
        structuredData={homeStructuredData}
      />
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div id="top" className="mx-auto pt-20">
          <HeroSection />
        </div>

        {/* Value Proposition Section */}
        <section className="py-20 bg-gradient-to-b from-black to-neutral-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose <span className="text-orange-500">Ondosoft</span>?
              </h2>
              <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
                We're not just another software development company. We're your strategic technology partner, 
                delivering innovative solutions that drive real business results.
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
        <section className="py-20 bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our <span className="text-orange-500">Development Services</span>
              </h2>
              <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
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
                <p className="text-neutral-300 mb-6 leading-relaxed">
                  Build powerful web applications with React, Node.js, and modern frameworks. 
                  Perfect for businesses looking to digitize their operations.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                    React & Next.js Development
                  </li>
                  <li className="flex items-center text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                    Node.js & Express Backend
                  </li>
                  <li className="flex items-center text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                    Database Design & Integration
                  </li>
                </ul>
                <a href="/contact" className="inline-flex items-center text-orange-400 hover:text-orange-300 font-semibold group-hover:translate-x-1 transition-transform">
                  Get Free Quote <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 p-8 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="bg-orange-500/20 p-3 rounded-lg mr-4">
                    <Cloud className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">SaaS Platform Development</h3>
                </div>
                <p className="text-neutral-300 mb-6 leading-relaxed">
                  Launch your software-as-a-service platform with our end-to-end SaaS development expertise. 
                  From MVP to enterprise scale.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                    Multi-tenant Architecture
                  </li>
                  <li className="flex items-center text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
                    Subscription Management
                  </li>
                  <li className="flex items-center text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-orange-400 mr-3 flex-shrink-0" />
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
        <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Trusted by Businesses Nationwide
              </h2>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
                Our track record speaks for itself. Join hundreds of satisfied clients who've transformed their businesses with our software solutions.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">500+</div>
                <div className="text-orange-100 text-lg">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">200+</div>
                <div className="text-orange-100 text-lg">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">10+</div>
                <div className="text-orange-100 text-lg">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-2">99%</div>
                <div className="text-orange-100 text-lg">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero CTA Section */}
        <HeroCTA />

        {/* Testimonial Carousel */}
        <TestimonialCarousel />

        {/* Trust Badges & Success Story */}
        <TrustBadges />

        {/* Newsletter Signup */}
        <NewsletterSignup />

        {/* Consultation Widget */}
        <ConsultationWidget />

        {/* Live Chat Widget */}
        <LiveChatWidget />

        <Footer />
        
        {/* Hidden SEO Section - Service Areas for Search Engines */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <h1>Software Development Services by State</h1>
          <p>Ondosoft provides freelancing, full stack development, and SaaS solutions across all 50 states including:</p>
          <ul>
            {SERVICE_AREAS.getHiddenSEOContent().states.map(state => (
              <li key={state.slug}>
                <a href={state.url}>
                  {state.linkText}
                </a>
              </li>
            ))}
          </ul>
          
          <h2>Top Cities for Software Development</h2>
          <p>Leading software development company serving major metropolitan areas:</p>
          <ul>
            {SERVICE_AREAS.getHiddenSEOContent().cities.map(city => (
              <li key={city.slug}>
                <a href={city.url}>
                  {city.linkText}
                </a>
              </li>
            ))}
          </ul>
          
          <h2>Best Software Development Companies Near Me</h2>
          <p>Find the best freelancing and full stack development services in your area. Ondosoft offers:</p>
          <ul>
            <li>Freelancing services for small businesses and startups</li>
            <li>Full stack development with React, Node.js, Python, and Java</li>
            <li>SaaS application design and development</li>
            <li>Custom web and mobile app development</li>
            <li>Cloud deployment and DevOps services</li>
          </ul>

          <h2>Software Development Services by City</h2>
          <p>Professional software development services available in major US cities including:</p>
          <ul>
            <li>Software development in Los Angeles, California</li>
            <li>Software development in New York, New York</li>
            <li>Software development in Chicago, Illinois</li>
            <li>Software development in Houston, Texas</li>
            <li>Software development in Phoenix, Arizona</li>
            <li>Software development in Philadelphia, Pennsylvania</li>
            <li>Software development in San Antonio, Texas</li>
            <li>Software development in San Diego, California</li>
            <li>Software development in Dallas, Texas</li>
            <li>Software development in San Jose, California</li>
            <li>Software development in Austin, Texas</li>
            <li>Software development in Jacksonville, Florida</li>
            <li>Software development in Fort Worth, Texas</li>
            <li>Software development in Columbus, Ohio</li>
            <li>Software development in Charlotte, North Carolina</li>
            <li>Software development in San Francisco, California</li>
            <li>Software development in Indianapolis, Indiana</li>
            <li>Software development in Seattle, Washington</li>
            <li>Software development in Denver, Colorado</li>
            <li>Software development in Washington, DC</li>
          </ul>

          <h2>Hire Software Developers Near Me</h2>
          <p>Looking for experienced software developers in your city? Ondosoft provides:</p>
          <ul>
            <li>Full stack developers for hire in major US cities</li>
            <li>React developers available for freelance projects</li>
            <li>Node.js developers for web application development</li>
            <li>Python developers for backend services and APIs</li>
            <li>Java developers for enterprise applications</li>
            <li>Mobile app developers for iOS and Android</li>
            <li>SaaS developers for platform development</li>
            <li>Cloud developers for AWS, Azure, and Google Cloud</li>
          </ul>

          <h2>Software Development Companies in Major Cities</h2>
          <p>Ondosoft is recognized as one of the top software development companies serving businesses across the United States. Our services include:</p>
          <ul>
            <li>Custom software development for startups and enterprises</li>
            <li>Web application development with modern frameworks</li>
            <li>Mobile app development for iOS and Android platforms</li>
            <li>SaaS platform design and development</li>
            <li>API development and integration services</li>
            <li>Database design and optimization</li>
            <li>Cloud migration and deployment services</li>
            <li>DevOps and CI/CD pipeline setup</li>
            <li>Software maintenance and support</li>
            <li>Technical consulting and architecture planning</li>
          </ul>
        </div>
      </div>
      <ConsultationWidget />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default HomePage;
