import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';
import FAQAccordion from '../components/FAQAccordion';
import ConsultationWidget from '../components/ConsultationWidget';
import ConsultationModal from '../components/ConsultationModal';
import Footer from '../components/Footer';
import { faqData, generateFAQStructuredData } from '../constants/faqData';
import { companyInfo } from "../constants/companyInfo";

const FAQPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const faqStructuredData = generateFAQStructuredData(faqData);

  return (
    <>
      <SEOHead
        title="Frequently Asked Questions | Ondosoft Software Development"
        description="Get answers to common questions about Ondosoft's software development, freelancing, and SaaS services. Learn how to hire developers, build your SaaS app, and scale your business. Expert answers from our development team."
        keywords="FAQ, software development questions, hire developers, SaaS development, freelancing, Ondosoft services, development timeline, technology stack"
        structuredData={faqStructuredData}
      />
      
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Frequently Asked Questions
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-100 drop-shadow-md">
                Everything you need to know about Ondosoft's software development services
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-sm">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Find answers to common questions about our software development, freelancing, and SaaS services
                </p>
              </div>
              <FAQAccordion faqs={faqData} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-orange-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg">
                Still Have Questions?
              </h2>
              <p className="text-xl mb-8 text-orange-100 drop-shadow-md">
                Contact our team for personalized answers about your specific project needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-black text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg"
                >
                  Contact Us Today
                </a>
                <a
                  href={`tel:${companyInfo.phoneE164}`}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-black hover:text-orange-600 transition-all duration-200"
                >
                  Call {companyInfo.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
      <ConsultationWidget />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default FAQPage;
