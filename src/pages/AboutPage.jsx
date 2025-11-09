import { useState, lazy, Suspense } from "react";
import SEOHead from "../components/SEOHead";
import ConsultationWidget from "../components/ConsultationWidget";

// Lazy load heavy components
const About = lazy(() => import("../components/About"));
const ConsultationModal = lazy(() => import("../components/ConsultationModal"));

const AboutPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Ondosoft",
    "description": "Learn about Ondosoft's mission, team, and expertise in software development, SaaS solutions, and freelancing services. Serving businesses across the USA with React, Node.js, Python, and cloud technologies.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Ondosoft",
      "description": "Full stack software development, freelancing, and SaaS solutions company",
      "foundingDate": "2024",
      "numberOfEmployees": "10-50",
      "industry": "Software Development",
      "knowsAbout": [
        "React Development",
        "Node.js Development", 
        "Python Development",
        "SaaS Development",
        "Mobile App Development",
        "Cloud Deployment",
        "Freelancing Services"
      ]
    }
  };

  return (
    <>
      <SEOHead
        title="About Ondosoft | Full Stack Software Development Team & Company"
        description="Learn about Ondosoft's mission to deliver exceptional software development, SaaS solutions, and freelancing services. Our team of React, Node.js, and Python developers serves businesses across the USA. Founded by Pranay Reddy Aleti, MS Computer Science."
        keywords="about ondosoft, software development company, full stack developers, SaaS development team, freelancing company, React developers, Node.js team, Python developers"
        canonicalUrl="https://ondosoft.com/about"
        structuredData={aboutStructuredData}
      />
      <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>}>
        <About />
      </Suspense>
      <ConsultationWidget />
      {isModalOpen && (
        <Suspense fallback={null}>
          <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
    </>
  );
};

export default AboutPage;
