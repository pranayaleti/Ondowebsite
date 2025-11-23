import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { MessageCircle, Calendar, X } from 'lucide-react';
import { companyInfo } from '../constants/companyInfo';

// Lazy load components
const AIChatModal = lazy(() => import('./AIChatModal'));
const ConsultationModal = lazy(() => import('./ConsultationModal'));

const UnifiedChatWidget = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [hasShownAutoPrompt, setHasShownAutoPrompt] = useState(false);
  const autoPromptTimerRef = useRef(null);
  const dismissedRef = useRef(false);

  // Auto-show prompt after 120 seconds
  useEffect(() => {
    const dismissed = localStorage.getItem('ai_chat_prompt_dismissed');
    const hasInteracted = localStorage.getItem('ai_chat_interacted');
    
    if (dismissed === 'true' || hasInteracted === 'true') {
      dismissedRef.current = true;
      return;
    }

    autoPromptTimerRef.current = setTimeout(() => {
      if (!showPrompt && !showChat && !showConsultation && !dismissedRef.current) {
        setShowPrompt(true);
        setHasShownAutoPrompt(true);
      }
    }, 120000); // 120 seconds

    return () => {
      if (autoPromptTimerRef.current) {
        clearTimeout(autoPromptTimerRef.current);
      }
    };
  }, [showPrompt, showChat, showConsultation]);

  const handleOpen = () => {
    if (autoPromptTimerRef.current) {
      clearTimeout(autoPromptTimerRef.current);
    }
    setShowPrompt(true);
  };

  const handleStartChat = () => {
    localStorage.setItem('ai_chat_interacted', 'true');
    setShowPrompt(false);
    setShowChat(true);
  };

  const handleScheduleMeeting = () => {
    localStorage.setItem('ai_chat_interacted', 'true');
    // Option 1: Open Calendly directly
    // window.open(companyInfo.calendlyUrl || 'https://calendly.com/scheduleondo', '_blank');
    // Option 2: Open consultation form
    setShowPrompt(false);
    setShowConsultation(true);
  };

  const handleOpenConsultation = () => {
    setShowPrompt(false);
    setShowConsultation(true);
  };

  const handleClose = () => {
    if (hasShownAutoPrompt) {
      localStorage.setItem('ai_chat_prompt_dismissed', 'true');
    }
    setShowPrompt(false);
    setShowChat(false);
    setShowConsultation(false);
  };

  return (
    <>
      {/* Floating Widget - Right Side */}
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
        <button
          onClick={handleOpen}
          className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          aria-label="Chat with Arjun AI Assistant"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full animate-pulse">
            AI
          </div>
        </button>
        
        {/* Tooltip */}
        <div className="hidden sm:block absolute bottom-full right-0 mb-3 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg pointer-events-none">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Chat with Arjun</span>
          </div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* Initial Prompt - Bottom Right Panel */}
      {showPrompt && (
        <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 w-full max-w-sm animate-slide-up">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white/80 rounded-full p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Section - Dark Orange/Black */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 pb-3">
              {/* Title */}
              <h2 className="text-xl font-bold mb-1">
                👋 Have questions?
              </h2>

              {/* Subtitle */}
              <p className="text-orange-100 text-xs">
                Chat with our AI or schedule a meeting.
              </p>
            </div>

            {/* Body Section - Light Orange/White */}
            <div className="bg-white p-4 space-y-2">
              {/* Buttons */}
              <button
                onClick={handleScheduleMeeting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
              >
                <Calendar className="w-4 h-4" />
                Schedule a meeting
              </button>

              <button
                onClick={handleStartChat}
                className="w-full bg-orange-500/90 hover:bg-orange-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
              >
                <span>✨</span>
                Chat with AI Agent
              </button>

              {/* Privacy Policy Link */}
              <p className="text-xs text-gray-400 text-center mt-2">
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 underline hover:text-orange-700"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal - Bottom Right Panel */}
      {showChat && (
        <Suspense fallback={null}>
          <AIChatModal 
            isOpen={showChat} 
            onClose={handleClose} 
            position="bottom-right"
          />
        </Suspense>
      )}

      {/* Consultation Modal */}
      {showConsultation && (
        <Suspense fallback={null}>
          <ConsultationModal 
            isOpen={showConsultation} 
            onClose={handleClose}
            utmMedium="unified_widget"
          />
        </Suspense>
      )}
    </>
  );
};

export default UnifiedChatWidget;

