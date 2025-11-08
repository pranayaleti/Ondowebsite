import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import Pricing from "../components/Pricing";
import ConsultationWidget from "../components/ConsultationWidget";
import ConsultationModal from "../components/ConsultationModal";
import Footer from "../components/Footer";

const PricingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preset, setPreset] = useState(null);
  
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
        "name": "UI/UX Master Suite",
        "price": "1200",
        "priceCurrency": "USD",
        "description": "Professional website with 5-8 pages, mobile-responsive design, and basic SEO optimization"
      },
      {
        "@type": "Offer",
        "name": "Full Stack Development",
        "price": "3000",
        "priceCurrency": "USD",
        "description": "Professional website with custom web application features, user authentication, admin dashboard, and database integration"
      },
      {
        "@type": "Offer",
        "name": "Complete SaaS Ecosystem",
        "price": "8500",
        "priceCurrency": "USD",
        "description": "Complete SaaS solution with multi-tenant architecture and payment processing"
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Software Development Pricing | Ondosoft Freelancing & SaaS Solutions"
        description="Transparent pricing for software development services. Get quotes for React, Node.js, Python web apps, SaaS platforms, and freelancing solutions. Serving businesses across the USA. Starting from $1,200 for starter websites."
        keywords="software development pricing, hire developers cost, SaaS development pricing, freelancing rates, React development cost, Node.js pricing, web app development cost"
        canonicalUrl="https://ondosoft.com/pricing"
        structuredData={pricingStructuredData}
      />
      <div>
        <div className="mx-auto pt-20">
          <div id="pricing" className="scroll-mt-20">
            <Pricing onConsult={(plan) => { setPreset(plan); setIsModalOpen(true); }} />
          </div>
        </div>
        <Footer />
        <ConsultationWidget />
        <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} preset={preset} />
      </div>
    </>
  );
};

export default PricingPage;
