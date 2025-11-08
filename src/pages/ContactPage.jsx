import { useState } from "react";
import SEOHead from "../components/SEOHead";
import Contact from "../components/Contact";
import ConsultationModal from "../components/ConsultationModal";
import Footer from "../components/Footer";
import { companyInfo, getPostalAddressSchema, getContactPointSchema } from "../constants/companyInfo";

const ContactPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": `Contact ${companyInfo.name}`,
    "description": "Get in touch with Ondosoft for software development, freelancing, and SaaS solutions. Hire developers for your next project.",
    "mainEntity": {
      "@type": "Organization",
      "name": companyInfo.name,
      "contactPoint": { ...getContactPointSchema("customer service"), availableLanguage: "English" },
      "address": getPostalAddressSchema()
    }
  };

  return (
    <>
      <SEOHead
        title={`Contact ${companyInfo.name} | Hire Developers for Software Development & SaaS Solutions`}
        description={`Contact ${companyInfo.name} for professional software development, freelancing services, and SaaS solutions. Start your free consultation for your React, Node.js, Python, or Java project. Serving businesses across the USA. Call ${companyInfo.phoneDisplay} or email us today!`}
        keywords="contact ondosoft, hire developers, software development contact, SaaS development quote, freelancing services, React developers, Node.js developers, Python developers"
        canonicalUrl={`${companyInfo.urls.website}/contact`}
        structuredData={contactStructuredData}
      />
      <div>
        <div className="mx-auto pt-20">
          <div id="contact" className="scroll-mt-20">
            <Contact onOpenConsultation={() => setIsModalOpen(true)} />
          </div>
        </div>
        <Footer />
        <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default ContactPage;
