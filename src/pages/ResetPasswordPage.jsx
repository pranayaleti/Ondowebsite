import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { API_BASE } from '../utils/apiConfig';
import SEOHead from '../components/SEOHead';
import { Lock, Loader, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { companyInfo } from '../constants/companyInfo';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    if (!token) {
      setValidatingToken(false);
      setTokenValid(false);
      setError('Invalid reset link. Please request a new password reset.');
    } else {
      // Token is present, assume it's valid (backend will validate on submit)
      setValidatingToken(false);
      setTokenValid(true);
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reset password');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/signin');
      }, 3000);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <>
        <SEOHead title="Reset Password" />
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-400">Validating reset link...</p>
          </div>
        </div>
      </>
    );
  }

  if (!tokenValid) {
    return (
      <>
        <SEOHead title="Reset Password" />
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="text-center mb-6">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">Invalid Reset Link</h1>
              <p className="text-gray-400 mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link
                to="/auth/signin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <SEOHead title="Password Reset Successful" />
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">Password Reset Successful!</h1>
              <p className="text-gray-400 mb-6">
                Your password has been reset successfully. You will be redirected to the sign-in page shortly.
              </p>
              <Link
                to="/auth/signin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Reset Password" />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Reset Your Password</h1>
            <p className="text-gray-400">Enter your new password below</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/auth/signin"
              className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;

