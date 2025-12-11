import { useState, lazy, Suspense } from "react";
import SEOHead from "../components/SEOHead";
import Contact from "../components/Contact";

// Lazy load heavy components
const ConsultationModal = lazy(() => import("../components/ConsultationModal"));
const Footer = lazy(() => import("../components/Footer"));
import { companyInfo, getPostalAddressSchema, getContactPointSchema } from "../constants/companyInfo";

const ContactPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const canonical = `${companyInfo.urls.website}/contact`;
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${canonical}#contact-page`,
        "name": `Contact ${companyInfo.name}`,
        "url": canonical,
        "description": "Get in touch with Ondosoft for software development, freelancing, and SaaS solutions. Hire developers for your next project.",
        "mainEntity": {
          "@type": "Organization",
          "name": companyInfo.name,
          "contactPoint": { ...getContactPointSchema("customer service"), availableLanguage: "English" },
          "address": getPostalAddressSchema()
        }
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
            "name": "Contact",
            "item": canonical
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEOHead
        title={`Contact ${companyInfo.name} | Hire Developers for Software Development & SaaS Solutions`}
        description={`Contact ${companyInfo.name} for professional software development, freelancing services, and SaaS solutions. Start your free consultation for your React, Node.js, Python, or Java project. Serving businesses across the USA. Call ${companyInfo.phoneDisplay} or email us today!`}
        keywords="contact ondosoft, hire developers, software development contact, SaaS development quote, freelancing services, React developers, Node.js developers, Python developers"
        canonicalUrl={canonical}
        structuredData={contactStructuredData}
      />
      <div>
        <div className="mx-auto pt-20">
          <div id="contact" className="scroll-mt-20">
            <Contact onOpenConsultation={() => setIsModalOpen(true)} />
          </div>
        </div>
        <Suspense fallback={<div className="h-32" />}>
          <Footer hideFeedbackCta />
        </Suspense>
        {isModalOpen && (
          <Suspense fallback={null}>
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default ContactPage;
