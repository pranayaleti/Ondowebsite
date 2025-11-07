import React from 'react';
import SEOHead from '../components/SEOHead';
import Footer from '../components/Footer';
import ConsultationWidget from '../components/ConsultationWidget';
import ConsultationModal from '../components/ConsultationModal';
import { companyInfo } from '../constants/companyInfo';

const PrivacyPolicyPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <SEOHead
        title="Privacy Policy | Ondosoft Software Development"
        description="Ondosoft's Privacy Policy - Learn how we collect, use, and protect your personal information. We are committed to maintaining your privacy and data security."
        keywords="privacy policy, data protection, GDPR, CCPA, personal information, data security, Ondosoft privacy"
        canonicalUrl="https://ondosoft.com/privacy-policy"
      />
      
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20 border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Privacy <span className="text-orange-500">Policy</span>
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
                  <h2 className="text-3xl font-bold text-white mb-4">1. Introduction</h2>
                  <p className="leading-relaxed">
                    Ondosoft ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us. By using our services, you agree to the collection and use of information in accordance with this policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">2. Information We Collect</h2>
                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">2.1 Personal Information</h3>
                  <p className="leading-relaxed">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Register for an account or use our services</li>
                    <li>Contact us through our website, email, or phone</li>
                    <li>Subscribe to our newsletter or marketing communications</li>
                    <li>Request a consultation or quote</li>
                    <li>Participate in surveys or feedback forms</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    This information may include: name, email address, phone number, company name, job title, billing address, payment information, and any other information you choose to provide.
                  </p>

                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">2.2 Automatically Collected Information</h3>
                  <p className="leading-relaxed">
                    When you visit our website, we automatically collect certain information about your device, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>IP address and location data</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                    <li>Device identifiers and mobile network information</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                  <p className="leading-relaxed">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send you technical notices, updates, and support messages</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Send you marketing communications (with your consent)</li>
                    <li>Monitor and analyze trends, usage, and activities</li>
                    <li>Detect, prevent, and address technical issues and security threats</li>
                    <li>Comply with legal obligations and enforce our agreements</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>
                  <p className="leading-relaxed">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf (e.g., payment processing, email delivery, hosting services)</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                    <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities</li>
                    <li><strong>Protection of Rights:</strong> We may disclose information to protect our rights, privacy, safety, or property, or that of our users or others</li>
                    <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">5. Data Security</h2>
                  <p className="leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication procedures</li>
                    <li>Employee training on data protection</li>
                    <li>Secure data storage and backup systems</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">6. Your Rights and Choices</h2>
                  <p className="leading-relaxed">
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Access:</strong> Request access to your personal information</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                    <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                    <li><strong>Restriction:</strong> Request restriction of processing your information</li>
                    <li><strong>Objection:</strong> Object to processing of your information</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    To exercise these rights, please contact us at <a href={`mailto:${companyInfo.email}`} className="text-orange-500 hover:underline">{companyInfo.email}</a>.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">7. Cookies and Tracking Technologies</h2>
                  <p className="leading-relaxed">
                    We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">8. Children's Privacy</h2>
                  <p className="leading-relaxed">
                    Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">9. International Data Transfers</h2>
                  <p className="leading-relaxed">
                    Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your country. We take appropriate safeguards to ensure your information receives adequate protection.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">10. Changes to This Privacy Policy</h2>
                  <p className="leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">11. Contact Us</h2>
                  <p className="leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us:
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

export default PrivacyPolicyPage;

