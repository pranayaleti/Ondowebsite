import {
  User,
  Code,
  TrendingUp,
  Home,
  Briefcase,
  GraduationCap,
  Star,
} from "lucide-react";
import Footer from "./Footer";
import founderImage from "../assets/profile-pictures/pranay-aleti.jpg";

const About = () => {
  return (
    <div>
      {/* Hero Section with Gradient */}
      <div className="relative">
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            About <span className="text-orange-500">Ondosoft</span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl">
            A senior product team that designs, builds, and scales secure software—pairing 
            clear strategy with production-grade engineering for web, mobile, and AI-powered experiences.
          </p>

          {/* Key Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-orange-500 bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-orange-500">
              <div className="text-4xl font-bold text-orange-400">50+</div>
              <div className="text-white mt-2">Launches Delivered</div>
              <div className="text-gray-400 text-sm">SaaS • Enterprise • Web</div>
            </div>
            <div className="bg-orange-500 bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-orange-500">
              <div className="text-4xl font-bold text-orange-400">4.9/5</div>
              <div className="text-white mt-2">Client Satisfaction</div>
              <div className="text-gray-400 text-sm">Rated by clients</div>
            </div>
            <div className="bg-orange-500 bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-orange-500">
              <div className="text-4xl font-bold text-orange-400">Nationwide</div>
              <div className="text-white mt-2">Collaboration</div>
              <div className="text-gray-400 text-sm">Strategy • Delivery</div>
            </div>
            <div className="bg-orange-500 bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-orange-500">
              <div className="text-4xl font-bold text-orange-400">On-time</div>
              <div className="text-white mt-2">Delivery</div>
              <div className="text-gray-400 text-sm">Every time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="flex items-center mb-6">
                <User className="text-orange-400 h-7 w-7 mr-4" />
                <h2 className="text-3xl font-bold text-white">Who We Are</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-shrink-0">
                  <img
                    src={founderImage}
                    alt="Pranay Reddy Aleti - Founder of Ondosoft"
                    className="w-48 h-48 rounded-lg object-cover border-2 border-orange-500/30 shadow-lg"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-lg leading-relaxed mb-4">
                    <strong className="text-orange-400">Ondosoft</strong> was founded by 
                    <strong className="text-orange-400"> Pranay Reddy Aleti</strong>, a software engineer with a Master's degree in Computer Science. We're a senior product team that moves quickly without cutting corners.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    We design, build, and scale <strong className="text-orange-400">secure software</strong>—from custom websites and SEO to SaaS platforms and enterprise applications. 
                    We pair <strong className="text-orange-400">strategy-first discovery</strong> with <strong className="text-orange-400">production-grade engineering</strong> for web, mobile, and AI-powered experiences.
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our mission is to make professional software development accessible to every business—delivering on time, with ongoing support and measurable uptime.
              </p>
            </div>

            {/* Vision Section */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="flex items-center mb-6">
                <TrendingUp className="text-orange-400 h-7 w-7 mr-4" />
                <h2 className="text-3xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                We believe that <strong className="text-orange-400">every business deserves a product team that ships to production</strong>.
                Our goal is to <strong className="text-orange-400">democratize premium software</strong>—making strategy-led, production-grade development 
                accessible for startups, SMBs, and enterprises alike.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                From web and SEO to custom SaaS and enterprise applications, 
                we're here to turn your <strong className="text-orange-400">vision into shipped software</strong>.
              </p>
            </div>

            {/* Why Work With Me */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="flex items-center mb-6">
                <Star className="text-orange-400 h-7 w-7 mr-4" />
                <h2 className="text-3xl font-bold text-white">Why Work With Us?</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="text-white font-bold mb-2">Strategy-First Discovery</h4>
                    <p className="text-gray-400 text-sm">
                      Clear roadmap and discovery before we build. We align on goals and scope so delivery stays on track.
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="text-white font-bold mb-2">On-Time Delivery</h4>
                    <p className="text-gray-400 text-sm">
                      We move quickly without cutting corners. Production-grade engineering, delivered when we say we will.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="text-white font-bold mb-2">SaaS & Enterprise Launches</h4>
                    <p className="text-gray-400 text-sm">
                      Dozens of launches across SaaS and enterprise. From MVPs to scale-ready platforms.
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="text-white font-bold mb-2">Ongoing Support & Uptime</h4>
                    <p className="text-gray-400 text-sm">
                      We don't ship and disappear. Maintenance, updates, and support with measurable uptime.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What Ondosoft Stands For */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="flex items-center mb-6">
                <Home className="text-orange-400 h-7 w-7 mr-4" />
                <h2 className="text-3xl font-bold text-white">What Ondosoft Stands For</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                <strong className="text-orange-400">Ondosoft</strong> is about shipping to production—strong foundations, 
                clean codebases, clear interfaces, and dependable infrastructure.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                From design systems to microservices, CI pipelines to production monitoring,
                we deliver software that teams can trust and scale.
              </p>
            </div>

            {/* Personal Background */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="flex items-center mb-6">
                <Briefcase className="text-orange-400 h-7 w-7 mr-4" />
                <h2 className="text-3xl font-bold text-white">A Little More About Me</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                When I'm not writing code, I'm with family in <strong className="text-orange-400">Lehi, Utah</strong>,
                lifting, tinkering with new tools, or exploring ideas at the intersection of
                product, engineering, and business.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                I believe in <strong className="text-orange-400">thinking long-term</strong>, staying adaptable, and
                continuously improving the craft of software engineering.
              </p>
            </div>

            {/* Let's Connect */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="flex items-center mb-6">
                <Code className="text-orange-400 h-7 w-7 mr-4" />
                <h2 className="text-3xl font-bold text-white">Let's Connect</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Startup or enterprise—if you want to <strong className="text-orange-400">ship to production</strong>,
                <strong className="text-orange-400"> scale confidently</strong>, and <strong className="text-orange-400">deliver on time</strong>, let's talk.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed font-medium">
                A senior product team that designs, builds, and scales secure software—<strong className="text-orange-400">premium software, delivered</strong>.
              </p>
            </div>
          </div>

          {/* Right Column - Key Highlights */}
          <div className="space-y-6">
            {/* Skills & Technologies */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-orange-400 mb-4">Technical Skills</h3>
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white font-semibold">Frontend</div>
                  <div className="text-gray-400 text-sm">React, TypeScript, Tailwind CSS</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white font-semibold">Backend</div>
                  <div className="text-gray-400 text-sm">Node.js, Python, PostgreSQL</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white font-semibold">Cloud & DevOps</div>
                  <div className="text-gray-400 text-sm">AWS, Docker, CI/CD, Terraform</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white font-semibold">Data & AI</div>
                  <div className="text-gray-400 text-sm">ETL, Analytics, LLM Integrations</div>
                </div>
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-orange-400 mb-4">Education</h3>
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white font-semibold">Master's Degree</div>
                  <div className="text-gray-400 text-sm">Computer Science (U.S.)</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white font-semibold">Certifications</div>
                  <div className="text-gray-400 text-sm">AWS • Kubernetes • Security</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white font-semibold">Continuous Learning</div>
                  <div className="text-gray-400 text-sm">System Design • AI • SRE</div>
                </div>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-orange-400 mb-4">Focus Areas</h3>
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white font-semibold">SaaS Platforms</div>
                  <div className="text-gray-400 text-sm">Subscriptions, billing, multi-tenant architecture</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white font-semibold">Developer Tools</div>
                  <div className="text-gray-400 text-sm">DX, CLIs, SDKs, integrations</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-white font-semibold">AI-Assisted Workflows</div>
                  <div className="text-gray-400 text-sm">Automation, copilots, intelligent UIs</div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-orange-900 to-gray-900 rounded-xl p-6 border border-orange-500">
              <h3 className="text-xl font-bold text-white mb-4">Ready to Ship?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Schedule a meeting. We'll design, build, and scale your next product—on time.
              </p>
              <a href="/contact" className="w-full block text-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors mb-4">
                Schedule a Meeting
              </a>
              <div className="text-center">
                <a href="/testimonials" className="text-orange-400 hover:text-orange-300 text-sm font-medium">
                  Client Reviews →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-20 border-t border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ship <span className="text-orange-500">to Production?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Strategy-first discovery, production-grade engineering—from MVPs to scale-ready platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors border border-gray-600">
              Schedule a meeting
            </a>
            <a href="/capabilities-deck" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors border border-gray-600">
              Download Capabilities Deck
            </a>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-400">50+</div>
              <div className="text-gray-400 text-sm mt-1">Launches Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">4.9/5</div>
              <div className="text-gray-400 text-sm mt-1">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">Nationwide</div>
              <div className="text-gray-400 text-sm mt-1">Collaboration</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">On-time</div>
              <div className="text-gray-400 text-sm mt-1">Delivery, Every Time</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;


