import { useState, lazy, Suspense } from 'react';
import SEOHead from '../components/SEOHead';
import FAQAccordion from '../components/FAQAccordion';
// Lazy load heavy components
const CalendlyModal = lazy(() => import('../components/CalendlyModal'));
const Footer = lazy(() => import('../components/Footer'));
import { faqData, faqCategories, generateFAQStructuredData } from '../constants/faqData';
import { companyInfo, getCanonicalUrl } from "../constants/companyInfo";

const FAQPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const faqStructuredData = generateFAQStructuredData(faqData);
  const canonical = getCanonicalUrl('/faq');
  const faqStructuredDataWithBreadcrumb = {
    "@context": "https://schema.org",
    "@graph": [
      faqStructuredData,
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
            "name": "FAQ",
            "item": canonical
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Frequently Asked Questions | Ondosoft Software Development"
        description="Get answers to common questions about Ondosoft's software development and SaaS services. Learn how we scope projects, collaborate, and ship production-ready releases."
        keywords="FAQ, software development questions, SaaS development, Ondosoft services, development timeline, technology stack"
        canonicalUrl={canonical}
        structuredData={faqStructuredDataWithBreadcrumb}
      />
      
      <div>
        {/* Hero Section */}
        <section className="text-white py-20 border-b border-gray-700/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Frequently Asked <span className="text-orange-500">Questions</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 drop-shadow-md">
                Everything you need to know about Ondosoft's software development services
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <FAQAccordion faqCategories={faqCategories} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-white border-t border-gray-700/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
                Still Have <span className="text-orange-500">Questions?</span>
              </h2>
              <p className="text-xl mb-8 text-gray-300 drop-shadow-md">
                Contact our team for personalized answers about your specific project needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="min-h-[48px] bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-600 transition-all duration-200 shadow-lg border border-gray-600 flex items-center justify-center"
                >
                  Schedule a meeting
                </button>
                <a
                  href={`tel:${companyInfo.phoneE164}`}
                  className="min-h-[48px] border-2 border-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 flex items-center justify-center"
                >
                  Call {companyInfo.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Suspense fallback={<div className="h-32" />}>
        <Footer />
      </Suspense>
      {isModalOpen && (
        <Suspense fallback={null}>
          <CalendlyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Suspense>
      )}
    </>
  );
};

export default FAQPage;
