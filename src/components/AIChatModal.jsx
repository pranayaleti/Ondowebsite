import { useEffect, useState, useRef } from 'react';
import { X, Send, Loader, Bot, User, Home, ThumbsUp, ThumbsDown, RefreshCw, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import analyticsTracker from '../utils/analytics';
import { API_URL } from '../utils/apiConfig';
import { companyInfo } from '../constants/companyInfo';
import { useAuth } from '../contexts/AuthContext';

const AIChatModal = ({ isOpen, onClose, position = 'center' }) => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [modalSize, setModalSize] = useState({ width: 400, height: 600 });
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const resizeHandleRef = useRef(null);

  const AI_NAME = 'Arjun';
  const AI_TITLE = 'AI Assistant';

  // Initialize session and conversation
  useEffect(() => {
    if (isOpen && !conversationStarted) {
      initializeConversation();
    }
  }, [isOpen, conversationStarted]);

  // End conversation when modal closes
  useEffect(() => {
    if (!isOpen && conversationId) {
      endConversation();
    }
  }, [isOpen]);

  const endConversation = async () => {
    if (!conversationId) return;
    
    try {
      await fetch(`${API_URL}/ai-chat/conversations/${conversationId}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversationHistory = async (sessionId) => {
    try {
      const response = await fetch(`${API_URL}/ai-chat/conversations/session/${sessionId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.conversation && data.messages && data.messages.length > 0) {
          // Load existing conversation
          setConversationId(data.conversation.id);
          
          // Convert database messages to chat format
          const formattedMessages = data.messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.created_at),
            quickReplies: msg.quick_replies ? JSON.parse(msg.quick_replies) : undefined,
            buttonClicks: msg.button_clicks ? JSON.parse(msg.button_clicks) : undefined,
          }));

          setMessages(formattedMessages);
          return true; // History loaded
        }
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
    return false; // No history found
  };

  const initializeConversation = async () => {
    try {
      const sessionId = analyticsTracker.sessionId || generateSessionId();
      setSessionId(sessionId);

      // Try to load existing conversation history first
      const historyLoaded = await loadConversationHistory(sessionId);
      
      if (historyLoaded) {
        // History loaded, conversation already has messages
        setConversationStarted(true);
        return;
      }

      // No history found, prepare welcome message
      const userName = isAuthenticated && user ? user.name : null;
      const welcomeContent = userName
        ? `Welcome back, ${userName}! 👋\n\nI'm ${AI_NAME}, your ${AI_TITLE}. How can I help you today?`
        : `Welcome to ${companyInfo.name}! 👋\n\nI'm ${AI_NAME}, your ${AI_TITLE}. How can I help you today?`;
      
      const welcomeMessage = {
        id: Date.now(),
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date(),
        quickReplies: [
          { label: 'Get a Quote', value: 'pricing' },
          { label: 'See Our Work', value: 'portfolio' },
          { label: 'Schedule a Call', value: 'schedule_call' },
          { label: 'Learn More', value: 'services' },
        ],
      };

      // Show welcome message immediately
      setMessages([welcomeMessage]);

      // Get user info from analytics
      const userInfo = {
        sessionId,
        pageUrl: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      };

      // Add logged-in user information if available
      if (isAuthenticated && user) {
        userInfo.userId = user.id;
        userInfo.email = user.email;
        userInfo.name = user.name;
        if (user.company) userInfo.company = user.company;
        if (user.phone) userInfo.phone = user.phone;
      }

      // Extract UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      userInfo.utmSource = urlParams.get('utm_source');
      userInfo.utmMedium = urlParams.get('utm_medium');
      userInfo.utmCampaign = urlParams.get('utm_campaign');
      userInfo.utmContent = urlParams.get('utm_content');

      // Create new conversation
      const response = await fetch(`${API_URL}/ai-chat/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userInfo),
      });

      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversationId);
        setConversationStarted(true);
        
        // Update conversation with user info if logged in
        if (isAuthenticated && user && data.conversationId) {
          await updateConversationInfo({
            userId: user.id,
            email: user.email,
            name: user.name,
            ...(user.company && { company: user.company }),
            ...(user.phone && { phone: user.phone }),
          });
        }

        // Show and save welcome message
        setMessages([welcomeMessage]);
        await saveMessage(data.conversationId, welcomeMessage);
      } else {
        // Even if backend fails, show welcome message
        setMessages([welcomeMessage]);
        setConversationStarted(true);
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
      // Still show welcome message even if backend fails
      const userName = isAuthenticated && user ? user.name : null;
      const welcomeContent = userName
        ? `Welcome back, ${userName}! 👋\n\nI'm ${AI_NAME}, your ${AI_TITLE}. How can I help you today?`
        : `Welcome to ${companyInfo.name}! 👋\n\nI'm ${AI_NAME}, your ${AI_TITLE}. How can I help you today?`;
      
      const welcomeMessage = {
        id: Date.now(),
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date(),
        quickReplies: [
          { label: 'Get a Quote', value: 'pricing' },
          { label: 'See Our Work', value: 'portfolio' },
          { label: 'Schedule a Call', value: 'schedule_call' },
          { label: 'Learn More', value: 'services' },
        ],
      };
      setMessages([welcomeMessage]);
      setConversationStarted(true);
    }
  };

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const saveMessage = async (convId, message) => {
    if (!convId) return;

    try {
      await fetch(`${API_URL}/ai-chat/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          role: message.role,
          content: message.content,
          messageType: message.messageType || 'text',
          quickReplies: message.quickReplies,
          buttonClicks: message.buttonClicks,
          metadata: message.metadata,
        }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleQuickReply = async (value) => {
    const quickReplyMessages = {
      pricing: 'I need a quote',
      portfolio: 'Show me your work',
      schedule_call: 'Schedule a call',
      services: 'What services do you offer?',
      get_started: 'How do I get started?',
      contact: 'Contact information',
      share_email: 'I want to share my email',
      project_info: 'Tell you about my project',
      view_pricing: 'View pricing plans',
      schedule_demo: 'Schedule a demo',
      contact_sales: 'Contact sales',
      web_dev: 'Web development',
      seo_services: 'SEO services',
      content_marketing: 'Content marketing',
      view_website: 'View website',
      testimonials: 'Show testimonials',
      about: 'Tell me about Ondosoft',
    };

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: quickReplyMessages[value] || value,
      timestamp: new Date(),
      buttonClicks: [{ button: value, timestamp: new Date() }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    if (conversationId) {
      await saveMessage(conversationId, userMessage);
    }

    await generateAIResponse(userMessage.content);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    if (conversationId) {
      await saveMessage(conversationId, userMessage);
      
      // Check if message contains email and update conversation
      const emailMatch = messageText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
      if (emailMatch && conversationId) {
        await updateConversationInfo({ email: emailMatch[0] });
      }
    }

    await generateAIResponse(messageText);
  };

  const updateConversationInfo = async (info) => {
    if (!conversationId) return;
    
    try {
      await fetch(`${API_URL}/ai-chat/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(info),
      });
    } catch (error) {
      console.error('Error updating conversation info:', error);
    }
  };

  const generateAIResponse = async (userInput) => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      // Simulate AI response (replace with actual AI API call)
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 800));

      // Generate contextual response based on user input
      const lowerInput = userInput.toLowerCase();
      let response = '';
      let quickReplies = [];

      // Check if user shared an email address
      const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      const emailMatch = userInput.match(emailPattern);
      
      if (emailMatch) {
        const email = emailMatch[0];
        response = `Perfect! We've received your email (${email}). Our team will reach out to you shortly - we're looking forward to connecting with you! 🎉\n\nIn the meantime, feel free to explore our work or let me know if you have any questions.`;
        quickReplies = [
          { label: 'See Our Work', value: 'portfolio' },
          { label: 'Schedule a Call', value: 'schedule_call' },
          { label: 'Learn About Services', value: 'services' },
        ];
      } else if (lowerInput.includes('pricing') || lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('how much') || lowerInput.includes('quote')) {
        response = `Our pricing is customized based on your project needs. To get an accurate quote, I'll need a few details:\n\n• What type of project are you looking for?\n• What's your timeline?\n• What's your budget range?\n\nWould you like to share these details or schedule a call with our team?`;
        quickReplies = [
          { label: 'Schedule a Call', value: 'schedule_call' },
          { label: 'Share My Email', value: 'share_email' },
          { label: 'Tell You About My Project', value: 'project_info' },
        ];
      } else if (lowerInput.includes('service') || lowerInput.includes('what do you do') || lowerInput.includes('what can you do') || lowerInput.includes('offer')) {
        response = `We specialize in:\n\n• Web Development & Design\n• SEO & Digital Marketing\n• Custom Software Solutions\n• SaaS Development\n\nWhat do you need help with? I can connect you with the right team member.`;
        quickReplies = [
          { label: 'Get a Quote', value: 'pricing' },
          { label: 'See Examples', value: 'portfolio' },
          { label: 'Schedule a Call', value: 'schedule_call' },
        ];
      } else if (lowerInput.includes('start') || lowerInput.includes('get started') || lowerInput.includes('begin') || lowerInput.includes('project_info')) {
        response = `Great! To get started, I need:\n\n• Your email address\n• Brief description of your project\n• Your timeline\n\nShare your email and I'll have our team reach out within 24 hours.`;
        quickReplies = [
          { label: 'Share My Email', value: 'share_email' },
          { label: 'Schedule a Call', value: 'schedule_call' },
        ];
      } else if (lowerInput.includes('contact') || lowerInput.includes('phone') || lowerInput.includes('reach')) {
        response = `Contact us:\n\n📧 ${companyInfo.email}\n📞 ${companyInfo.phoneDisplay}\n\nWould you like to schedule a call or share your email for a callback?`;
        quickReplies = [
          { label: 'Schedule a Call', value: 'schedule_call' },
          { label: 'Share My Email', value: 'share_email' },
        ];
      } else if (lowerInput.includes('about') || lowerInput.includes('who are you') || lowerInput.includes('company')) {
        response = `We're a full-stack software development company specializing in custom web applications, SaaS solutions, and digital marketing.\n\nBased in ${companyInfo.location.full}, serving clients nationwide.\n\nWould you like to see our work or get a quote?`;
        quickReplies = [
          { label: 'See Our Work', value: 'portfolio' },
          { label: 'Get a Quote', value: 'pricing' },
          { label: 'Schedule a Call', value: 'schedule_call' },
        ];
      } else if (lowerInput.includes('portfolio') || lowerInput.includes('work') || lowerInput.includes('examples') || lowerInput.includes('projects') || lowerInput.includes('link')) {
        const portfolioUrl = `${companyInfo.urls.website}/portfolio`;
        response = `We've built:\n\n• E-commerce platforms\n• SaaS applications\n• Custom web apps\n• Digital marketing campaigns\n\n📁 View our portfolio:\n${portfolioUrl}\n\nThis showcases our best work across different industries and project types. Ready to start your project?`;
        quickReplies = [
          { label: 'Get a Quote', value: 'pricing' },
          { label: 'Schedule a Call', value: 'schedule_call' },
          { label: 'Share My Email', value: 'share_email' },
        ];
      } else if (lowerInput.includes('testimonial') || lowerInput.includes('review') || lowerInput.includes('client')) {
        const testimonialsUrl = `${companyInfo.urls.website}/testimonials`;
        response = `We have a ${companyInfo.ratings.display} rating with ${companyInfo.ratings.reviewCount}+ satisfied clients.\n\n⭐ See testimonials:\n${testimonialsUrl}\n\nReady to become our next success story?`;
        quickReplies = [
          { label: 'Get a Quote', value: 'pricing' },
          { label: 'Schedule a Call', value: 'schedule_call' },
        ];
      } else if (lowerInput.includes('email') && !lowerInput.includes('contact') || lowerInput.includes('share_email')) {
        // Check if user is expressing intent to share email
        if (lowerInput.includes('want to share') || lowerInput.includes('share my email') || lowerInput.includes('here is my email') || lowerInput.includes('my email is')) {
          response = `Great! Please go ahead and share your email address, and we'll reach out to you soon. We're looking forward to talking with you! 😊`;
        } else {
          response = `Please share your email address and I'll have our team reach out within 24 hours. We're looking forward to connecting with you!`;
        }
        quickReplies = [
          { label: 'Schedule a Call Instead', value: 'schedule_call' },
        ];
      } else if (lowerInput.includes('schedule') || lowerInput.includes('call') || lowerInput.includes('demo') || lowerInput.includes('meeting')) {
        const websiteUrl = companyInfo.urls.website;
        response = `I can help you schedule a call with our team. Please share:\n\n• Your email address\n• Preferred date/time\n• Brief description of what you'd like to discuss\n\n🌐 Or visit our website to book directly:\n${websiteUrl}`;
        quickReplies = [
          { label: 'Share My Email', value: 'share_email' },
          { label: 'Get a Quote', value: 'pricing' },
        ];
      } else {
        response = `I can help you with:\n\n• Getting a quote\n• Seeing our work\n• Scheduling a call\n• Learning about our services\n\nWhat would you like to do?`;
        quickReplies = [
          { label: 'Get a Quote', value: 'pricing' },
          { label: 'See Our Work', value: 'portfolio' },
          { label: 'Schedule a Call', value: 'schedule_call' },
        ];
      }

      const responseTime = Date.now() - startTime;

      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
        metadata: { responseTime },
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (conversationId) {
        await saveMessage(conversationId, aiMessage);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage = {
        id: Date.now(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact our support team.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId, feedback) => {
    if (!conversationId) return;

    try {
      // Find the message to get its content
      const message = messages.find(m => m.id === messageId);
      
      await fetch(`${API_URL}/ai-chat/conversations/${conversationId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          messageId,
          feedback,
          messageContent: message?.content || '',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  const formatTime = (timestamp) => {
    // Display in user's local timezone
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Render message content with clickable links
  const renderMessageWithLinks = (content) => {
    if (!content) return '';
    
    // URL regex pattern
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlPattern);
    
    return parts.map((part, index) => {
      if (urlPattern.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:text-orange-700 underline font-medium break-all"
            onClick={() => {
              // Track link clicks in analytics
              if (conversationId) {
                fetch(`${API_URL}/ai-chat/conversations/${conversationId}/feedback`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    eventType: 'link_click',
                    linkUrl: part,
                    timestamp: new Date().toISOString(),
                  }),
                }).catch(err => console.error('Error tracking link click:', err));
              }
            }}
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Handle maximize/minimize
  const handleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false);
      setModalSize({ width: 400, height: 600 });
      setModalPosition({ x: 0, y: 0 });
    } else {
      setIsMaximized(true);
      setModalSize({ width: window.innerWidth, height: window.innerHeight });
      setModalPosition({ x: 0, y: 0 });
    }
  };

  // Handle resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      if (isMaximized) return;
      
      const rect = modalRef.current?.getBoundingClientRect();
      if (!rect) return;

      const newWidth = Math.max(300, Math.min(window.innerWidth - 32, e.clientX - rect.left));
      const newHeight = Math.max(400, Math.min(window.innerHeight - 32, e.clientY - rect.top));
      
      setModalSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isMaximized]);

  // Handle drag
  useEffect(() => {
    if (!isDragging || isMaximized) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setModalPosition({
        x: modalPosition.x + deltaX,
        y: modalPosition.y + deltaY,
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMaximized, dragStart, modalPosition]);

  const handleDragStart = (e) => {
    if (isMaximized) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMaximized) return;
    setIsResizing(true);
  };

  if (!isOpen) return null;

  // Position classes based on position prop and maximize state
  const containerClasses = isMaximized
    ? 'fixed inset-0 z-50'
    : position === 'bottom-right'
    ? 'fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 animate-slide-up'
    : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';

  const modalStyle = isMaximized
    ? { width: '100%', height: '100%' }
    : {
        width: `${modalSize.width}px`,
        height: `${modalSize.height}px`,
        transform: modalPosition.x !== 0 || modalPosition.y !== 0
          ? `translate(${modalPosition.x}px, ${modalPosition.y}px)`
          : undefined,
      };

  const modalClasses = isMaximized
    ? 'bg-white shadow-2xl flex flex-col overflow-hidden h-full w-full'
    : 'bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden';

  return (
    <div className={containerClasses}>
      {position === 'center' && !isMaximized && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" onClick={onClose}></div>
      )}
      <div
        ref={modalRef}
        className={modalClasses}
        style={modalStyle}
      >
        {/* Header - Draggable */}
        <div
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 flex items-center justify-between cursor-move select-none"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {AI_NAME}
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </h3>
              <p className="text-xs text-orange-100">
                {AI_TITLE} • {companyInfo.name}
                {isAuthenticated && user && (
                  <span className="ml-2">• {user.name}</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMaximize}
              className="text-white hover:bg-white/20 rounded p-1 transition-colors"
              aria-label={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Timestamp - Show current time or conversation start time */}
        <div className="px-4 py-2 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            {messages.length > 0 && messages[0].timestamp
              ? new Date(messages[0].timestamp).toLocaleString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
              : new Date().toLocaleString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
          </p>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {renderMessageWithLinks(message.content)}
                </div>
                {message.quickReplies && message.role === 'assistant' && (
                  <div className="mt-3 space-y-2">
                    {message.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickReply(reply.value)}
                        className="block w-full text-left px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                      >
                        {reply.label}
                      </button>
                    ))}
                  </div>
                )}
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleFeedback(message.id, 'positive')}
                      className="text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded p-1 transition-all"
                      aria-label="Helpful"
                      title="This was helpful"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'negative')}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded p-1 transition-all"
                      aria-label="Not helpful"
                      title="This was not helpful"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="text-xs mt-1 opacity-70">
                  {formatTime(message.timestamp)}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                <Loader className="w-5 h-5 animate-spin text-orange-600" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Enter a message"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            This chat may be recorded and used in line with our{' '}
            <a href="/privacy-policy" className="text-orange-600 underline" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </p>
        </form>
        
        {/* Resize Handle */}
        {!isMaximized && (
          <div
            ref={resizeHandleRef}
            onMouseDown={handleResizeStart}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-orange-600/20 hover:bg-orange-600/40 transition-colors"
            style={{
              clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AIChatModal;

