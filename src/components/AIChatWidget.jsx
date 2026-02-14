import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { MessageCircle } from 'lucide-react';

// Lazy load components - only load when opened
const AIChatModal = lazy(() => import('./AIChatModal'));
const AIChatPrompt = lazy(() => import('./AIChatPrompt'));

const AIChatWidget = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [hasShownAutoPrompt, setHasShownAutoPrompt] = useState(false);
  const autoPromptTimerRef = useRef(null);
  const dismissedRef = useRef(false);

  // Auto-show prompt after 10 seconds
  useEffect(() => {
    // Check if user has already dismissed or interacted
    const dismissed = localStorage.getItem('ai_chat_prompt_dismissed');
    const hasInteracted = localStorage.getItem('ai_chat_interacted');
    
    if (dismissed === 'true' || hasInteracted === 'true') {
      dismissedRef.current = true;
      return;
    }

    // Show prompt after 10 seconds
    autoPromptTimerRef.current = setTimeout(() => {
      if (!showPrompt && !showChat && !dismissedRef.current) {
        setShowPrompt(true);
        setHasShownAutoPrompt(true);
      }
    }, 10000); // 10 seconds

    // Cleanup on unmount
    return () => {
      if (autoPromptTimerRef.current) {
        clearTimeout(autoPromptTimerRef.current);
      }
    };
  }, [showPrompt, showChat]);

  const handleOpen = () => {
    // Clear auto-prompt timer if user manually opens
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
    setShowPrompt(false);
    const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '') || '/';
    window.location.href = `${base}/contact#book`;
  };

  const handleClose = () => {
    // Mark as dismissed if it was auto-shown
    if (hasShownAutoPrompt) {
      localStorage.setItem('ai_chat_prompt_dismissed', 'true');
    }
    setShowPrompt(false);
    setShowChat(false);
  };

  return (
    <>
      {/* Floating Widget */}
      <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
        <button
          onClick={handleOpen}
          className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          aria-label="Chat with Arjun AI Assistant"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-orange-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full animate-pulse">
            AI
          </div>
        </button>
        
        {/* Enhanced Tooltip - Hidden on mobile, shown on hover for desktop */}
        <div className="hidden sm:block absolute bottom-full left-0 mb-3 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg pointer-events-none">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Chat with Arjun</span>
          </div>
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* Initial Prompt - Lazy loaded with Suspense */}
      {showPrompt && (
        <Suspense fallback={null}>
          <AIChatPrompt 
            onStartChat={handleStartChat}
            onScheduleMeeting={handleScheduleMeeting}
            onClose={handleClose}
          />
        </Suspense>
      )}

      {/* Chat Modal - Lazy loaded with Suspense */}
      {showChat && (
        <Suspense fallback={null}>
          <AIChatModal 
            isOpen={showChat} 
            onClose={handleClose} 
          />
        </Suspense>
      )}
    </>
  );
};

export default AIChatWidget;

