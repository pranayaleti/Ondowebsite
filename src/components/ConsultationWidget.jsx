import { useState, lazy, Suspense } from 'react';
import { Calendar } from 'lucide-react';

// Lazy load ConsultationModal - only load when opened
const ConsultationModal = lazy(() => import('./ConsultationModal'));

const ConsultationWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Floating Widget */}
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 md:right-24">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          aria-label="Book a free consultation"
        >
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full animate-pulse">
            Free
          </div>
        </button>
        
        {/* Enhanced Tooltip - Hidden on mobile, shown on hover for desktop */}
        <div className="hidden sm:block absolute bottom-full right-0 mb-3 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg pointer-events-none">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Book Free Consultation</span>
          </div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* Modal - Lazy loaded with Suspense */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <ConsultationModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            utmMedium="floating_widget"
          />
        </Suspense>
      )}
    </>
  );
};

export default ConsultationWidget;
