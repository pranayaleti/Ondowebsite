import React from 'react';
import SEOHead from '../components/SEOHead';
import Footer from '../components/Footer';
import ConsultationWidget from '../components/ConsultationWidget';
import ConsultationModal from '../components/ConsultationModal';
import { Link } from 'react-router-dom';
import { SERVICE_AREAS } from '../utils/unifiedData';

const SitemapPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <SEOHead
        title="Site Map | Ondosoft Software Development"
        description="Complete site map of Ondosoft website. Find all pages, services, and resources in one place. Navigate our website easily with our comprehensive site map."
        keywords="sitemap, site map, navigation, website structure, Ondosoft pages, all pages"
        canonicalUrl="https://ondosoft.com/sitemap"
      />
      
      <div>
        {/* Hero Section */}
        <section className="text-white py-20 border-b border-gray-700/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Site <span className="text-orange-500">Map</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 drop-shadow-md">
                Complete navigation guide to all pages on our website
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-gray-300 space-y-12">
                {/* Main Pages */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Main Pages</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link to="/" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Home</h3>
                      <p className="text-sm text-gray-400">Main landing page</p>
                    </Link>
                    <Link to="/about" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">About Us</h3>
                      <p className="text-sm text-gray-400">Learn about Ondosoft</p>
                    </Link>
                    <Link to="/services" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Services</h3>
                      <p className="text-sm text-gray-400">Our service offerings</p>
                    </Link>
                    <Link to="/products" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Products</h3>
                      <p className="text-sm text-gray-400">Our products and solutions</p>
                    </Link>
                    <Link to="/portfolio" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Portfolio</h3>
                      <p className="text-sm text-gray-400">Our work and projects</p>
                    </Link>
                    <Link to="/pricing" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Pricing</h3>
                      <p className="text-sm text-gray-400">Pricing plans and packages</p>
                    </Link>
                    <Link to="/testimonials" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Testimonials</h3>
                      <p className="text-sm text-gray-400">Client reviews and feedback</p>
                    </Link>
                    <Link to="/blogs" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Blogs</h3>
                      <p className="text-sm text-gray-400">Latest articles and insights</p>
                    </Link>
                    <Link to="/contact" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Contact</h3>
                      <p className="text-sm text-gray-400">Get in touch with us</p>
                    </Link>
                    <Link to="/faq" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">FAQ</h3>
                      <p className="text-sm text-gray-400">Frequently asked questions</p>
                    </Link>
                    <Link to="/workflow" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Workflow</h3>
                      <p className="text-sm text-gray-400">Our development process</p>
                    </Link>
                  </div>
                </div>

                {/* Legal Pages */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Legal & Information</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link to="/legal" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Legal Information</h3>
                      <p className="text-sm text-gray-400">Legal documents and information</p>
                    </Link>
                    <Link to="/privacy-policy" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Privacy Policy</h3>
                      <p className="text-sm text-gray-400">How we protect your data</p>
                    </Link>
                    <Link to="/terms-of-use" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Terms of Use</h3>
                      <p className="text-sm text-gray-400">Terms and conditions</p>
                    </Link>
                    <Link to="/nda" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">NDA Information</h3>
                      <p className="text-sm text-gray-400">Confidentiality and NDA details</p>
                    </Link>
                    <Link to="/licensing" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Licensing</h3>
                      <p className="text-sm text-gray-400">Software licensing information</p>
                    </Link>
                    <Link to="/accessibility" className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-1">Accessibility</h3>
                      <p className="text-sm text-gray-400">Accessibility statement</p>
                    </Link>
                  </div>
                </div>

                {/* Service Areas */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Service Areas by State</h2>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <p className="text-gray-300 mb-4">
                      Ondosoft provides software development services across all 50 states. Click on any state to view our services in that area.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {SERVICE_AREAS.states.slice(0, 20).map((state) => (
                        <Link
                          key={state.slug}
                          to={`/services/${state.slug}`}
                          className="text-orange-500 hover:text-orange-400 hover:underline text-sm"
                        >
                          {state.name}
                        </Link>
                      ))}
                      {SERVICE_AREAS.states.length > 20 && (
                        <div className="text-gray-400 text-sm col-span-full">
                          And {SERVICE_AREAS.states.length - 20} more states...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Cities */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Top Cities</h2>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <p className="text-gray-300 mb-4">
                      We serve major metropolitan areas across the United States. Select a city to learn more about our services in that location.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {SERVICE_AREAS.topCities.slice(0, 24).map((city) => (
                        <Link
                          key={city.slug}
                          to={`/services/${city.slug}`}
                          className="text-orange-500 hover:text-orange-400 hover:underline text-sm"
                        >
                          {city.displayName}
                        </Link>
                      ))}
                      {SERVICE_AREAS.topCities.length > 24 && (
                        <div className="text-gray-400 text-sm col-span-full">
                          And {SERVICE_AREAS.topCities.length - 24} more cities...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Our Services</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">Freelancing</h3>
                      <p className="text-sm text-gray-400">Flexible software development services</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">Full Stack Development</h3>
                      <p className="text-sm text-gray-400">End-to-end web application development</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">SaaS Applications</h3>
                      <p className="text-sm text-gray-400">Software as a Service platform development</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">Web Development</h3>
                      <p className="text-sm text-gray-400">Modern web application development</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">Mobile Apps</h3>
                      <p className="text-sm text-gray-400">Native and cross-platform mobile development</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-2">Cloud Deployment</h3>
                      <p className="text-sm text-gray-400">Cloud infrastructure and deployment services</p>
                    </div>
                  </div>
                </div>

                {/* XML Sitemap */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">XML Sitemap</h2>
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <p className="text-gray-300 mb-4">
                      For search engines and automated tools, we provide an XML sitemap:
                    </p>
                    <a
                      href="/sitemap.xml"
                      className="text-orange-500 hover:text-orange-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View XML Sitemap
                    </a>
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

export default SitemapPage;
