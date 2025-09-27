import React from "react";
import SEOHead from "../components/SEOHead";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const ContactPage = () => {
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Ondosoft",
    "description": "Get in touch with Ondosoft for software development, freelancing, and SaaS solutions. Hire developers for your next project.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Ondosoft",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-0123",
        "contactType": "customer service",
        "availableLanguage": "English"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      }
    }
  };

  return (
    <>
      <SEOHead
        title="Contact Ondosoft | Hire Developers for Software Development & SaaS Solutions"
        description="Contact Ondosoft for professional software development, freelancing services, and SaaS solutions. Get a free quote for your React, Node.js, Python, or Java project. Serving businesses across the USA."
        keywords="contact ondosoft, hire developers, software development contact, SaaS development quote, freelancing services, React developers, Node.js developers, Python developers"
        canonicalUrl="https://ondosoft.com/contact"
        structuredData={contactStructuredData}
      />
      <div className="min-h-screen bg-black">
        <div className="mx-auto pt-20">
          <div id="contact" className="scroll-mt-20">
            <Contact />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
