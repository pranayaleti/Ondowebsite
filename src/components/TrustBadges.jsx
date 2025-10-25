import React from 'react';
import { Shield, Award, Clock, Users, TrendingUp, CheckCircle, Star } from 'lucide-react';

const TrustBadges = () => {
  const successStory = {
    company: "TechStart Inc.",
    industry: "SaaS Platform",
    challenge: "Needed a scalable web application to handle 10,000+ users",
    solution: "Built a React-based SaaS platform with Node.js backend",
    results: {
      users: "10,000+",
      growth: "300%",
      efficiency: "40%",
      satisfaction: "4.9/5"
    },
    testimonial: "Ondosoft transformed our business. We went from 100 to 10,000+ users in just 6 months with zero downtime.",
    author: "Sarah Martinez",
    role: "CEO, TechStart Inc."
  };

  const trustBadges = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security standards",
      color: "text-blue-500"
    },
    {
      icon: Award,
      title: "Industry Certified",
      description: "AWS, Google Cloud certified",
      color: "text-yellow-500"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "200+ Clients",
      description: "Satisfied customers nationwide",
      color: "text-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust Badges */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Businesses <span className="text-orange-500">Trust Ondosoft</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We've earned the trust of businesses across the USA with our proven track record and commitment to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {trustBadges.map((badge, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group-hover:bg-orange-50">
                <div className={`${badge.color} mb-4 flex justify-center`}>
                  <badge.icon className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{badge.title}</h3>
                <p className="text-gray-600">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Client Success Story */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Story Content */}
            <div>
              <div className="mb-6">
                <span className="bg-white/20 text-orange-100 px-4 py-2 rounded-full text-sm font-medium">
                  Success Story
                </span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                How {successStory.company} Scaled with Ondosoft
              </h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-orange-100 mb-2">The Challenge:</h4>
                  <p className="text-orange-100">{successStory.challenge}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-orange-100 mb-2">Our Solution:</h4>
                  <p className="text-orange-100">{successStory.solution}</p>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{successStory.results.users}</div>
                  <div className="text-orange-100 text-sm">Active Users</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{successStory.results.growth}</div>
                  <div className="text-orange-100 text-sm">Growth</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{successStory.results.efficiency}</div>
                  <div className="text-orange-100 text-sm">Efficiency</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{successStory.results.satisfaction}</div>
                  <div className="text-orange-100 text-sm">Rating</div>
                </div>
              </div>

              {/* Testimonial */}
              <blockquote className="border-l-4 border-white/30 pl-6 mb-6">
                <p className="text-lg italic mb-4">"{successStory.testimonial}"</p>
                <div>
                  <div className="font-semibold">{successStory.author}</div>
                  <div className="text-orange-100">{successStory.role}</div>
                </div>
              </blockquote>

              <a 
                href="/contact" 
                className="inline-flex items-center bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Start Your Success Story
                <TrendingUp className="h-5 w-5 ml-2" />
              </a>
            </div>

            {/* Visual Elements */}
            <div className="relative">
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-4">{successStory.results.users}</div>
                  <div className="text-orange-100 text-lg mb-6">Users Served</div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-100">User Growth</span>
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-300 mr-2" />
                        <span className="text-green-300 font-semibold">+{successStory.results.growth}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-orange-100">Efficiency</span>
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                        <span className="text-green-300 font-semibold">+{successStory.results.efficiency}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-orange-100">Satisfaction</span>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-300 mr-2" />
                        <span className="text-yellow-300 font-semibold">{successStory.results.satisfaction}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Trusted by Industry Leaders
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-700">500+</div>
              <div className="text-gray-600 text-sm">Projects Delivered</div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-700">200+</div>
              <div className="text-gray-600 text-sm">Happy Clients</div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-700">10+</div>
              <div className="text-gray-600 text-sm">Years Experience</div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-gray-700">99%</div>
              <div className="text-gray-600 text-sm">Client Retention</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
