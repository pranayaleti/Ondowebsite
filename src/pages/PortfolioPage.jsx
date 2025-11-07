import React, { useState, useRef } from 'react';
import SEOHead from '../components/SEOHead';
import ConsultationWidget from '../components/ConsultationWidget';
import ConsultationModal from '../components/ConsultationModal';
import Footer from '../components/Footer';
import { ArrowRight, TrendingUp, Users, Clock, CheckCircle, Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import PMT from '../assets/PMT_optimized.webm';
import { checklistItems } from '../constants/data';

const PortfolioPage = () => {
  const [selectedProject, setSelectedProject] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef(null);

  const toggleFullScreen = () => {
    const videoElement = videoRef.current;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen(); // Firefox
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen(); // Chrome, Safari
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen(); // IE/Edge
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const portfolioProjects = [
    {
      id: 1,
      title: "TechStart Inc. - SaaS Platform Development",
      client: "TechStart Inc.",
      industry: "SaaS",
      duration: "6 months",
      team: "4 developers",
      challenge: "Needed a scalable SaaS platform to handle 10,000+ users with subscription billing, multi-tenant architecture, and real-time analytics.",
      solution: "Built a React-based SaaS platform with Node.js backend, PostgreSQL database, Stripe integration, and AWS deployment.",
      results: {
        users: "10,000+",
        growth: "300%",
        efficiency: "40%",
        satisfaction: "4.9/5"
      },
      technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Stripe"],
      testimonial: "Ondosoft transformed our business. We went from 100 to 10,000+ users in just 6 months with zero downtime. The platform handles everything seamlessly.",
      author: "Sarah Martinez",
      role: "CEO, TechStart Inc.",
      beforeAfter: {
        before: {
          users: "100",
          revenue: "$5K/month",
          efficiency: "60%",
          issues: "Frequent downtime"
        },
        after: {
          users: "10,000+",
          revenue: "$50K/month",
          efficiency: "95%",
          issues: "Zero downtime"
        }
      },
      screenshots: [
        "/assets/portfolio-1-dashboard.jpg",
        "/assets/portfolio-1-analytics.jpg",
        "/assets/portfolio-1-mobile.jpg"
      ]
    },
    {
      id: 2,
      title: "RetailMax - E-commerce Solution",
      client: "RetailMax",
      industry: "E-commerce",
      duration: "4 months",
      team: "3 developers",
      challenge: "Legacy e-commerce system couldn't handle increased traffic and lacked modern features like mobile optimization and real-time inventory.",
      solution: "Developed a modern e-commerce platform with React frontend, Node.js API, real-time inventory management, and mobile-first design.",
      results: {
        traffic: "500%",
        sales: "250%",
        mobile: "80%",
        satisfaction: "4.8/5"
      },
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
      testimonial: "Our online sales increased by 250% in the first month after launch. The mobile experience is incredible and our customers love it.",
      author: "Mike Chen",
      role: "CTO, RetailMax",
      beforeAfter: {
        before: {
          traffic: "1,000/day",
          sales: "$10K/month",
          mobile: "20%",
          issues: "Poor mobile experience"
        },
        after: {
          traffic: "5,000/day",
          sales: "$35K/month",
          mobile: "80%",
          issues: "Excellent mobile UX"
        }
      },
      screenshots: [
        "/assets/portfolio-2-homepage.jpg",
        "/assets/portfolio-2-product.jpg",
        "/assets/portfolio-2-checkout.jpg"
      ]
    },
    {
      id: 3,
      title: "DataFlow Solutions - Custom Web Application",
      client: "DataFlow Solutions",
      industry: "Data Analytics",
      duration: "3 months",
      team: "2 developers",
      challenge: "Needed a custom data visualization dashboard to replace multiple disconnected tools and provide real-time insights.",
      solution: "Created a comprehensive data analytics platform with interactive dashboards, real-time data processing, and automated reporting.",
      results: {
        efficiency: "60%",
        insights: "Real-time",
        reports: "Automated",
        satisfaction: "5.0/5"
      },
      technologies: ["React", "D3.js", "Python", "PostgreSQL", "Docker"],
      testimonial: "The new platform has revolutionized how we analyze data. What used to take hours now takes minutes, and the insights are incredible.",
      author: "Emily Rodriguez",
      role: "Data Director, DataFlow Solutions",
      beforeAfter: {
        before: {
          efficiency: "40%",
          insights: "Daily reports",
          reports: "Manual",
          issues: "Data silos"
        },
        after: {
          efficiency: "95%",
          insights: "Real-time",
          reports: "Automated",
          issues: "Unified platform"
        }
      },
      screenshots: [
        "/assets/portfolio-3-dashboard.jpg",
        "/assets/portfolio-3-analytics.jpg",
        "/assets/portfolio-3-reports.jpg"
      ]
    }
  ];

  const currentProject = portfolioProjects[selectedProject];

  const nextProject = () => {
    setSelectedProject((prev) => (prev + 1) % portfolioProjects.length);
  };

  const prevProject = () => {
    setSelectedProject((prev) => (prev - 1 + portfolioProjects.length) % portfolioProjects.length);
  };

  return (
    <>
      <SEOHead
        title="Portfolio | Ondosoft Software Development Projects & Success Stories"
        description="Explore our portfolio of successful software development projects. See how we've helped businesses scale with custom web applications, SaaS platforms, and mobile solutions. Real projects, real results."
        keywords="portfolio, software development projects, web application portfolio, SaaS development examples, mobile app portfolio, client projects, development showcase, project results"
        canonicalUrl="https://ondosoft.com/portfolio"
      />
      
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-900 py-20 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Our <span className="text-orange-500">Portfolio</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Real projects, real results. See how we've helped businesses transform their operations 
                with custom software solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                See Our Work in <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">Action</span>
              </h2>
              <span className="bg-neutral-900 text-orange-500 rounded-full h-6 text-sm font-medium px-4 py-2">
                Real projects delivered for real businesses
              </span>
            </div>

            <div className="flex flex-col lg:flex-row justify-center items-center gap-12">
              <div className="p-2 w-full lg:w-1/2">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  onClick={toggleFullScreen}
                  className="rounded-lg w-full border border-orange-700 shadow-sm shadow-orange-400 mx-auto cursor-pointer"
                >
                  <source src={PMT} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="pt-12 w-full lg:w-1/2">
                {checklistItems.map((item, index) => (
                  <div key={index} className="flex mb-12">
                    <div className="text-green-400 mx-6 bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
                      <CheckCircle />
                    </div>
                    <div>
                      <h3 className="mt-1 mb-2 text-xl text-white">{item.title}</h3>
                      <p className="text-md text-neutral-400 mb-4">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Navigation */}
        <section className="py-12 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={prevProject}
                  className="p-2 rounded-full border border-gray-600 hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
                <span className="text-gray-300">
                  {selectedProject + 1} of {portfolioProjects.length}
                </span>
                <button
                  onClick={nextProject}
                  className="p-2 rounded-full border border-gray-600 hover:bg-gray-800 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolioProjects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(index)}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg ${
                    selectedProject === index
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-gray-700 hover:border-orange-300 bg-gray-800'
                  }`}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm">{project.client} • {project.industry}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <div className="font-semibold text-white">{project.duration}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Team:</span>
                      <div className="font-semibold text-white">{project.team}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Project Detail */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Details */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">{currentProject.title}</h2>
                  <div className="flex items-center space-x-6 text-gray-300 mb-6">
                    <span>{currentProject.client}</span>
                    <span>•</span>
                    <span>{currentProject.industry}</span>
                    <span>•</span>
                    <span>{currentProject.duration}</span>
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">The Challenge</h3>
                    <p className="text-gray-300 leading-relaxed">{currentProject.challenge}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Our Solution</h3>
                    <p className="text-gray-300 leading-relaxed">{currentProject.solution}</p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Results & Testimonial */}
              <div>
                {/* Results */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white mb-8 border border-gray-700">
                  <h3 className="text-2xl font-bold mb-6">Results</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(currentProject.results).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-3xl font-bold mb-2">{value}</div>
                        <div className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Before/After Comparison */}
                <div className="bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Before vs After</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-red-400 mb-4">Before</h4>
                      <div className="space-y-3">
                        {Object.entries(currentProject.beforeAfter.before).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400 capitalize">{key}:</span>
                            <span className="font-semibold text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400 mb-4">After</h4>
                      <div className="space-y-3">
                        {Object.entries(currentProject.beforeAfter.after).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400 capitalize">{key}:</span>
                            <span className="font-semibold text-white">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-gray-300 italic mb-6">
                    "{currentProject.testimonial}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-white">{currentProject.author}</div>
                    <div className="text-gray-400">{currentProject.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Your <span className="text-orange-500">Success Story?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Let's discuss your project and see how we can help you achieve similar results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-gray-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center border border-gray-600"
              >
                Start Your Project
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 hover:border-gray-500 transition-colors flex items-center justify-center"
              >
                Start Free Consultation
              </button>
            </div>
          </div>
        </section>

        <Footer />
        <ConsultationWidget />
        <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default PortfolioPage;
