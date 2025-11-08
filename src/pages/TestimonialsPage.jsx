import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import Testimonials from "../components/Testimonials";
import ConsultationWidget from "../components/ConsultationWidget";
import ConsultationModal from "../components/ConsultationModal";
import Footer from "../components/Footer";

const TestimonialsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const testimonialsStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Ondosoft Client Testimonials",
    "description": "Real client reviews and testimonials for Ondosoft's software development, SaaS, and freelancing services",
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
  };

  return (
    <>
      <SEOHead
        title="Client Testimonials | Ondosoft Software Development Reviews"
        description="Read real client testimonials and reviews for Ondosoft's software development, SaaS solutions, and freelancing services. See why businesses choose us for React, Node.js, and Python projects. 5-star rated development company."
        keywords="ondosoft reviews, software development testimonials, SaaS development reviews, freelancing testimonials, client feedback, developer reviews"
        canonicalUrl="https://ondosoft.com/testimonials"
        structuredData={testimonialsStructuredData}
      />
      <div>
        <div className="mx-auto pt-20">
          <div id="testimonials" className="scroll-mt-20">
            <Testimonials />
          </div>
        </div>
        <Footer />
        <ConsultationWidget />
        <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default TestimonialsPage;
