import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Video, Download, ArrowRight, CheckCircle } from 'lucide-react';

const ResourcesSection = () => {
  const resources = [
    {
      id: 'blog',
      title: 'Business Tech Blog',
      description: 'Expert insights on automation, SaaS solutions, and web development for small businesses.',
      icon: BookOpen,
      link: '/blog',
      color: 'bg-blue-500',
      items: [
        'How to automate business operations',
        'SaaS solutions for growth',
        'Freelance developer insights',
        'Technology tips and tricks'
      ]
    },
    {
      id: 'guides',
      title: 'Free Business Guides',
      description: 'Step-by-step guides to help you implement technology solutions in your business.',
      icon: FileText,
      link: '/guides',
      color: 'bg-green-500',
      items: [
        'Website optimization checklist',
        'Automation implementation guide',
        'SaaS selection framework',
        'Cost reduction strategies'
      ]
    },
    {
      id: 'webinars',
      title: 'Live Webinars',
      description: 'Join our monthly webinars to learn from experts and get your questions answered.',
      icon: Video,
      link: '/webinars',
      color: 'bg-purple-500',
      items: [
        'Monthly tech trends discussion',
        'Q&A with development experts',
        'Case study deep dives',
        'Live coding demonstrations'
      ]
    },
    {
      id: 'templates',
      title: 'Business Templates',
      description: 'Ready-to-use templates for common business processes and documentation.',
      icon: Download,
      link: '/templates',
      color: 'bg-orange-500',
      items: [
        'Project requirement templates',
        'Vendor evaluation sheets',
        'ROI calculation tools',
        'Implementation checklists'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Free <span className="text-orange-500">Resources</span> for Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to grow your business with technology. 
            Free guides, templates, and expert insights to help you succeed.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Icon */}
              <div className={`${resource.color} p-6 text-white`}>
                <resource.icon className="h-8 w-8" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {resource.items.map((item, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to={resource.link}
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold group-hover:text-orange-700"
                >
                  Explore Resources
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Get personalized recommendations for your business. Our experts will analyze 
              your needs and suggest the best technology solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Get Free Consultation
              </Link>
              <Link
                to="/blog"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Read Our Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
