import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo2 from "../assets/logo2.png";
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
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <Link
              to="/"
              onClick={handleLogoClick}
              className="h-10 w-10 mr-2 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <img className="h-8 w-8 rounded-full" src={logo2} alt="Logo" />
            </Link>
            <Link
              to="/"
              onClick={handleLogoClick}
              className="text-xl tracking-tight ml-1 text-gray-800 font-bold"
            >
              OndoSoft
            </Link>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
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
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-md font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
             Contact Us
            </Link>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button 
              onClick={toggleNavbar}
              className="text-gray-700 hover:text-orange-500 p-2 rounded-md hover:bg-orange-50 transition-colors"
            >
              {mobileDrawerOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-white w-full p-12 flex flex-col justify-center items-center lg:hidden shadow-lg border-t border-gray-200">
            <ul className="space-y-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.href}
                    onClick={e => handleMobileNavClick(e, item)}
                    className={
                      isActive(item.href)
                        ? "block py-3 px-4 rounded-md bg-orange-500 text-white font-semibold shadow-md"
                        : "block py-3 px-4 rounded-md text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 font-medium"
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <button
                onClick={handleContactClick}
                className="py-3 px-6 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
