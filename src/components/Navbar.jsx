import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import { navItems } from "../constants/data";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, signout } = useAuth();

  // Hide navbar on auth pages, portal, and admin pages
  const hideNavbar = location.pathname.startsWith('/auth') || 
                     location.pathname.startsWith('/portal') || 
                     location.pathname.startsWith('/admin');

  const handleSignOut = async () => {
    await signout();
    navigate('/');
    setMobileDrawerOpen(false);
  };

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

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


  // Helper to determine if nav item is active
  const isActive = (href) => {
    if (href === "/" && location.pathname === "/") return true;
    return location.pathname === href;
  };

  if (hideNavbar) {
    return null;
  }

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
              <div className="h-14 w-14 mr-3 rounded-full overflow-hidden shadow-lg">
                <img 
                  src="/logo.png"
                  alt="Ondosoft logo - Full stack software development company specializing in React, Node.js, Python, and SaaS solutions"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                  loading="eager"
                />
              </div>
              <span className="text-2xl font-bold text-gray-800">
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
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === 'ADMIN' ? '/admin' : '/portal'}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-md font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                  >
                    {user?.role === 'ADMIN' ? 'Admin' : 'Portal'}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-orange-500 font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth/signin"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-md font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                >
                  Client Portal
                </Link>
              )}
            </div>
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
            <div 
              className="fixed inset-0 z-50 bg-black bg-opacity-50" 
              onClick={toggleNavbar}
              style={{ touchAction: 'none' }}
            ></div>
            <div 
              className="fixed top-0 right-0 z-50 bg-gradient-to-b from-black to-gray-900 w-80 h-full shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
              style={{ touchAction: 'pan-y' }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="h-12 w-12 mr-3 rounded-full overflow-hidden">
                      <img 
                        src="/logo.png"
                        alt="Ondosoft logo"
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                        loading="eager"
                      />
                    </div>
                    <span className="text-xl font-bold text-white">OndoSoft</span>
                  </div>
                  <button 
                    onClick={toggleNavbar}
                    className="text-gray-400 hover:text-white transition-colors"
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
                            : "block py-3 px-4 rounded-md text-gray-300 hover:text-orange-400 hover:bg-gray-800/50 transition-all duration-200 font-medium"
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-gray-700 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to={user?.role === 'ADMIN' ? '/admin' : '/portal'}
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block w-full py-3 px-4 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-center hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                      >
                        {user?.role === 'ADMIN' ? 'Admin' : 'Portal'}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full py-3 px-4 rounded-md bg-gray-800 text-gray-200 font-semibold text-center hover:bg-gray-700 transition-all duration-200"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth/signin"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block w-full py-3 px-4 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-center hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                    >
                      Client Portal
                    </Link>
                  )}
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
