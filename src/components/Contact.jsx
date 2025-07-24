import { Mail, Phone, MapPin } from "lucide-react";
import React from "react";

const Contact = () => {
  return (
    <div className="mt-20" id="contact">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-8 tracking-wide">
        Contact
      </h2>
      <div className="flex flex-col lg:flex-row gap-10 max-w-4xl mx-auto">
        {/* Contact Info */}
        <div className="flex-1 bg-neutral-900 p-8 rounded-xl border border-neutral-700 flex flex-col justify-center mb-6 lg:mb-0">
          <h3 className="text-2xl font-semibold text-white mb-6">Contact Information</h3>
          <div className="flex items-center mb-4 text-neutral-300">
            <Mail className="mr-3 text-orange-500" />
            <span>contact@ondo.com</span>
          </div>
          <div className="flex items-center mb-4 text-neutral-300">
            <Phone className="mr-3 text-orange-500" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center text-neutral-300">
            <MapPin className="mr-3 text-orange-500" />
            <span>123 Main Street, City, Country</span>
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
          <textarea
            placeholder="Your Message"
            rows={5}
            className="rounded-md bg-neutral-800 text-white border border-neutral-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-800 text-white font-semibold py-3 rounded-md text-lg"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact; 