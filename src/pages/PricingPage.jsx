import React from "react";
import SEOHead from "../components/SEOHead";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

const PricingPage = () => {
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Software Development Pricing",
    "description": "Transparent pricing for software development, SaaS solutions, and freelancing services. Choose from small business websites to enterprise SaaS platforms.",
    "provider": {
      "@type": "Organization",
      "name": "Ondosoft"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Small Business Website",
        "price": "2500",
        "priceCurrency": "USD",
        "description": "Professional website with 5-10 pages, mobile-responsive design, and SEO optimization"
      },
      {
        "@type": "Offer",
        "name": "Custom Web Application",
        "price": "8500",
        "priceCurrency": "USD",
        "description": "Custom web application with user authentication, database, and admin dashboard"
      },
      {
        "@type": "Offer",
        "name": "SaaS Platform",
        "price": "25000",
        "priceCurrency": "USD",
        "description": "Complete SaaS solution with multi-tenant architecture and payment processing"
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Software Development Pricing | Ondosoft Freelancing & SaaS Solutions"
        description="Transparent pricing for software development services. Get quotes for React, Node.js, Python web apps, SaaS platforms, and freelancing solutions. Serving businesses across the USA."
        keywords="software development pricing, hire developers cost, SaaS development pricing, freelancing rates, React development cost, Node.js pricing, web app development cost"
        canonicalUrl="https://ondosoft.com/pricing"
        structuredData={pricingStructuredData}
      />
      <div className="min-h-screen bg-black">
        <div className="mx-auto pt-20">
          <div id="pricing" className="scroll-mt-20">
            <Pricing />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PricingPage;
