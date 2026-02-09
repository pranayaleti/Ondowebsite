import { useState, lazy, Suspense } from 'react';
import SEOHead from '../components/SEOHead';
import ConsultationWidget from '../components/ConsultationWidget';

// Lazy load heavy components
const Footer = lazy(() => import('../components/Footer'));
const ConsultationModal = lazy(() => import('../components/ConsultationModal'));
import { companyInfo, getCanonicalUrl } from '../constants/companyInfo';
import ContactInfo from '../components/ContactInfo';
import { CheckCircle, Code, Cloud, Smartphone, Globe, Zap, Shield, Users, Award, Clock, Target, TrendingUp } from 'lucide-react';

const CapabilitiesDeckPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canonical = getCanonicalUrl('/capabilities-deck');
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#capabilities`,
        "name": "Capabilities Deck",
        "url": canonical,
        "description": "Ondosoft capabilities deck covering services, expertise, and team."
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": companyInfo.urls.website
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Capabilities Deck",
            "item": canonical
          }
        ]
      }
    ]
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      <SEOHead
        title="Capabilities Deck | Ondosoft Software Development"
        description="Download Ondosoft's comprehensive capabilities deck. Learn about our software development services, technology expertise, team capabilities, and how we can help transform your business."
        keywords="capabilities deck, company capabilities, software development services, technology expertise, Ondosoft capabilities"
        canonicalUrl={canonical}
        structuredData={structuredData}
      />
      
      <div className="print:bg-white">
        {/* Hero Section */}
        <section className="text-white py-20 border-b border-gray-700/50 print:bg-gray-900 print:border-gray-600">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Ondosoft <span className="text-orange-500">Capabilities Deck</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 drop-shadow-md">
                Comprehensive Software Development Services & Expertise
              </p>
              <button
                onClick={handleDownload}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors print:hidden"
              >
                Download PDF
              </button>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 print:py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12 print:space-y-8">
              
              {/* Company Overview */}
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 print:bg-white print:border-gray-300 print:shadow-none">
                <h2 className="text-3xl font-bold text-white mb-6 print:text-black">Company Overview</h2>
                <div className="text-gray-300 space-y-4 print:text-gray-700">
                  <p className="text-lg leading-relaxed">
                    <strong className="text-orange-500 print:text-orange-600">Ondosoft</strong> is a nationwide software development company specializing in full stack and SaaS solutions for businesses across all 50 states. We combine technical expertise with business understanding to deliver high-quality software that drives growth and innovation.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 print:text-black">Our Mission</h3>
                      <p className="text-gray-300 print:text-gray-600">
                        To empower businesses with cutting-edge software solutions that transform ideas into scalable, profitable digital products.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3 print:text-black">Our Vision</h3>
                      <p className="text-gray-300 print:text-gray-600">
                        To be the trusted technology partner for businesses nationwide, delivering exceptional software development services that drive measurable results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Services */}
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 print:bg-white print:border-gray-300">
                <h2 className="text-3xl font-bold text-white mb-6 print:text-black">Core Services</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <Code className="h-8 w-8 text-orange-500" />,
                      title: "Full Stack Development",
                      description: "End-to-end web application development using React, Node.js, Python, and modern frameworks. From frontend UI to backend APIs and databases.",
                      features: ["React & Next.js", "Node.js & Express", "Python & Django", "REST & GraphQL APIs", "Database Design"]
                    },
                    {
                      icon: <Cloud className="h-8 w-8 text-orange-500" />,
                      title: "SaaS Platform Development",
                      description: "Complete SaaS product development from concept to scale. Multi-tenant architecture, subscription management, and cloud deployment.",
                      features: ["SaaS Architecture", "Subscription Management", "Multi-tenant Systems", "Payment Integration", "Scalable Infrastructure"]
                    },
                    {
                      icon: <Smartphone className="h-8 w-8 text-orange-500" />,
                      title: "Mobile App Development",
                      description: "Native iOS/Android and cross-platform mobile applications. React Native, Flutter, and native development expertise.",
                      features: ["iOS & Android", "React Native", "Flutter", "Native Development", "App Store Deployment"]
                    },
                    {
                      icon: <Globe className="h-8 w-8 text-orange-500" />,
                      title: "Web Development",
                      description: "Custom websites and web applications with responsive design, SEO optimization, and modern user experiences.",
                      features: ["Responsive Design", "SEO Optimization", "E-commerce Solutions", "CMS Integration", "Performance Optimization"]
                    },
                    {
                      icon: <Zap className="h-8 w-8 text-orange-500" />,
                      title: "Freelancing Services",
                      description: "Flexible software development and consulting services. Project-based work, dedicated teams, and ongoing support.",
                      features: ["Project-Based Work", "Dedicated Teams", "Technical Consulting", "Code Reviews", "Ongoing Support"]
                    },
                    {
                      icon: <Shield className="h-8 w-8 text-orange-500" />,
                      title: "Cloud Deployment & DevOps",
                      description: "Cloud infrastructure setup, CI/CD pipelines, containerization, and ongoing infrastructure management.",
                      features: ["AWS, Azure, GCP", "Docker & Kubernetes", "CI/CD Pipelines", "Infrastructure as Code", "Monitoring & Logging"]
                    }
                  ].map((service, index) => (
                    <div key={index} className="bg-gray-900 p-6 rounded-lg border border-gray-700 print:bg-gray-50 print:border-gray-200">
                      <div className="flex items-center mb-4">
                        {service.icon}
                        <h3 className="text-xl font-semibold text-white ml-3 print:text-black">{service.title}</h3>
                      </div>
                      <p className="text-gray-300 mb-4 print:text-gray-600">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-400 print:text-gray-500">
                            <CheckCircle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Stack */}
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 print:bg-white print:border-gray-300">
                <h2 className="text-3xl font-bold text-white mb-6 print:text-black">Technology Stack & Expertise</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 print:text-black">Frontend Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Material-UI', 'Redux', 'GraphQL'].map((tech) => (
                        <span key={tech} className="bg-gray-900 text-gray-300 px-3 py-1 rounded text-sm print:bg-gray-100 print:text-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 print:text-black">Backend Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Node.js', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'Express.js', 'PostgreSQL', 'MongoDB', 'Redis'].map((tech) => (
                        <span key={tech} className="bg-gray-900 text-gray-300 px-3 py-1 rounded text-sm print:bg-gray-100 print:text-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 print:text-black">Cloud & DevOps</h3>
                    <div className="flex flex-wrap gap-2">
                      {['AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions', 'CI/CD', 'Microservices'].map((tech) => (
                        <span key={tech} className="bg-gray-900 text-gray-300 px-3 py-1 rounded text-sm print:bg-gray-100 print:text-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 print:text-black">Mobile & Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin', 'Git', 'Jira', 'Agile', 'Scrum'].map((tech) => (
                        <span key={tech} className="bg-gray-900 text-gray-300 px-3 py-1 rounded text-sm print:bg-gray-100 print:text-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Industries Served */}
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 print:bg-white print:border-gray-300">
                <h2 className="text-3xl font-bold text-white mb-6 print:text-black">Industries We Serve</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    'E-commerce & Retail',
                    'Healthcare & Medical',
                    'Finance & FinTech',
                    'Education & EdTech',
                    'Real Estate',
                    'Manufacturing',
                    'Logistics & Supply Chain',
                    'Food & Beverage',
                    'Entertainment & Media',
                    'Travel & Hospitality',
                    'SaaS & Technology',
                    'Non-Profit Organizations'
                  ].map((industry) => (
                    <div key={industry} className="flex items-center text-gray-300 print:text-gray-700">
                      <CheckCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                      {industry}
                    </div>
                  ))}
                </div>
              </div>

              {/* Development Process */}
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 print:bg-white print:border-gray-300">
                <h2 className="text-3xl font-bold text-white mb-6 print:text-black">Our Development Process</h2>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    {
                      step: '01',
                      title: 'Discovery & Planning',
                      description: 'Understanding your business goals, requirements, and technical needs. Creating detailed project plans and timelines.'
                    },
                    {
                      step: '02',
                      title: 'Design & Architecture',
                      description: 'Creating system architecture, UI/UX designs, and technical specifications. Ensuring scalability and maintainability.'
                    },
                    {
                      step: '03',
                      title: 'Development & Testing',
                      description: 'Agile development with regular updates. Comprehensive testing including unit, integration, and user acceptance testing.'
                    },
                    {
                      step: '04',
                      title: 'Deployment & Support',
                      description: 'Cloud deployment, CI/CD setup, and ongoing maintenance. 24/7 support and continuous improvement.'
                    }
                  ].map((phase) => (
                    <div key={phase.step} className="bg-gray-900 p-6 rounded-lg border border-gray-700 print:bg-gray-50 print:border-gray-200">
                      <div className="text-4xl font-bold text-orange-500 mb-3 print:text-orange-600">{phase.step}</div>
                      <h3 className="text-xl font-semibold text-white mb-3 print:text-black">{phase.title}</h3>
                      <p className="text-gray-300 text-sm print:text-gray-600">{phase.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Choose Ondosoft */}
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 print:bg-white print:border-gray-300">
                <h2 className="text-3xl font-bold text-white mb-6 print:text-black">Why Choose Ondosoft</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <Users className="h-6 w-6 text-orange-500" />,
                      title: 'Experienced Team',
                      description: 'Skilled developers with years of experience in modern technologies and best practices.'
                    },
                    {
                      icon: <Award className="h-6 w-6 text-orange-500" />,
                      title: 'Quality Assurance',
                      description: 'Rigorous testing and code review processes ensuring high-quality, bug-free software.'
                    },
                    {
                      icon: <Clock className="h-6 w-6 text-orange-500" />,
                      title: 'Timely Delivery',
                      description: 'Agile methodology with regular milestones and on-time project completion.'
                    },
                    {
                      icon: <Target className="h-6 w-6 text-orange-500" />,
                      title: 'Business Focused',
                      description: 'Understanding your business goals and delivering solutions that drive real value.'
                    },
                    {
                      icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
                      title: 'Scalable Solutions',
                      description: 'Building software that grows with your business, from startup to enterprise scale.'
                    },
                    {
                      icon: <Shield className="h-6 w-6 text-orange-500" />,
                      title: 'Secure & Compliant',
                      description: 'Security-first approach with GDPR, CCPA compliance and industry-standard practices.'
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start bg-gray-900 p-4 rounded-lg border border-gray-700 print:bg-gray-50 print:border-gray-200">
                      <div className="flex-shrink-0 mr-4">{benefit.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2 print:text-black">{benefit.title}</h3>
                        <p className="text-gray-300 text-sm print:text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 print:bg-white print:border-gray-300">
                <h2 className="text-3xl font-bold text-white mb-6 print:text-black">Nationwide Coverage</h2>
                <p className="text-gray-300 mb-4 print:text-gray-700">
                  Ondosoft provides software development services across all 50 states. We serve clients in major metropolitan areas including:
                </p>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
                    'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
                    'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
                    'San Francisco, CA', 'Columbus, OH', 'Fort Worth, TX', 'Charlotte, NC'
                  ].map((city) => (
                    <div key={city} className="text-gray-300 text-sm print:text-gray-700">
                      • {city}
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-4 print:text-gray-500">
                  And many more cities across the United States
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700/50 print:bg-gray-100 print:border-gray-300">
                <h2 className="text-3xl font-bold text-white mb-6 print:text-black">Get Started Today</h2>
                <p className="text-gray-300 mb-6 text-lg print:text-gray-700 print:hidden">
                  Ready to transform your business with custom software solutions? Contact us for a free consultation.
                </p>
                <p className="text-gray-300 mb-6 text-lg hidden print:block print:text-gray-700">
                  Ready to transform your business with custom software solutions? Contact us today.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <ContactInfo variant="detailed" className="print:text-gray-700" />
                </div>
                <div className="mt-6 print:hidden">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Schedule Free Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Suspense fallback={<div className="h-32" />}>
        <Footer />
      </Suspense>
      <div className="print:hidden">
        <ConsultationWidget />
        {isModalOpen && (
          <Suspense fallback={null}>
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </Suspense>
        )}
      </div>
      
      <style>{`
        @media print {
          .print\\:bg-white { background-color: white !important; }
          .print\\:bg-gray-50 { background-color: #f9fafb !important; }
          .print\\:bg-gray-100 { background-color: #f3f4f6 !important; }
          .print\\:text-black { color: black !important; }
          .print\\:text-gray-600 { color: #4b5563 !important; }
          .print\\:text-gray-700 { color: #374151 !important; }
          .print\\:text-gray-500 { color: #6b7280 !important; }
          .print\\:text-orange-600 { color: #ea580c !important; }
          .print\\:border-gray-200 { border-color: #e5e7eb !important; }
          .print\\:border-gray-300 { border-color: #d1d5d6 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:py-8 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
          .print\\:space-y-8 > * + * { margin-top: 2rem !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default CapabilitiesDeckPage;

