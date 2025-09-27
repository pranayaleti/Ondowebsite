import { Link } from "react-router-dom";
import { SERVICE_AREAS } from "../utils/unifiedData";

const Footer = () => {
  // Get service areas data from consolidated utility
  const { states, topCities } = SERVICE_AREAS;

  return (
    <>
      {/* Structured Data for Footer */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Ondosoft",
            "description": "Ondosoft is a nationwide software development company offering freelancing, full stack development, SaaS solutions, and enterprise applications. We serve clients across all 50 states.",
            "url": "https://ondosoft.com",
            "logo": "https://ondosoft.com/logo2.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-123-4567",
              "contactType": "customer service",
              "email": "contact@ondosoft.com",
              "availableLanguage": "English"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Lehi",
              "addressRegion": "Utah",
              "addressCountry": "US"
            },
            "areaServed": {
              "@type": "Country",
              "name": "United States"
            },
            "serviceType": [
              "Freelancing Services",
              "Full Stack Development", 
              "SaaS Applications",
              "Web Development",
              "Mobile App Development",
              "Cloud Deployment",
              "E-commerce Solutions"
            ],
            "sameAs": [
              "https://facebook.com/ondosoft",
              "https://twitter.com/ondosoft",
              "https://instagram.com/ondosoft",
              "https://linkedin.com/company/ondosoft"
            ]
          })
        }}
      />
      <footer className="bg-gray-900 text-gray-200 py-12 mt-12" role="contentinfo">
        <div className="container mx-auto grid md:grid-cols-4 gap-8 px-6">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-3">Ondosoft</h3>
            <p className="text-sm leading-relaxed">
              Ondosoft is a nationwide software development company offering
              freelancing, full stack development, SaaS solutions, and enterprise
              applications. We serve clients across all 50 states.
            </p>
            <p className="mt-3 text-sm">
              📍 Headquarters: <span className="font-semibold">Lehi, Utah</span><br />
              📧 <a href="mailto:contact@ondosoft.com" className="hover:underline">contact@ondosoft.com</a><br />
              📞 <a href="tel:+15551234567" className="hover:underline">(555) 123-4567</a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/services" className="hover:underline">Services</Link></li>
              <li><Link to="/products" className="hover:underline">Portfolio</Link></li>
              <li><Link to="/faq" className="hover:underline">Blog</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:underline">Full Stack Development</Link></li>
              <li><Link to="/services" className="hover:underline">SaaS Applications</Link></li>
              <li><Link to="/services" className="hover:underline">Web Development</Link></li>
              <li><Link to="/services" className="hover:underline">Mobile Apps</Link></li>
              <li><Link to="/services" className="hover:underline">Cloud Deployment</Link></li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h4 className="text-lg font-semibold mb-3">About Ondosoft</h4>
            <p className="text-sm text-gray-300 mb-3">
              Leading software development company specializing in freelancing, full stack development, and SaaS solutions for businesses nationwide.
            </p>
            <div className="text-sm text-gray-300">
              <p>📍 Serving all 50 states</p>
              <p>🚀 Modern technologies</p>
              <p>💼 Enterprise solutions</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Ondosoft. All rights reserved. Freelancing | Full Stack Development | SaaS Applications
        </div>

        {/* Hidden SEO Section - Service Areas for Search Engines */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <h2>Software Development Services by State</h2>
          <p>Ondosoft provides freelancing, full stack development, and SaaS solutions across all 50 states:</p>
          <ul>
            {states.map(state => (
              <li key={state.slug}>
                <a href={`/services/${state.slug}`}>
                  Software development services in {state.name}
                </a>
              </li>
            ))}
          </ul>
          
          <h2>Top Cities for Software Development</h2>
          <p>Leading software development company serving major metropolitan areas:</p>
          <ul>
            {topCities.map(city => (
              <li key={city.slug}>
                <a href={`/services/${city.slug}`}>
                  Freelancing and full stack development in {city.displayName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
