import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import { navItems } from "../constants/data";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setScrolled(false);
    setMobileDrawerOpen(false);
  };

  const handleMobileNavClick = (e, item) => {
    e.preventDefault();
    if (item.label === "Home") {
      handleLogoClick(e);
    } else {
      navigate(item.href);
    }
    setMobileDrawerOpen(false);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    navigate("/contact");
    setMobileDrawerOpen(false);
  };

  // Helper to determine if nav item is active
  const isActive = (href) => {
    if (href === "/" && location.pathname === "/") return true;
    return location.pathname === href;
  };

  return (
    <nav
      className={`sticky top-0 z-50 py-3 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-lg border-b border-neutral-700/80 bg-white/95"
          : "bg-white/90 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              to="/"
              onClick={handleLogoClick}
              className="flex items-center"
            >
              <div className="h-10 w-10 mr-3 rounded-full overflow-hidden shadow-lg">
                <img 
                  src="/logo.png"
                  alt="Ondosoft logo - Full stack software development company specializing in React, Node.js, Python, and SaaS solutions"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                  loading="eager"
                />
              </div>
              <span className="text-xl font-bold text-gray-800">
                OndoSoft
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <ul className="flex items-center space-x-6">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    onClick={item.label === "Home" ? handleLogoClick : undefined}
                    className={
                      isActive(item.href)
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 rounded-md font-semibold shadow-md"
                        : "text-gray-700 hover:text-orange-500 hover:bg-orange-50 px-3 py-2 rounded-md transition-all duration-200 font-medium"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-md font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleNavbar}
              className="text-gray-700 hover:text-orange-500 p-2 rounded-md hover:bg-orange-50 transition-colors"
            >
              {mobileDrawerOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleNavbar}></div>
            <div className="fixed top-0 right-0 z-50 bg-white w-80 h-full shadow-xl transform transition-transform duration-300 ease-in-out">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="h-8 w-8 mr-2 rounded-full overflow-hidden">
                      <img 
                        src="/logo.png"
                        alt="Ondosoft logo"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                        loading="eager"
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-800">OndoSoft</span>
                  </div>
                  <button 
                    onClick={toggleNavbar}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <ul className="space-y-2">
                  {navItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.href}
                        onClick={e => handleMobileNavClick(e, item)}
                        className={
                          isActive(item.href)
                            ? "block py-3 px-4 rounded-md bg-orange-500 text-white font-semibold"
                            : "block py-3 px-4 rounded-md text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 font-medium"
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    to="/contact"
                    onClick={handleContactClick}
                    className="block w-full py-3 px-4 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-center hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
