import { useState, lazy, Suspense } from 'react';
import SEOHead from '../components/SEOHead';
import ConsultationWidget from '../components/ConsultationWidget';

// Lazy load heavy components
const Footer = lazy(() => import('../components/Footer'));
const ConsultationModal = lazy(() => import('../components/ConsultationModal'));
import { Link } from 'react-router-dom';
import { companyInfo } from '../constants/companyInfo';
import ContactInfo from '../components/ContactInfo';

const LegalPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <SEOHead
        title="Legal Information | Ondosoft Software Development"
        description="Ondosoft's Legal Information - Access our legal documents including privacy policy, terms of use, licensing, NDA information, and accessibility statement."
        keywords="legal information, legal documents, compliance, Ondosoft legal, business legal"
        canonicalUrl="https://ondosoft.com/legal"
      />
      
      <div>
        {/* Hero Section */}
        <section className="text-white py-20 border-b border-gray-700/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Legal <span className="text-orange-500">Information</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 drop-shadow-md">
                Important legal documents and information for Ondosoft services
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-gray-300 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Legal Documents</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Link to="/privacy-policy" className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">Privacy Policy</h3>
                      <p className="text-gray-400">Learn how we collect, use, and protect your personal information.</p>
                    </Link>
                    <Link to="/terms-of-use" className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">Terms of Use</h3>
                      <p className="text-gray-400">Read our terms and conditions for using our website and services.</p>
                    </Link>
                    <Link to="/nda" className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">NDA Information</h3>
                      <p className="text-gray-400">Information about our Non-Disclosure Agreement and confidentiality practices.</p>
                    </Link>
                    <Link to="/licensing" className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">Licensing</h3>
                      <p className="text-gray-400">Details about software licensing, intellectual property, and usage rights.</p>
                    </Link>
                    <Link to="/accessibility" className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">Accessibility</h3>
                      <p className="text-gray-400">Our commitment to web accessibility and inclusive design.</p>
                    </Link>
                    <Link to="/sitemap" className="block p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">Site Map</h3>
                      <p className="text-gray-400">Complete navigation map of our website and all available pages.</p>
                    </Link>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Company Information</h2>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Business Details</h3>
                      <p className="text-gray-300"><strong>Company Name:</strong> Ondosoft</p>
                      <p className="text-gray-300"><strong>Business Type:</strong> Software Development & Technology Services</p>
                      <p className="text-gray-300"><strong>Services:</strong> Freelancing, Full Stack Development, SaaS Applications</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Contact Information</h3>
                      <ContactInfo variant="detailed" />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Compliance & Standards</h2>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Ondosoft is committed to maintaining the highest standards of legal compliance and ethical business practices. We adhere to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>GDPR (General Data Protection Regulation) compliance for data protection</li>
                      <li>CCPA (California Consumer Privacy Act) compliance for California residents</li>
                      <li>Industry-standard security practices and certifications</li>
                      <li>Intellectual property protection and respect for third-party rights</li>
                      <li>Accessibility standards (WCAG 2.1 Level AA compliance)</li>
                      <li>Professional code of conduct and ethical guidelines</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Intellectual Property</h2>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <p className="text-gray-300 leading-relaxed mb-4">
                      All content, trademarks, logos, and intellectual property on this website are the property of Ondosoft or its licensors. Unauthorized use, reproduction, or distribution of any materials is strictly prohibited.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      For questions regarding intellectual property rights, licensing, or usage permissions, please contact us at <a href={`mailto:${companyInfo.email}`} className="text-orange-500 hover:underline">{companyInfo.email}</a>.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Dispute Resolution</h2>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <p className="text-gray-300 leading-relaxed mb-4">
                      In the event of any dispute arising from the use of our services or website, we encourage direct communication to resolve issues amicably. If a resolution cannot be reached:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-300">
                      <li>Disputes will be governed by the laws of the State of Utah, United States</li>
                      <li>Jurisdiction for any legal proceedings will be in the courts of Utah</li>
                      <li>We are open to alternative dispute resolution methods, including mediation</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Questions or Concerns</h2>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <p className="text-gray-300 leading-relaxed mb-4">
                      If you have any questions, concerns, or requests regarding our legal policies or practices, please don't hesitate to contact us:
                    </p>
                    <div className="space-y-2">
                      <p className="text-gray-300"><strong>Email:</strong> <a href={`mailto:${companyInfo.email}`} className="text-orange-500 hover:underline">{companyInfo.email}</a></p>
                      <p className="text-gray-300"><strong>Phone:</strong> <a href={`tel:${companyInfo.phoneE164}`} className="text-orange-500 hover:underline">{companyInfo.phoneDisplay}</a></p>
                      <p className="text-gray-300"><strong>Address:</strong> {companyInfo.address.streetAddress}, {companyInfo.address.addressLocality}, {companyInfo.address.addressRegion} {companyInfo.address.postalCode}</p>
                    </div>
                  </div>
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

export default LegalPage;

