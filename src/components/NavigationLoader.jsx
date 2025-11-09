import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationLoader = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    setIsNavigating(true);
    setLoadingProgress(0);
    
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 50);

    // Complete loading after a short delay
    const completeTimer = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        setIsNavigating(false);
        setLoadingProgress(0);
      }, 200);
    }, 300);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [location.pathname]);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gray-800/50">
      <div 
        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out"
        style={{ 
          width: `${loadingProgress}%`,
          boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)'
        }} 
      />
    </div>
  );
};

export default NavigationLoader;

