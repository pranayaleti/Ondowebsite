import { useState, lazy, Suspense } from "react";
import SEOHead from "../components/SEOHead";
import { pricingPlans } from "../constants/pricing";
import { companyInfo, getCanonicalUrl } from "../constants/companyInfo";

// Lazy load heavy components
const Pricing = lazy(() => import("../components/Pricing"));
const CalendlyModal = lazy(() => import("../components/CalendlyModal"));
const Footer = lazy(() => import("../components/Footer"));

const PricingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preset, setPreset] = useState(null);
  
  const canonical = getCanonicalUrl('/pricing');

  // Generate structured data from pricing plans
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#pricing`,
        "name": "Software Development Pricing",
        "description": "Transparent pricing for software development, SaaS solutions, and platform builds. Choose from starter websites to enterprise-grade launches.",
        "provider": {
          "@type": "Organization",
          "name": companyInfo.name
        },
        "offers": pricingPlans
          .filter(plan => plan.price !== null) // Only include plans with prices
          .map(plan => ({
            "@type": "Offer",
            "name": plan.title,
            "price": plan.price.toString(),
            "priceCurrency": plan.currency,
            "description": plan.description
          }))
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
            "name": "Pricing",
            "item": canonical
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Software Development Pricing | Ondosoft"
        description="Transparent pricing for software development services. Get quotes for React, Node.js, and Python web apps, SaaS platforms, and cloud builds. Serving businesses across the USA."
        keywords="software development pricing, SaaS development pricing, React development cost, Node.js pricing, web app development cost, cloud development pricing"
        canonicalUrl={canonical}
        structuredData={pricingStructuredData}
      />
      <div>
        <div className="mx-auto pt-20">
          <div id="pricing" className="scroll-mt-20">
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>}>
              <Pricing onConsult={(plan) => { setPreset(plan); setIsModalOpen(true); }} />
            </Suspense>
          </div>
        </div>
        <Suspense fallback={<div className="h-32" />}>
          <Footer />
        </Suspense>
        {isModalOpen && (
          <Suspense fallback={null}>
            <CalendlyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default PricingPage;
