import { useState, lazy, Suspense } from "react";
import SEOHead from "../components/SEOHead";
import ConsultationWidget from "../components/ConsultationWidget";
import { companyInfo, getCanonicalUrl } from "../constants/companyInfo";

// Lazy load heavy components
const About = lazy(() => import("../components/About"));
const ConsultationModal = lazy(() => import("../components/ConsultationModal"));

const AboutPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const canonical = getCanonicalUrl('/about');
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${canonical}#about-page`,
        "name": "About Ondosoft",
        "url": canonical,
        "description": "Learn about Ondosoft's mission, team, and expertise in software development, SaaS platforms, and product delivery. Serving businesses across the USA with React, Node.js, Python, and cloud technologies.",
        "mainEntity": {
          "@type": "Organization",
          "name": "Ondosoft",
          "description": "Full stack software development and SaaS solutions company",
          "foundingDate": companyInfo.foundingDate,
          "numberOfEmployees": "10-50",
          "industry": "Software Development",
          "knowsAbout": [
            "React Development",
            "Node.js Development", 
            "Python Development",
            "SaaS Development",
            "Mobile App Development",
            "Cloud Deployment"
          ]
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
            "name": "About",
            "item": canonical
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="About Ondosoft | Full Stack Software Development Team"
        description="Learn about Ondosoft's mission to deliver exceptional software development and SaaS solutions. Our React, Node.js, and Python engineers partner with teams across the USA. Founded by Pranay Reddy Aleti, MS Computer Science."
        keywords="about ondosoft, software development company, full stack developers, SaaS development team, React developers, Node.js team, Python developers"
        canonicalUrl={getCanonicalUrl('/about')}
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
