import { Mail, Phone, MapPin } from "lucide-react";
import React from "react";

const Contact = () => {
  return (
    <div className="mt-20" id="contact">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-8 tracking-wide">
        Let's Build
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          {" "}Something Great
        </span>
      </h2>
      <p className="text-center text-neutral-400 text-lg mb-8 max-w-3xl mx-auto">
        Ready to take your business to the next level? Let's discuss your project 
        and see how we can help you achieve your goals.
      </p>
      <div className="flex flex-col lg:flex-row gap-10 max-w-4xl mx-auto">
        {/* Contact Info */}
        <div className="flex-1 bg-neutral-900 p-8 rounded-xl border border-neutral-700 flex flex-col justify-center mb-6 lg:mb-0">
          <h3 className="text-2xl font-semibold text-white mb-6">Get In Touch</h3>
          <p className="text-neutral-400 mb-6">
            Whether you're a small business owner looking for a simple website or a startup 
            building the next big SaaS platform, we're here to help. Let's discuss your project!
          </p>
          <div className="flex items-center mb-4 text-neutral-300">
            <Mail className="mr-3 text-orange-500" />
            <span>hello@ondosoft.com</span>
          </div>
          <div className="flex items-center mb-4 text-neutral-300">
            <Phone className="mr-3 text-orange-500" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center text-neutral-300">
            <MapPin className="mr-3 text-orange-500" />
            <span>Lehi, Utah, USA</span>
          </div>
        </div>
        {/* Contact Form */}
        <form className="flex-1 bg-neutral-900 p-8 rounded-xl shadow-md flex flex-col gap-6 border border-neutral-700">
          <input
            type="text"
            placeholder="Your Name"
            className="rounded-md bg-neutral-800 text-white border border-neutral-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="rounded-md bg-neutral-800 text-white border border-neutral-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
          />
          <input
            type="text"
            placeholder="Company/Business Name"
            className="rounded-md bg-neutral-800 text-white border border-neutral-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
          />
          <select className="rounded-md bg-neutral-800 text-white border border-neutral-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">Project Type</option>
            <option value="website">Small Business Website</option>
            <option value="webapp">Custom Web Application</option>
            <option value="saas">SaaS Platform</option>
            <option value="ecommerce">E-commerce Solution</option>
            <option value="mobile">Mobile App</option>
            <option value="other">Other</option>
          </select>
          <textarea
            placeholder="Tell us about your project and goals..."
            rows={4}
            className="rounded-md bg-neutral-800 text-white border border-neutral-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-800 text-white font-semibold py-3 rounded-md text-lg hover:from-orange-600 hover:to-orange-900 transition-all duration-300"
          >
            Get Free Quote
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact; 