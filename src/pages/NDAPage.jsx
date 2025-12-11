import { useState, lazy, Suspense } from 'react';
import SEOHead from '../components/SEOHead';
import ConsultationWidget from '../components/ConsultationWidget';

// Lazy load heavy components
const Footer = lazy(() => import('../components/Footer'));
const ConsultationModal = lazy(() => import('../components/ConsultationModal'));
import { companyInfo, getCanonicalUrl } from '../constants/companyInfo';

const NDAPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canonical = getCanonicalUrl('/nda');
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#nda`,
        "name": "NDA & Confidentiality",
        "url": canonical,
        "description": "Ondosoft NDA and confidentiality practices."
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
            "name": "NDA",
            "item": canonical
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="NDA & Confidentiality | Ondosoft Software Development"
        description="Ondosoft's Non-Disclosure Agreement and confidentiality practices. Learn how we protect your sensitive information and maintain trust with our clients."
        keywords="NDA, non-disclosure agreement, confidentiality, data protection, trust, secure development, Ondosoft NDA"
        canonicalUrl={canonical}
        structuredData={structuredData}
      />
      
      <div>
        {/* Hero Section */}
        <section className="text-white py-20 border-b border-gray-700/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                NDA & <span className="text-orange-500">Confidentiality</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 drop-shadow-md">
                Your Trust is Our Priority - Comprehensive Confidentiality Protection
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
                  <h2 className="text-3xl font-bold text-white mb-4">Our Commitment to Confidentiality</h2>
                  <p className="leading-relaxed">
                    At Ondosoft, we understand that your business information, proprietary technology, and strategic plans are valuable assets. We are committed to maintaining the highest standards of confidentiality and trust. Every project begins with a comprehensive Non-Disclosure Agreement (NDA) to ensure your sensitive information remains protected.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">What is Covered by Our NDA</h2>
                  <p className="leading-relaxed">
                    Our standard NDA covers all confidential information shared during our engagement, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>Business Information:</strong> Business plans, strategies, financial data, customer lists, and market research</li>
                    <li><strong>Technical Information:</strong> Source code, algorithms, software architecture, APIs, databases, and technical specifications</li>
                    <li><strong>Proprietary Data:</strong> Trade secrets, proprietary methodologies, unique processes, and intellectual property</li>
                    <li><strong>Project Details:</strong> Project requirements, timelines, budgets, and internal communications</li>
                    <li><strong>Client Information:</strong> Customer data, user information, and any personally identifiable information</li>
                    <li><strong>Strategic Plans:</strong> Future product plans, marketing strategies, and competitive intelligence</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Our Confidentiality Practices</h2>
                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">1. Standard NDA Process</h3>
                  <p className="leading-relaxed">
                    Before any project begins, we execute a mutual NDA that protects both parties. Our standard NDA includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Mutual confidentiality obligations</li>
                    <li>Clear definition of confidential information</li>
                    <li>Duration of confidentiality obligations (typically 3-5 years post-project)</li>
                    <li>Permitted disclosures and exceptions</li>
                    <li>Remedies for breach of confidentiality</li>
                    <li>Governing law and jurisdiction</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">2. Employee Training</h3>
                  <p className="leading-relaxed">
                    All Ondosoft team members undergo comprehensive confidentiality training and are bound by strict confidentiality agreements. Our team understands the importance of protecting client information and maintaining professional discretion.
                  </p>

                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">3. Secure Information Handling</h3>
                  <p className="leading-relaxed">
                    We implement robust security measures to protect confidential information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Encrypted communication channels for all sensitive discussions</li>
                    <li>Secure file storage and transfer systems</li>
                    <li>Access controls limiting information to only necessary team members</li>
                    <li>Regular security audits and assessments</li>
                    <li>Secure development environments and code repositories</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">4. Project Isolation</h3>
                  <p className="leading-relaxed">
                    Each client project is treated with complete isolation. Information from one project is never shared with another client, and team members working on different projects maintain strict confidentiality boundaries.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">NDA Execution Process</h2>
                  <p className="leading-relaxed">
                    When you engage Ondosoft for a project:
                  </p>
                  <ol className="list-decimal pl-6 space-y-3 mt-4">
                    <li><strong>Initial Discussion:</strong> We discuss your project requirements and confidentiality needs</li>
                    <li><strong>NDA Preparation:</strong> We prepare a customized NDA based on your specific requirements</li>
                    <li><strong>Review & Sign:</strong> Both parties review and execute the NDA before any sensitive information is shared</li>
                    <li><strong>Project Commencement:</strong> Once the NDA is in place, we begin the project with full confidentiality protection</li>
                  </ol>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">What Information is NOT Confidential</h2>
                  <p className="leading-relaxed">
                    The following information is typically excluded from confidentiality obligations:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Information that is publicly available or becomes publicly available through no breach of the NDA</li>
                    <li>Information that was already known to the receiving party before disclosure</li>
                    <li>Information independently developed without use of confidential information</li>
                    <li>Information required to be disclosed by law or court order (with prior notice when possible)</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Duration of Confidentiality</h2>
                  <p className="leading-relaxed">
                    Our standard NDA maintains confidentiality obligations for a period of 3-5 years after the completion of the project or termination of the agreement, whichever is later. For highly sensitive information, we can negotiate longer terms as needed.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Breach of Confidentiality</h2>
                  <p className="leading-relaxed">
                    In the unlikely event of a breach of confidentiality, our NDA provides for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Immediate notification of any suspected breach</li>
                    <li>Cooperation in investigating and remedying any breach</li>
                    <li>Legal remedies including injunctive relief and monetary damages</li>
                    <li>Termination of the agreement if necessary</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Industry Standards & Compliance</h2>
                  <p className="leading-relaxed">
                    Our confidentiality practices align with industry standards and legal requirements:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Compliance with data protection regulations (GDPR, CCPA)</li>
                    <li>Adherence to software development industry best practices</li>
                    <li>Regular review and updates of our confidentiality policies</li>
                    <li>Professional liability insurance coverage</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Request an NDA</h2>
                  <p className="leading-relaxed">
                    Ready to start a project with Ondosoft? We're happy to execute an NDA before any discussions. To request our standard NDA or discuss custom confidentiality terms, please contact us:
                  </p>
                  <div className="mt-4 space-y-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <p><strong>Email:</strong> <a href={`mailto:${companyInfo.email}`} className="text-orange-500 hover:underline">{companyInfo.email}</a></p>
                    <p><strong>Phone:</strong> <a href={`tel:${companyInfo.phoneE164}`} className="text-orange-500 hover:underline">{companyInfo.phoneDisplay}</a></p>
                    <p><strong>Address:</strong> {companyInfo.address.streetAddress}, {companyInfo.address.addressLocality}, {companyInfo.address.addressRegion} {companyInfo.address.postalCode}</p>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-lg mt-8">
                  <h3 className="text-2xl font-semibold text-white mb-3">Trust is the Foundation of Our Business</h3>
                  <p className="leading-relaxed text-gray-300">
                    At Ondosoft, we understand that trust is earned through consistent action. Our commitment to confidentiality is not just a legal requirement—it's a core value that guides everything we do. When you work with us, you can be confident that your sensitive information is in safe hands.
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

export default NDAPage;

