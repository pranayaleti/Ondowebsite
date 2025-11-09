import { useState, lazy, Suspense } from 'react';
import SEOHead from '../components/SEOHead';
import ConsultationWidget from '../components/ConsultationWidget';

// Lazy load heavy components
const Footer = lazy(() => import('../components/Footer'));
const ConsultationModal = lazy(() => import('../components/ConsultationModal'));
import { companyInfo, getCanonicalUrl } from '../constants/companyInfo';

const LicensingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <SEOHead
        title="Licensing & Intellectual Property | Ondosoft Software Development"
        description="Ondosoft's Licensing Information - Learn about software licensing, intellectual property rights, open source usage, and licensing terms for our services and deliverables."
        keywords="licensing, intellectual property, software license, IP rights, open source, proprietary software, Ondosoft licensing"
        canonicalUrl={getCanonicalUrl('/licensing')}
      />
      
      <div>
        {/* Hero Section */}
        <section className="text-white py-20 border-b border-gray-700/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Licensing & <span className="text-orange-500">Intellectual Property</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 drop-shadow-md">
                Understanding Software Licensing and IP Rights
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-invert prose-lg max-w-none">
              <div className="text-gray-300 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Overview</h2>
                  <p className="leading-relaxed">
                    This page outlines our approach to software licensing, intellectual property rights, and how we handle licensing for custom software development projects. Understanding licensing terms is crucial for protecting your investment and ensuring compliance with applicable laws.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Custom Development Projects</h2>
                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">Ownership & Licensing</h3>
                  <p className="leading-relaxed">
                    For custom software development projects, intellectual property ownership is typically determined by the specific terms of your service agreement. Generally:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Full Ownership:</strong> Upon full payment, you typically receive full ownership of custom-developed code, designs, and deliverables created specifically for your project</li>
                    <li><strong>Exclusive License:</strong> In some cases, you may receive an exclusive, perpetual, worldwide license to use, modify, and distribute the software</li>
                    <li><strong>Source Code:</strong> Source code and all related materials are typically delivered upon project completion and final payment</li>
                    <li><strong>Documentation:</strong> Technical documentation, user guides, and API documentation are included with deliverables</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">Retained Rights</h3>
                  <p className="leading-relaxed">
                    Ondosoft may retain certain rights, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Rights to use general knowledge, skills, and experience gained during the project</li>
                    <li>Rights to use pre-existing code, frameworks, and tools that were not created specifically for your project</li>
                    <li>Rights to showcase the project in our portfolio (subject to confidentiality agreements)</li>
                    <li>Rights to use anonymized, aggregated data for improving our services</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Third-Party Components & Open Source</h2>
                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">Open Source Software</h3>
                  <p className="leading-relaxed">
                    Many projects incorporate open source software components. We carefully manage open source usage:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>License Compliance:</strong> We ensure all open source components comply with their respective licenses</li>
                    <li><strong>License Compatibility:</strong> We verify that open source licenses are compatible with your intended use</li>
                    <li><strong>Documentation:</strong> We provide a list of all open source components and their licenses with each project</li>
                    <li><strong>Common Licenses:</strong> We frequently work with MIT, Apache 2.0, BSD, GPL, and LGPL licensed software</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">Third-Party Services & APIs</h3>
                  <p className="leading-relaxed">
                    Projects may integrate with third-party services and APIs:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>We use only reputable, licensed third-party services</li>
                    <li>All third-party integrations comply with their respective terms of service</li>
                    <li>You are responsible for maintaining licenses and subscriptions for third-party services</li>
                    <li>We document all third-party dependencies and their licensing requirements</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Ondosoft Proprietary Software</h2>
                  <p className="leading-relaxed">
                    Ondosoft may use proprietary frameworks, tools, and libraries developed internally:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Proprietary components are licensed to you as part of the project deliverables</li>
                    <li>License terms for proprietary components are specified in your service agreement</li>
                    <li>You typically receive a license to use, but not to redistribute, proprietary components</li>
                    <li>Source code for proprietary components may or may not be included, depending on the agreement</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">License Types We Work With</h2>
                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">Proprietary Licenses</h3>
                  <p className="leading-relaxed">
                    For custom projects, we typically provide:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Exclusive License:</strong> You receive exclusive rights to use the software</li>
                    <li><strong>Perpetual License:</strong> License continues indefinitely (subject to terms)</li>
                    <li><strong>Transferable License:</strong> Rights may be transferable to your business entities</li>
                    <li><strong>Modification Rights:</strong> You can modify, enhance, and extend the software</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">Open Source Licenses</h3>
                  <p className="leading-relaxed">
                    We work with various open source licenses:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>MIT License:</strong> Permissive, allows commercial use with minimal restrictions</li>
                    <li><strong>Apache 2.0:</strong> Permissive, includes patent grant</li>
                    <li><strong>BSD Licenses:</strong> Permissive, minimal restrictions</li>
                    <li><strong>GPL/LGPL:</strong> Copyleft licenses requiring derivative works to be open source</li>
                    <li><strong>Mozilla Public License:</strong> Weak copyleft, allows linking with proprietary code</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Intellectual Property Protection</h2>
                  <p className="leading-relaxed">
                    We take intellectual property protection seriously:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Copyright:</strong> All original code and creative works are automatically protected by copyright</li>
                    <li><strong>Patents:</strong> We respect existing patents and can help identify potential patent issues</li>
                    <li><strong>Trademarks:</strong> We respect third-party trademarks and help protect your trademarks</li>
                    <li><strong>Trade Secrets:</strong> Proprietary algorithms and business logic are protected as trade secrets</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">License Compliance & Audits</h2>
                  <p className="leading-relaxed">
                    We maintain compliance with all software licenses:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>We track all third-party components and their licenses</li>
                    <li>We provide license documentation with each project</li>
                    <li>We conduct license audits before project delivery</li>
                    <li>We ensure compatibility between different license types</li>
                    <li>We provide guidance on license compliance for your use case</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Modifications & Derivative Works</h2>
                  <p className="leading-relaxed">
                    Your rights to modify and create derivative works depend on your specific agreement:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>For custom projects, you typically have full rights to modify and extend the software</li>
                    <li>Modifications to open source components must comply with their respective licenses</li>
                    <li>Derivative works may be subject to the same licenses as the original components</li>
                    <li>We can provide guidance on licensing requirements for modifications</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Redistribution & Commercial Use</h2>
                  <p className="leading-relaxed">
                    Redistribution rights vary by license type:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Custom-developed software typically includes redistribution rights</li>
                    <li>Open source components may have specific redistribution requirements</li>
                    <li>Commercial use is generally permitted for custom projects</li>
                    <li>We can help structure licensing for SaaS products and commercial distribution</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Questions About Licensing?</h2>
                  <p className="leading-relaxed">
                    Licensing can be complex. We're here to help you understand your rights and obligations. For questions about:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Custom licensing terms for your project</li>
                    <li>Open source license compatibility</li>
                    <li>Intellectual property ownership</li>
                    <li>License compliance requirements</li>
                    <li>Redistribution and commercial use rights</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    Please contact us:
                  </p>
                  <div className="mt-4 space-y-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <p><strong>Email:</strong> <a href={`mailto:${companyInfo.email}`} className="text-orange-500 hover:underline">{companyInfo.email}</a></p>
                    <p><strong>Phone:</strong> <a href={`tel:${companyInfo.phoneE164}`} className="text-orange-500 hover:underline">{companyInfo.phoneDisplay}</a></p>
                    <p><strong>Address:</strong> {companyInfo.address.streetAddress}, {companyInfo.address.addressLocality}, {companyInfo.address.addressRegion} {companyInfo.address.postalCode}</p>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-lg mt-8">
                  <h3 className="text-2xl font-semibold text-white mb-3">Important Note</h3>
                  <p className="leading-relaxed text-gray-300">
                    This page provides general information about our licensing practices. Specific licensing terms for your project will be detailed in your service agreement. We recommend consulting with legal counsel for complex licensing scenarios or if you have specific compliance requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
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
    </>
  );
};

export default LicensingPage;

