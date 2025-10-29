import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import SEOHead from "../components/SEOHead";
import ConsultationWidget from "../components/ConsultationWidget";
import ConsultationModal from "../components/ConsultationModal";
import Footer from "../components/Footer";

const NotFoundPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <SEOHead
        title="404 - Page Not Found | Ondosoft Software Development"
        description="The page you're looking for doesn't exist. Return to Ondosoft's homepage for software development, SaaS solutions, and freelancing services."
        noIndex={true}
      />
      <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-900 transition-all duration-300"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
      <Footer />
      <ConsultationWidget />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default NotFoundPage;
