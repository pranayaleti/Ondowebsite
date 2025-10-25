import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Sarah Martinez",
      company: "TechStart Inc.",
      role: "CEO",
      image: "/assets/user1.jpg",
      rating: 5,
      quote: "Ondosoft built us a beautiful website that actually brings in customers! Our online orders increased by 300% in the first month. The best investment we've made for our business.",
      logo: "TechStart"
    },
    {
      id: 2,
      name: "Mike Chen",
      company: "DataFlow Solutions",
      role: "Founder",
      image: "/assets/user2.jpg",
      rating: 5,
      quote: "We needed a custom web app for our startup and Ondosoft delivered exactly what we needed. Professional, fast, and affordable. They understood our vision and brought it to life perfectly.",
      logo: "DataFlow"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "GrowthCo",
      role: "CTO",
      image: "/assets/user3.jpg",
      rating: 5,
      quote: "The SaaS platform they built for us has been a game-changer. Our team productivity increased by 40% and we've scaled from 10 to 100+ users seamlessly.",
      logo: "GrowthCo"
    },
    {
      id: 4,
      name: "David Thompson",
      company: "RetailMax",
      role: "Operations Director",
      image: "/assets/user4.jpg",
      rating: 5,
      quote: "From concept to deployment, Ondosoft made the entire process smooth and transparent. Our e-commerce solution is now handling 10x more traffic than before.",
      logo: "RetailMax"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our <span className="text-orange-500">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what real clients have to say about working with Ondosoft.
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Quote Section */}
                      <div>
                        <div className="mb-6">
                          <Quote className="h-12 w-12 text-orange-500 mb-4" />
                          <blockquote className="text-xl text-gray-700 leading-relaxed mb-6">
                            "{testimonial.quote}"
                          </blockquote>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                          <span className="ml-2 text-gray-600 font-medium">{testimonial.rating}/5</span>
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="text-center lg:text-left">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl mb-6">
                          <div className="flex items-center mb-4">
                            <OptimizedImage 
                              src={testimonial.image} 
                              alt={`${testimonial.name} profile picture`}
                              width={64}
                              height={64}
                              className="w-16 h-16 rounded-full border-4 border-white mr-4"
                              sizes="64px"
                            />
                            <div>
                              <h3 className="text-xl font-bold">{testimonial.name}</h3>
                              <p className="text-orange-100">{testimonial.role}</p>
                            </div>
                          </div>
                          <div className="bg-white/20 rounded-lg p-4">
                            <div className="text-orange-100 text-sm font-medium mb-1">Company</div>
                            <div className="text-white font-bold text-lg">{testimonial.company}</div>
                          </div>
                        </div>
                        
                        {/* Success Metrics */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-2xl font-bold text-orange-500">300%</div>
                            <div className="text-gray-600 text-sm">Growth</div>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-4">
                            <div className="text-2xl font-bold text-orange-500">40%</div>
                            <div className="text-gray-600 text-sm">Efficiency</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-orange-500 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Client Logos */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8">Trusted by leading companies</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="bg-gray-200 px-6 py-3 rounded-lg font-bold text-gray-700">TechStart</div>
            <div className="bg-gray-200 px-6 py-3 rounded-lg font-bold text-gray-700">DataFlow</div>
            <div className="bg-gray-200 px-6 py-3 rounded-lg font-bold text-gray-700">GrowthCo</div>
            <div className="bg-gray-200 px-6 py-3 rounded-lg font-bold text-gray-700">RetailMax</div>
            <div className="bg-gray-200 px-6 py-3 rounded-lg font-bold text-gray-700">InnovateCorp</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
