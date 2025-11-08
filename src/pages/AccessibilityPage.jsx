import { useState } from 'react';
import SEOHead from '../components/SEOHead';
import Footer from '../components/Footer';
import ConsultationWidget from '../components/ConsultationWidget';
import ConsultationModal from '../components/ConsultationModal';
import { companyInfo } from '../constants/companyInfo';

const AccessibilityPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <SEOHead
        title="Accessibility Statement | Ondosoft Software Development"
        description="Ondosoft's Accessibility Statement - Our commitment to web accessibility, WCAG compliance, and inclusive design. Learn about our accessibility features and how to report issues."
        keywords="accessibility, WCAG, ADA compliance, inclusive design, web accessibility, accessible website, Ondosoft accessibility"
        canonicalUrl="https://ondosoft.com/accessibility"
      />
      
      <div>
        {/* Hero Section */}
        <section className="text-white py-20 border-b border-gray-700/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Accessibility <span className="text-orange-500">Statement</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 drop-shadow-md">
                Our Commitment to Inclusive Design and Web Accessibility
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
                  <h2 className="text-3xl font-bold text-white mb-4">Our Commitment</h2>
                  <p className="leading-relaxed">
                    Ondosoft is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to achieve these goals. We believe that technology should be accessible to all, regardless of ability.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Accessibility Standards</h2>
                  <p className="leading-relaxed">
                    We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.
                  </p>
                  <p className="leading-relaxed mt-4">
                    Our website is designed and developed with accessibility in mind, incorporating:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Semantic HTML structure for screen readers</li>
                    <li>Proper heading hierarchy and document structure</li>
                    <li>Alt text for images and descriptive text for visual elements</li>
                    <li>Keyboard navigation support throughout the site</li>
                    <li>Sufficient color contrast ratios for text readability</li>
                    <li>Focus indicators for keyboard navigation</li>
                    <li>Form labels and error messages</li>
                    <li>Responsive design that works on various devices and screen sizes</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Accessibility Features</h2>
                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">Keyboard Navigation</h3>
                  <p className="leading-relaxed">
                    Our website can be navigated entirely using a keyboard. You can:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Use Tab to move forward through interactive elements</li>
                    <li>Use Shift+Tab to move backward</li>
                    <li>Use Enter or Space to activate buttons and links</li>
                    <li>Use arrow keys to navigate menus and lists</li>
                    <li>Use Escape to close modals and menus</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">Screen Reader Support</h3>
                  <p className="leading-relaxed">
                    Our website is compatible with popular screen readers including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>NVDA (NonVisual Desktop Access)</li>
                    <li>JAWS (Job Access With Speech)</li>
                    <li>VoiceOver (macOS and iOS)</li>
                    <li>TalkBack (Android)</li>
                    <li>Other assistive technologies</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">Visual Accessibility</h3>
                  <p className="leading-relaxed">
                    We've implemented features to improve visual accessibility:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>High contrast color schemes</li>
                    <li>Text that can be resized up to 200% without loss of functionality</li>
                    <li>Descriptive alt text for all images</li>
                    <li>Clear focus indicators</li>
                    <li>Consistent navigation and layout</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-white mb-3 mt-6">Forms and Input</h3>
                  <p className="leading-relaxed">
                    All forms on our website include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Properly associated labels for all input fields</li>
                    <li>Clear error messages and validation feedback</li>
                    <li>Required field indicators</li>
                    <li>Logical tab order</li>
                    <li>Instructions and help text where needed</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Known Limitations</h2>
                  <p className="leading-relaxed">
                    Despite our best efforts to ensure accessibility, there may be some limitations. We are aware of the following areas and are working to address them:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Some third-party content or widgets may not be fully accessible</li>
                    <li>Older content may not meet current accessibility standards</li>
                    <li>Some interactive elements may require additional keyboard navigation improvements</li>
                    <li>Video content may need additional captions or transcripts</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    We are actively working to address these limitations and improve accessibility across our website.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Ongoing Improvements</h2>
                  <p className="leading-relaxed">
                    Accessibility is an ongoing effort. We regularly:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Conduct accessibility audits and testing</li>
                    <li>Review and update content for accessibility compliance</li>
                    <li>Test with assistive technologies</li>
                    <li>Gather feedback from users with disabilities</li>
                    <li>Stay updated with accessibility best practices and standards</li>
                    <li>Train our team on accessibility requirements</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Third-Party Content</h2>
                  <p className="leading-relaxed">
                    Our website may include third-party content or links to third-party websites. We cannot guarantee the accessibility of third-party content, but we strive to work with partners who share our commitment to accessibility.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Feedback & Reporting Issues</h2>
                  <p className="leading-relaxed">
                    We welcome your feedback on the accessibility of our website. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
                  </p>
                  <div className="mt-4 space-y-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <p><strong>Email:</strong> <a href={`mailto:${companyInfo.email}`} className="text-orange-500 hover:underline">{companyInfo.email}</a></p>
                    <p><strong>Phone:</strong> <a href={`tel:${companyInfo.phoneE164}`} className="text-orange-500 hover:underline">{companyInfo.phoneDisplay}</a></p>
                    <p><strong>Address:</strong> {companyInfo.address.streetAddress}, {companyInfo.address.addressLocality}, {companyInfo.address.addressRegion} {companyInfo.address.postalCode}</p>
                  </div>
                  <p className="leading-relaxed mt-4">
                    When reporting accessibility issues, please include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>The URL of the page where you encountered the issue</li>
                    <li>A description of the accessibility barrier</li>
                    <li>The assistive technology you were using (if applicable)</li>
                    <li>Your contact information so we can follow up if needed</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    We aim to respond to accessibility feedback within 5 business days and will work to address reported issues promptly.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Alternative Formats</h2>
                  <p className="leading-relaxed">
                    If you need information from our website in an alternative format, please contact us. We can provide:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Large print documents</li>
                    <li>Audio versions of content</li>
                    <li>Plain text versions</li>
                    <li>Other formats as requested</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Accessibility in Our Services</h2>
                  <p className="leading-relaxed">
                    Beyond our website, we are committed to building accessible software solutions for our clients. Our development services include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>Accessibility audits and testing for client projects</li>
                    <li>WCAG-compliant web development</li>
                    <li>Inclusive design consultation</li>
                    <li>Assistive technology compatibility testing</li>
                    <li>Accessibility training for development teams</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Compliance</h2>
                  <p className="leading-relaxed">
                    We strive to comply with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li><strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines</li>
                    <li><strong>Section 508:</strong> U.S. federal accessibility standards</li>
                    <li><strong>ADA:</strong> Americans with Disabilities Act requirements</li>
                    <li><strong>EN 301 549:</strong> European accessibility standard</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Last Updated</h2>
                  <p className="leading-relaxed">
                    This accessibility statement was last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. We review and update this statement regularly to reflect our ongoing commitment to accessibility.
                  </p>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-lg mt-8">
                  <h3 className="text-2xl font-semibold text-white mb-3">Our Promise</h3>
                  <p className="leading-relaxed text-gray-300">
                    At Ondosoft, we believe that digital accessibility is not just a legal requirement—it's a moral imperative and a business advantage. We are committed to making our website and services accessible to everyone, and we will continue to improve our accessibility practices as technology and standards evolve.
                  </p>
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

export default AccessibilityPage;

