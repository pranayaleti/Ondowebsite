import { Shield, Award, Clock, Users, TrendingUp, CheckCircle, Star } from 'lucide-react';
import techstartDashboard from '../assets/portfolio/techstart-dashboard.jpg';

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
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust Badges */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Engineered for <span className="text-orange-500">Performance & Trust</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We partner with ambitious companies to deliver technical excellence and measurable business impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {trustBadges.map((badge, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group-hover:bg-gray-700 border border-gray-700">
                <div className={`${badge.color} mb-4 flex justify-center`}>
                  <badge.icon className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{badge.title}</h3>
                <p className="text-gray-300">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Client Success Story */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 text-white border border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Story Content */}
            <div>
              <div className="mb-6">
                <span className="bg-gray-700/50 text-orange-500 px-4 py-2 rounded-full text-sm font-medium border border-gray-600">
                  Success Story
                </span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Case Study: Scaling {successStory.company} to <span className="text-orange-500">10k+ Users</span>
              </h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">The Challenge:</h4>
                  <p className="text-gray-300">{successStory.challenge}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Our Solution:</h4>
                  <p className="text-gray-300">{successStory.solution}</p>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-700/50 rounded-lg p-4 text-center border border-gray-600">
                  <div className="text-2xl font-bold">{successStory.results.users}</div>
                  <div className="text-gray-300 text-sm">Active Users</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 text-center border border-gray-600">
                  <div className="text-2xl font-bold">{successStory.results.growth}</div>
                  <div className="text-gray-300 text-sm">Growth</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 text-center border border-gray-600">
                  <div className="text-2xl font-bold">{successStory.results.efficiency}</div>
                  <div className="text-gray-300 text-sm">Efficiency</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 text-center border border-gray-600">
                  <div className="text-2xl font-bold">{successStory.results.satisfaction}</div>
                  <div className="text-gray-300 text-sm">Rating</div>
                </div>
              </div>

              {/* Testimonial */}
              <blockquote className="border-l-4 border-gray-600 pl-6 mb-6">
                <p className="text-lg italic mb-4 text-gray-200">"{successStory.testimonial}"</p>
                <div>
                  <div className="font-semibold">{successStory.author}</div>
                  <div className="text-gray-300">{successStory.role}</div>
                </div>
              </blockquote>

              <a 
                href="/contact" 
                className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors border border-orange-400 shadow-lg"
              >
                Scale Your Venture
                <TrendingUp className="h-5 w-5 ml-2" />
              </a>
            </div>

            {/* Visual Elements */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
                <img
                  src={techstartDashboard}
                  alt="TechStart Dashboard"
                  className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-bold">Live Dashboard</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">System Online</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded p-2 text-center">
                      <div className="text-orange-400 font-bold text-sm">{successStory.results.users}</div>
                      <div className="text-gray-400 text-[10px]">Users</div>
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded p-2 text-center">
                      <div className="text-orange-400 font-bold text-sm">{successStory.results.growth}</div>
                      <div className="text-gray-400 text-[10px]">Growth</div>
                    </div>
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded p-2 text-center">
                      <div className="text-orange-400 font-bold text-sm">{successStory.results.satisfaction}</div>
                      <div className="text-gray-400 text-[10px]">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            Trusted by Industry Leaders
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-gray-300 text-sm">Projects Delivered</div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-2xl font-bold text-white">200+</div>
              <div className="text-gray-300 text-sm">Happy Clients</div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-2xl font-bold text-white">10+</div>
              <div className="text-gray-300 text-sm">Years Experience</div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <div className="text-2xl font-bold text-white">99%</div>
              <div className="text-gray-300 text-sm">Client Retention</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
