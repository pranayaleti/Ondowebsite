import { Link } from "react-router-dom";
import { memo, useMemo } from "react";
import { companyInfo, getPostalAddressSchema, getContactPointSchema } from "../constants/companyInfo";
import { navItems } from "../constants/data";

const Footer = ({ hideFeedbackCta = false }) => {
  // Memoize links to prevent recalculation on every render
  const quickLinks = useMemo(() => {
    const allLinks = [
      { label: "Home", href: "/" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Services", href: "/services" },
      { label: "Blogs", href: "/blogs" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Testimonials", href: "/testimonials" },
    ];
    const navbarHrefs = navItems.map(item => item.href);
    return allLinks.filter(link => !navbarHrefs.includes(link.href));
  }, []);

  // Memoize structured data
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": companyInfo.name,
    "description": "Ondosoft is a US-based product team building custom software, SaaS platforms, and AI-enabled experiences for businesses nationwide.",
    "url": companyInfo.urls.website,
    "logo": `${companyInfo.urls.website}/logo.png`,
    "contactPoint": { ...getContactPointSchema("customer service"), availableLanguage: "English" },
    "address": getPostalAddressSchema(),
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceType": [
      "Full Stack Development",
      "SaaS Applications",
      "Web Development",
      "Mobile App Development",
      "Cloud Deployment",
      "E-commerce Solutions"
    ]
  }), []);

  return (
    <>
      {/* Structured Data for Footer */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <footer className="text-gray-200 mt-12 md:mt-16 pt-8 md:pt-12 pb-4" role="contentinfo">
        <div className="container mx-auto grid md:grid-cols-4 gap-8 px-6">
          {/* Company Description */}
          <div className="pr-8">
            <h3 className="text-xl font-bold mb-3">Ondosoft</h3>
            <p className="text-sm leading-relaxed">
              Ondosoft is a senior product team that designs, builds, and maintains modern software. We ship secure web, mobile, and platform experiences with clear communication and dependable support.
            </p>
          </div>

          {/* Quick Links - Only show links NOT in navbar */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="hover:underline">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:underline">
                  Portfolio
                </Link>
              </li>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
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

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${companyInfo.address.streetAddress}, ${companyInfo.address.addressLocality}, ${companyInfo.address.addressRegion} ${companyInfo.address.postalCode}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {`${companyInfo.address.streetAddress}, ${companyInfo.address.addressLocality}, ${companyInfo.address.addressRegion} ${companyInfo.address.postalCode}`}
                </a>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <a href={`mailto:${companyInfo.email}`} className="hover:underline">{companyInfo.email}</a>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📞</span>
                <a href={`tel:${companyInfo.phoneE164}`} className="hover:underline">{companyInfo.phoneDisplay}</a>
              </li>
            </ul>
            {!hideFeedbackCta && (
              <div className="mt-4 p-4 rounded-lg border border-orange-500/30 bg-neutral-800/60">
                <p className="text-orange-400 font-semibold text-sm">Got ideas? We're listening!</p>
                <p className="text-gray-200 text-xs mt-1 mb-2">Share feedback to help us build better experiences.</p>
                <Link
                  to="/contact"
                  className="inline-block text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2 rounded-md hover:from-orange-600 hover:to-orange-700 transition-colors"
                >
                  Share feedback
                </Link>
              </div>
            )}

          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 pb-4">
          {/* Mobile Layout - Two lines */}
          <div className="flex flex-col items-center gap-2 text-xs text-gray-400 px-4 md:hidden">
            <div className="text-center">© {new Date().getFullYear()} Ondosoft. All rights reserved. Software Development & SaaS Platforms</div>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              <Link to="/legal" className="hover:text-orange-500 hover:underline whitespace-nowrap">Legal</Link>
              <Link to="/nda" className="hover:text-orange-500 hover:underline whitespace-nowrap">NDA</Link>
              <Link to="/privacy-policy" className="hover:text-orange-500 hover:underline whitespace-nowrap">Privacy Policy</Link>
              <Link to="/licensing" className="hover:text-orange-500 hover:underline whitespace-nowrap">Licensing</Link>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              <Link to="/terms-of-use" className="hover:text-orange-500 hover:underline whitespace-nowrap">Terms of Use</Link>
              <Link to="/accessibility" className="hover:text-orange-500 hover:underline whitespace-nowrap">Accessibility</Link>
              <Link to="/sitemap" className="hover:text-orange-500 hover:underline whitespace-nowrap">Site Map</Link>
            </div>
          </div>
          
          {/* Desktop Layout - Single line with gap, centered */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 px-4">
            <span className="whitespace-nowrap">© {new Date().getFullYear()} Ondosoft. All rights reserved. Software Development & SaaS Platforms</span>
            <span>|</span>
            <Link to="/legal" className="hover:text-orange-500 hover:underline whitespace-nowrap">Legal</Link>
            <Link to="/nda" className="hover:text-orange-500 hover:underline whitespace-nowrap">NDA</Link>
            <Link to="/privacy-policy" className="hover:text-orange-500 hover:underline whitespace-nowrap">Privacy Policy</Link>
            <Link to="/licensing" className="hover:text-orange-500 hover:underline whitespace-nowrap">Licensing</Link>
            <Link to="/terms-of-use" className="hover:text-orange-500 hover:underline whitespace-nowrap">Terms of Use</Link>
            <Link to="/accessibility" className="hover:text-orange-500 hover:underline whitespace-nowrap">Accessibility</Link>
            <Link to="/sitemap" className="hover:text-orange-500 hover:underline whitespace-nowrap">Site Map</Link>
          </div>
        </div>

      </footer>
    </>
  );
};

export default memo(Footer);
