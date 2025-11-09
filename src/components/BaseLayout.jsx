import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, Menu, X } from 'lucide-react';

/**
 * BaseLayout - Shared layout component for Admin and Portal layouts
 * Single source of truth for sidebar navigation logic
 * @param {Object} props
 * @param {string} props.title - Layout title (e.g., "Admin Panel" or "Portal")
 * @param {Array} props.navItems - Array of navigation items with { path, label, icon }
 */
const BaseLayout = ({ title, navItems }) => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signout();
    navigate('/auth/signin');
  };

  const isActive = (path) => {
    const basePath = path.split('/').slice(0, 2).join('/'); // Get /admin or /portal
    if (path === basePath) {
      return location.pathname === basePath;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed h-screen left-0 z-40 w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 transform transition-transform duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="flex flex-col h-full p-6 overflow-hidden">
            <div className="mb-6 flex-shrink-0 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">{title}</h1>
                <p className="text-xs text-gray-400">Welcome, <span className="text-orange-400">{user?.name}</span></p>
              </div>
              {/* Close button for mobile */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-2 -mt-1 -mr-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors touch-manipulation ml-auto"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto min-h-0 pr-2 -mr-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      isActive(item.path)
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-1.5 pt-4 border-t border-gray-800 flex-shrink-0">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
              >
                <Home className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Back to Home</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          {/* Hamburger menu button for mobile - only show when sidebar is closed */}
          {!mobileMenuOpen && (
            <div className="lg:hidden fixed top-4 left-4 z-50">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-3 bg-gray-800/90 backdrop-blur-sm rounded-lg text-white hover:bg-gray-700 border border-gray-700 shadow-lg transition-all touch-manipulation"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          )}
          <div className="p-6 lg:p-8 pt-20 lg:pt-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default BaseLayout;

