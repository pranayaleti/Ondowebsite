import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  CreditCard, 
  Megaphone, 
  FolderOpen, 
  FileText, 
  LogOut, 
  Home,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';

const PortalLayout = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signout();
    navigate('/auth/signin');
  };

  const navItems = [
    { path: '/portal', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/portal/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { path: '/portal/campaigns', label: 'Campaigns', icon: Megaphone },
    { path: '/portal/assets', label: 'Assets', icon: FolderOpen },
    { path: '/portal/invoices', label: 'Invoices', icon: FileText },
    { path: '/portal/tickets', label: 'Tickets', icon: MessageSquare },
  ];

  const isActive = (path) => {
    if (path === '/portal') {
      return location.pathname === '/portal';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="flex flex-col h-full p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Portal</h1>
              <p className="text-sm text-gray-400">Welcome, {user?.name}</p>
            </div>

            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-2 pt-4 border-t border-gray-800">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-6 lg:p-8">
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

export default PortalLayout;

