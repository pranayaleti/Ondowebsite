import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react";
import { Menu, X } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import { navItems } from "../constants/data";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HAMBURGER_GUARD_MS = 300;

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastToggleTimeRef = useRef(0);
  const mobileDrawerOpenRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, signout } = useAuth();

  // Hide navbar on auth pages, dashboard, and admin pages
  const hideNavbar = useMemo(() => 
    location.pathname.startsWith('/auth') || 
    location.pathname.startsWith('/dashboard') || 
    location.pathname.startsWith('/admin'),
    [location.pathname]
  );

  const handleSignOut = useCallback(async () => {
    await signout();
    navigate('/');
    setMobileDrawerOpen(false);
  }, [signout, navigate]);

  // Throttled scroll handler for better performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNavbar = useCallback((source = 'unknown') => {
    const now = Date.now();
    const elapsed = now - lastToggleTimeRef.current;
    const isCurrentlyOpen = mobileDrawerOpenRef.current;
    // Only apply guard when CLOSING (prevents overlay/close from firing right after open).
    // Never block OPEN so scroll + tap hamburger always works.
    if (isCurrentlyOpen && elapsed < HAMBURGER_GUARD_MS) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/4ed8e0b4-0b62-40c2-b89e-683e2b0cadf2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Navbar.jsx:toggleNavbar',message:'toggle ignored (guard on close)',data:{elapsed,source},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      return;
    }
    lastToggleTimeRef.current = now;
    setMobileDrawerOpen(prev => {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/4ed8e0b4-0b62-40c2-b89e-683e2b0cadf2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Navbar.jsx:toggleNavbar',message:'toggle applied',data:{prev,next:!prev,source},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      return !prev;
    });
  }, []);

  mobileDrawerOpenRef.current = mobileDrawerOpen;

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

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setScrolled(false);
    setMobileDrawerOpen(false);
  }, [navigate]);

  const handleMobileNavClick = useCallback((e, item) => {
    e.preventDefault();
    if (item.label === "Home") {
      handleLogoClick(e);
    } else {
      navigate(item.href);
    }
    setMobileDrawerOpen(false);
  }, [navigate, handleLogoClick]);

  // Prefetch pages on hover for faster navigation - memoized
  const handleNavHover = useCallback((href) => {
    // Prefetch the route component - using absolute paths from src/
    const routeMap = {
      '/': () => import('../pages/HomePage'),
      '/portfolio': () => import('../pages/PortfolioPage'),
      '/services': () => import('../pages/ServicesPage'),
      '/pricing': () => import('../pages/PricingPage'),
      '/about': () => import('../pages/AboutPage'),
      '/blogs': () => import('../pages/BlogPage'),
      '/contact': () => import('../pages/ContactPage'),
    };
    const prefetchFn = routeMap[href];
    if (prefetchFn) {
      prefetchFn();
    }
  }, []);

  // Helper to determine if nav item is active - memoized
  const isActive = useCallback((href) => {
    if (href === "/" && location.pathname === "/") return true;
    return location.pathname === href;
  }, [location.pathname]);

  // Memoize nav items to prevent unnecessary re-renders
  const navItemsList = useMemo(() => navItems, []);

  if (hideNavbar) {
    return null;
  }

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-[60] w-full overflow-visible py-3 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-lg border-b border-neutral-700/80 bg-white/95"
          : "bg-white/90 border-transparent"
      }`}
      style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}
    >
      <div className="max-w-7xl mx-auto px-4 overflow-visible">
        <div className="flex items-center justify-between gap-2 min-h-[44px]">
          {/* Logo Section - min-w-0 so it can shrink and hamburger is never pushed off */}
          <div className="flex items-center min-w-0 flex-1">
            <Link
              to="/"
              onClick={handleLogoClick}
              className="flex items-center"
            >
              <div className="h-14 w-14 mr-3 rounded-full overflow-hidden shadow-lg bg-white flex items-center justify-center">
                <img 
                  src="/logo.png"
                  alt="Ondosoft logo - Full stack software development company specializing in React, Node.js, Python, and SaaS solutions"
                  width={56}
                  height={56}
                  className="h-full w-full rounded-full object-contain"
                  loading="eager"
                  fetchpriority="high"
                  onLoad={() => console.log('Logo loaded successfully')}
                  onError={(e) => {
                    // Fallback if logo doesn't load
                    console.error('Logo failed to load from /logo.png');
                    console.error('Current location:', window.location.href);
                    e.target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'h-full w-full bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg';
                    fallback.textContent = 'O';
                    e.target.parentElement.appendChild(fallback);
                  }}
                />
              </div>
              <span className="text-2xl font-bold text-gray-800 truncate">
                Ondosoft
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <ul className="flex items-center space-x-6">
              {navItemsList.map((item, index) => (
                <li key={item.href || index}>
                  <Link
                    to={item.href}
                    onClick={item.label === "Home" ? handleLogoClick : undefined}
                    onMouseEnter={() => handleNavHover(item.href)}
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
                    to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-md font-semibold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                  >
                    {user?.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
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
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button - flex-shrink-0 so always visible; min touch target 44px */}
          <div className="lg:hidden relative z-10 flex-shrink-0">
            <button 
              type="button"
              onClick={() => toggleNavbar('button')}
              className="text-gray-700 hover:text-orange-500 p-2 rounded-md hover:bg-orange-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-expanded={mobileDrawerOpen}
              aria-label={mobileDrawerOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileDrawerOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation Drawer */}
        {mobileDrawerOpen && (
          <div className="lg:hidden" aria-hidden="false">
            <div 
              className="fixed inset-0 z-[70] bg-black bg-opacity-50" 
              onClick={() => toggleNavbar('overlay')}
              style={{ touchAction: 'none' }}
              aria-hidden="true"
            />
            <div 
              className="fixed top-0 right-0 z-[70] w-80 min-h-screen bg-gradient-to-b from-black to-gray-900 shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto"
              style={{ touchAction: 'pan-y', paddingRight: 'env(safe-area-inset-right)', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="h-12 w-12 mr-3 rounded-full overflow-hidden bg-white flex items-center justify-center">
                      <img 
                        src="/logo.png"
                        alt="Ondosoft logo"
                        width={48}
                        height={48}
                        className="h-full w-full rounded-full object-contain"
                        loading="eager"
                        fetchpriority="high"
                        onError={(e) => {
                          // Fallback if logo doesn't load
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="h-full w-full bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">O</div>';
                        }}
                      />
                    </div>
                    <span className="text-xl font-bold text-white">OndoSoft</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNavbar('drawer-close')}
                    className="text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -m-2"
                    aria-label="Close menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <ul className="space-y-2">
                  {navItemsList.map((item, index) => (
                    <li key={item.href || index}>
                      <Link
                        to={item.href}
                        onClick={e => handleMobileNavClick(e, item)}
                        onMouseEnter={() => handleNavHover(item.href)}
                        className={
                          isActive(item.href)
                            ? "block min-h-[44px] py-3 px-4 rounded-md bg-orange-500 text-white font-semibold flex items-center"
                            : "block min-h-[44px] py-3 px-4 rounded-md text-gray-300 hover:text-orange-400 hover:bg-gray-800/50 transition-all duration-200 font-medium flex items-center"
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
                        to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block w-full min-h-[48px] py-3 px-4 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-center hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center"
                      >
                        {user?.role === 'ADMIN' ? 'Admin' : 'Dashboard'}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full min-h-[48px] py-3 px-4 rounded-md bg-gray-800 text-gray-200 font-semibold text-center hover:bg-gray-700 transition-all duration-200 flex items-center justify-center"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth/signin"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block w-full min-h-[48px] py-3 px-4 rounded-md bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-center hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center"
                    >
                      Dashboard
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

export default memo(Navbar);
