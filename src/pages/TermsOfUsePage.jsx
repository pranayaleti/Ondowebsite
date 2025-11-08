import { useState } from 'react';
import SEOHead from '../components/SEOHead';
import Footer from '../components/Footer';
import ConsultationWidget from '../components/ConsultationWidget';
import ConsultationModal from '../components/ConsultationModal';
import { companyInfo } from '../constants/companyInfo';

const TermsOfUsePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <SEOHead
        title="Terms of Use | Ondosoft Software Development"
        description="Ondosoft's Terms of Use - Read our terms and conditions for using our website and services. Understand your rights and obligations when working with Ondosoft."
        keywords="terms of use, terms and conditions, user agreement, service terms, Ondosoft terms"
        canonicalUrl="https://ondosoft.com/terms-of-use"
      />
      
      <div>
        {/* Hero Section */}
        <section className="text-white py-20 border-b border-gray-700/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Terms of <span className="text-orange-500">Use</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 drop-shadow-md">
                Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                  <h2 className="text-3xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                  <p className="leading-relaxed">
                    By accessing and using the Ondosoft website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">2. Use License</h2>
                  <p className="leading-relaxed">
                    Permission is granted to temporarily access the materials on Ondosoft's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">3. Services</h2>
                  <p className="leading-relaxed">
                    Ondosoft provides software development, freelancing, and SaaS application services. All services are provided subject to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Written service agreements or contracts</li>
                    <li>Payment terms as specified in individual agreements</li>
                    <li>Project timelines and deliverables as mutually agreed</li>
                    <li>Intellectual property rights as outlined in service agreements</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">4. User Accounts</h2>
                  <p className="leading-relaxed">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">5. Intellectual Property Rights</h2>
                  <p className="leading-relaxed">
                    The website and its original content, features, and functionality are owned by Ondosoft and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p className="leading-relaxed mt-4">
                    Unless otherwise specified in a written agreement, all work product, code, designs, and deliverables created by Ondosoft remain the property of Ondosoft until full payment is received, at which point ownership transfers as specified in the service agreement.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">6. Payment Terms</h2>
                  <p className="leading-relaxed">
                    Payment terms will be specified in individual service agreements. Generally:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Invoices are due within the timeframe specified in the agreement (typically 15-30 days)</li>
                    <li>Late payments may incur interest charges as specified in the agreement</li>
                    <li>We reserve the right to suspend services for non-payment</li>
                    <li>All fees are non-refundable unless otherwise specified</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">7. Prohibited Uses</h2>
                  <p className="leading-relaxed">
                    You agree not to use the website or services:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>In any way that violates any applicable law or regulation</li>
                    <li>To transmit any malicious code, viruses, or harmful data</li>
                    <li>To impersonate or attempt to impersonate Ondosoft or any employee</li>
                    <li>To engage in any automated use of the system</li>
                    <li>To interfere with or disrupt the website or servers</li>
                    <li>To collect or harvest any information from the website</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">8. Disclaimer</h2>
                  <p className="leading-relaxed">
                    The materials on Ondosoft's website are provided on an 'as is' basis. Ondosoft makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">9. Limitations</h2>
                  <p className="leading-relaxed">
                    In no event shall Ondosoft or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Ondosoft's website, even if Ondosoft or an authorized representative has been notified orally or in writing of the possibility of such damage.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">10. Revisions and Errata</h2>
                  <p className="leading-relaxed">
                    The materials appearing on Ondosoft's website could include technical, typographical, or photographic errors. Ondosoft does not warrant that any of the materials on its website are accurate, complete, or current. Ondosoft may make changes to the materials contained on its website at any time without notice.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">11. Links</h2>
                  <p className="leading-relaxed">
                    Ondosoft has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Ondosoft. Use of any such linked website is at the user's own risk.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">12. Modifications</h2>
                  <p className="leading-relaxed">
                    Ondosoft may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">13. Governing Law</h2>
                  <p className="leading-relaxed">
                    These terms and conditions are governed by and construed in accordance with the laws of the State of Utah, United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">14. Contact Information</h2>
                  <p className="leading-relaxed">
                    If you have any questions about these Terms of Use, please contact us:
                  </p>
                  <div className="mt-4 space-y-2">
                    <p><strong>Email:</strong> <a href={`mailto:${companyInfo.email}`} className="text-orange-500 hover:underline">{companyInfo.email}</a></p>
                    <p><strong>Phone:</strong> <a href={`tel:${companyInfo.phoneE164}`} className="text-orange-500 hover:underline">{companyInfo.phoneDisplay}</a></p>
                    <p><strong>Address:</strong> {companyInfo.address.streetAddress}, {companyInfo.address.addressLocality}, {companyInfo.address.addressRegion} {companyInfo.address.postalCode}</p>
                  </div>
                </div>
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

export default TermsOfUsePage;

