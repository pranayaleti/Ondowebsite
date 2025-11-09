/**
 * Shared Loading Component
 * Single source of truth for loading states across the application
 */

import { Loader } from 'lucide-react';

/**
 * Full-page loading spinner
 * Used for page-level loading states
 */
export const PageLoader = () => (
  <div className="fixed inset-0 z-50 bg-gradient-to-b from-black to-gray-900 flex items-center justify-center backdrop-blur-sm">
    <div className="text-center">
      <div className="relative inline-block">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-orange-500 mx-auto mb-6"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-orange-500/30 animate-pulse"></div>
        </div>
      </div>
      <p className="text-white text-lg font-medium">Loading page...</p>
      <p className="text-gray-400 text-sm mt-2">Please wait</p>
    </div>
  </div>
);

/**
 * Inline loading spinner
 * Used for component-level loading states
 * @param {string} size - Size of the spinner: 'sm', 'md', 'lg'
 * @param {string} className - Additional CSS classes
 */
export const InlineLoader = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader 
      className={`${sizeClasses[size]} animate-spin text-orange-500 ${className}`} 
      aria-label="Loading"
    />
  );
};

/**
 * Full-screen loading with spinner
 * Used for protected routes and authentication states
 */
export const FullScreenLoader = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <Loader className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
      <p className="text-white">{message}</p>
    </div>
  </div>
);

/**
 * Button loading spinner
 * Used inside buttons during async operations
 */
export const ButtonLoader = () => (
  <Loader className="w-4 h-4 animate-spin text-current" />
);

export default PageLoader;

