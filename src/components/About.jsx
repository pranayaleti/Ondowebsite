import React from "react";
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

const About = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-orange-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            About <span className="text-orange-500">Me</span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl">
            Software engineer, product builder, and founder focused on crafting reliable,
            scalable, and delightful software products—from idea to production.
          </p>

          {/* Key Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-orange-500 bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-orange-500">
              <div className="text-4xl font-bold text-orange-400">10+</div>
              <div className="text-white mt-2">Years in Tech</div>
              <div className="text-gray-400 text-sm">Full Stack • Cloud</div>
            </div>
            <div className="bg-orange-500 bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-orange-500">
              <div className="text-4xl font-bold text-orange-400">12+</div>
              <div className="text-white mt-2">Products Launched</div>
              <div className="text-gray-400 text-sm">SaaS • Mobile • APIs</div>
            </div>
            <div className="bg-orange-500 bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-orange-500">
              <div className="text-4xl font-bold text-orange-400">100+</div>
              <div className="text-white mt-2">Projects Built</div>
              <div className="text-gray-400 text-sm">Web & Mobile Apps</div>
            </div>
            <div className="bg-orange-500 bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-orange-500">
              <div className="text-4xl font-bold text-orange-400">99.9%</div>
              <div className="text-white mt-2">Uptime Achieved</div>
              <div className="text-gray-400 text-sm">SRE • Observability</div>
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
                <h2 className="text-3xl font-bold text-white">Who I Am</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Hi, I'm <strong className="text-orange-400">Pranay Reddy Aleti</strong>
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                A <strong className="text-orange-400">software engineer, product thinker, and entrepreneur</strong> with a
                Master's degree in Computer Science. I specialize in building modern
                <strong className="text-orange-400"> React/Node.js</strong> applications, scalable APIs, and cloud-native systems on
                AWS with CI/CD, testing, and observability baked in.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                I love solving hard problems, designing clean architectures, and delivering products
                that users actually enjoy using.
              </p>
            </div>

            {/* Vision Section */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="flex items-center mb-6">
                <TrendingUp className="text-orange-400 h-7 w-7 mr-4" />
                <h2 className="text-3xl font-bold text-white">My Vision</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Great software should be <strong className="text-orange-400">reliable, fast, and human-centered</strong>.
                With OndoSoft, my goal is to <strong className="text-orange-400">bridge idea to production</strong> by
                streamlining product development, infrastructure automation, and continuous delivery.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                It's engineering reimagined—where quality, velocity, and trust are at the core.
              </p>
            </div>

            {/* Why Work With Me */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="flex items-center mb-6">
                <Star className="text-orange-400 h-7 w-7 mr-4" />
                <h2 className="text-3xl font-bold text-white">Why Work With Me?</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="text-white font-bold mb-2">Technical Excellence</h4>
                    <p className="text-gray-400 text-sm">
                      Strong foundations in system design, API architecture, testing, performance, and security.
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="text-white font-bold mb-2">Product Thinking</h4>
                    <p className="text-gray-400 text-sm">
                      Outcomes over output—user research, rapid iteration, and data-informed decisions.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="text-white font-bold mb-2">Security & Reliability</h4>
                    <p className="text-gray-400 text-sm">
                      Threat modeling, auth best practices, observability, and SRE principles for high uptime.
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="text-white font-bold mb-2">Hands-On Execution</h4>
                    <p className="text-gray-400 text-sm">
                      I design, code, and ship—owning features end-to-end from spec to production.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What OndoSoft Stands For */}
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="flex items-center mb-6">
                <Home className="text-orange-400 h-7 w-7 mr-4" />
                <h2 className="text-3xl font-bold text-white">What OndoSoft Stands For</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                <strong className="text-orange-400">OndoSoft</strong> is about building strong foundations—
                clean codebases, clear interfaces, and dependable infrastructure.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                From design systems to microservices, from CI pipelines to production monitoring,
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
                Startup or enterprise—if you want to <strong className="text-orange-400">ship faster</strong>,
                <strong className="text-orange-400"> scale confidently</strong>, and <strong className="text-orange-400">delight users</strong>, let's talk.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed font-medium">
                This isn't just development—it's <strong className="text-orange-400">product delivery redefined</strong>.
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
              <h3 className="text-xl font-bold text-white mb-4">Ready to Build?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Let's discuss how we can design, build, and ship your next product.
              </p>
              <a href="/contact" className="w-full block text-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Schedule a Meeting
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Ship Faster?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            From MVPs to scale-ready platforms—let's build something users love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors">
              Start Your Journey
            </a>
            <a href="#" className="bg-white hover:bg-gray-100 text-orange-600 px-8 py-4 rounded-lg text-lg font-bold transition-colors">
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
              <div className="text-3xl font-bold text-orange-400">10+</div>
              <div className="text-gray-400 text-sm mt-1">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">100+</div>
              <div className="text-gray-400 text-sm mt-1">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">12+</div>
              <div className="text-gray-400 text-sm mt-1">Products Shipped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">99.9%</div>
              <div className="text-gray-400 text-sm mt-1">Uptime Achieved</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;


