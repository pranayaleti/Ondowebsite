import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SEOHead from '../components/SEOHead';
import { Mail, Lock, ArrowRight, Loader, CheckCircle } from 'lucide-react';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signin, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registered = searchParams.get('registered');

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      // Google OAuth implementation
      // For now, this is a placeholder - you'll need to integrate with Google OAuth
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/google`;
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await signin(formData.email, formData.password);
      // Navigation will happen via useEffect when isAuthenticated changes
    } catch (err) {
      setError(err.message || 'Access failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Client Portal - OndoSoft"
        description="Access your client portal to manage your campaigns"
      />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-gray-400">Access your client portal</p>
            </div>

            {/* Demo Credentials for Testing */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
              <p className="text-blue-400 text-sm font-semibold mb-2">Demo Credentials (for testing):</p>
              <div className="text-xs text-gray-400 space-y-1 font-mono">
                <p>Client: client@ondosoft.com / client123</p>
                <p>Admin: admin@ondosoft.com / admin123</p>
              </div>
            </div>

            {registered && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Account created successfully! Please access your client portal.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Accessing Portal...
                  </>
                ) : (
                  <>
                    Access Client Portal
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800/50 text-gray-400">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="mt-4 w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-orange-500 hover:text-orange-400 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="text-gray-400 hover:text-white text-sm">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignInPage;

