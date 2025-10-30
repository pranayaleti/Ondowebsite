import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import ServiceSchema from "../components/ServiceSchema";
import Services from "../components/Services";
import HeroCTA from "../components/HeroCTA";
import ConsultationWidget from "../components/ConsultationWidget";
import ConsultationModal from "../components/ConsultationModal";
import Footer from "../components/Footer";

const ServicesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://ondosoft.com/services#services",
        "name": "Software Development Services",
        "description": "Full stack software development, web applications, mobile apps, and SaaS platform development",
        "provider": {
          "@id": "https://ondosoft.com/#organization"
        },
        "serviceType": "Software Development",
        "areaServed": {
          "@type": "Country",
          "name": "United States"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Software Development Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Full Stack Web Development",
                "description": "Complete web application development using React, Node.js, Python, and modern frameworks"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "SaaS Platform Development",
                "description": "End-to-end SaaS product design, development, and scaling solutions"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Mobile App Development",
                "description": "Native and cross-platform mobile application development"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Freelancing Services",
                "description": "Flexible software development and consulting services for businesses"
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Software Development Services | Full Stack, SaaS & Freelancing | Ondosoft"
        description="Professional software development services including full stack web development, SaaS platform creation, mobile app development, and freelancing solutions. Serving businesses across the USA with React, Node.js, Python, and cloud technologies. Start your free consultation today!"
        keywords="software development services, full stack development, SaaS development, freelancing services, web app development, mobile app development, React, Node.js, Python, Java, cloud deployment, hire developers"
        canonicalUrl="https://ondosoft.com/services"
        structuredData={servicesStructuredData}
      />
      <ServiceSchema
        serviceName="Software Development Services"
        serviceDescription="Comprehensive software development services including full stack web development, SaaS platform creation, mobile app development, and freelancing solutions across the United States."
        serviceType="Software Development"
        pageUrl="https://ondosoft.com/services"
      />
      <div className="min-h-screen bg-black">
        <div className="mx-auto pt-20">
          <div id="services" className="scroll-mt-20">
            <Services />
          </div>
        </div>
        
        {/* Hero CTA Section */}
        <HeroCTA onOpenConsultation={() => setIsModalOpen(true)} />
        
        <Footer />
        <ConsultationWidget />
        <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default ServicesPage;
