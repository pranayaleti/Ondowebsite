import { useState, useEffect, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Compass, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import SEOHead from "../components/SEOHead";
// Lazy load heavy components
const CalendlyModal = lazy(() => import("../components/CalendlyModal"));
const Footer = lazy(() => import("../components/Footer"));

const NotFoundPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const popularLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/services", label: "Services", icon: Compass },
    { path: "/portfolio", label: "Portfolio", icon: Sparkles },
    { path: "/contact", label: "Contact", icon: ArrowRight },
  ];

  return (
    <>
      <SEOHead
        title="404 - Page Not Found | Ondosoft Software Development"
        description="The page you're looking for doesn't exist. Return to Ondosoft's homepage for software development, SaaS solutions, and custom project development."
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 bg-orange-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out"
            style={{
              left: `${mousePosition.x / 20}px`,
              top: `${mousePosition.y / 20}px`,
            }}
          />
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center relative z-10 px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated 404 */}
            <div className="mb-8 relative">
              <h1 className="text-[12rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 mb-4 leading-none animate-pulse">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-4 border-orange-500/30 rounded-full animate-ping" />
              </div>
            </div>

            {/* Error message */}
            <div className="mb-12 space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-4">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Page Not Found</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Oops! Looks like you're lost
              </h2>
              
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                The page you're looking for doesn't exist, has been moved, or is temporarily unavailable. 
                Don't worry though, we've got you covered!
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/"
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 transform"
              >
                <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Go Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="group inline-flex items-center justify-center gap-3 bg-gray-800/80 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700/80 transition-all duration-300 border border-gray-700 hover:border-gray-600 hover:scale-105 transform"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Go Back
              </button>
            </div>

            {/* Popular links section */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center gap-2 justify-center mb-6">
                <Compass className="w-5 h-5 text-orange-400" />
                <h3 className="text-xl font-bold text-white">Popular Pages</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={index}
                      to={link.path}
                      className="group flex flex-col items-center gap-3 p-6 bg-gray-900/50 hover:bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 transform"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all">
                        <Icon className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-white font-medium group-hover:text-orange-400 transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="h-32" />}>
          <Footer />
        </Suspense>
        {isModalOpen && (
          <Suspense fallback={null}>
            <CalendlyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default NotFoundPage;
