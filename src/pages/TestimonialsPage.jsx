import { useState, lazy, Suspense } from "react";
import SEOHead from "../components/SEOHead";
import ConsultationWidget from "../components/ConsultationWidget";
import { getCanonicalUrl, companyInfo } from "../constants/companyInfo";

// Lazy load heavy components
const Testimonials = lazy(() => import("../components/Testimonials"));
const ConsultationModal = lazy(() => import("../components/ConsultationModal"));
const Footer = lazy(() => import("../components/Footer"));

const TestimonialsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const canonical = getCanonicalUrl('/testimonials');
  const testimonialsStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": `${canonical}#testimonials`,
        "name": "Ondosoft Client Testimonials",
        "description": "Real client reviews and testimonials for Ondosoft's software development and SaaS services",
        "itemListElement": [
          {
            "@type": "Review",
            "reviewBody": "OndoSoft built us a beautiful website that actually brings in customers! Our online orders increased by 300% in the first month. The best investment we've made for our business.",
            "author": {
              "@type": "Person",
              "name": "Sarah Martinez"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            }
          },
          {
            "@type": "Review",
            "reviewBody": "We needed a custom web app for our startup and OndoSoft delivered exactly what we needed. Professional, fast, and affordable. They understood our vision and brought it to life perfectly.",
            "author": {
              "@type": "Person",
              "name": "Mike Chen"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            }
          }
        ]
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
            "name": "Testimonials",
            "item": canonical
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Client Testimonials | Ondosoft Software Development Reviews"
        description="Read real client testimonials and reviews for Ondosoft's software development and SaaS solutions. See why teams choose us for React, Node.js, and Python projects. 5-star rated development company."
        keywords="ondosoft reviews, software development testimonials, SaaS development reviews, client feedback, developer reviews"
        canonicalUrl={canonical}
        structuredData={testimonialsStructuredData}
      />
      <div>
        <div className="mx-auto pt-20">
          <div id="testimonials" className="scroll-mt-20">
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>}>
              <Testimonials />
            </Suspense>
          </div>
        </div>
        <Suspense fallback={<div className="h-32" />}>
          <Footer />
        </Suspense>
        <ConsultationWidget />
        {isModalOpen && (
          <Suspense fallback={null}>
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default TestimonialsPage;
