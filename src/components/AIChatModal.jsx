import { useEffect, useState, useRef, useCallback, memo } from 'react';
import { X, Send, Loader, Bot, User, Home, RefreshCw, Sparkles, Maximize2, Minimize2, Copy, Check, Trash2 } from 'lucide-react';
import analyticsTracker from '../utils/analytics.js';
import { API_URL } from '../utils/apiConfig.js';
import { companyInfo } from '../constants/companyInfo';
import { useAuth } from '../contexts/AuthContext';
import { formatDateWithWeekdayUser, formatDateTimeUserTimezone } from '../utils/dateFormat.js';
import MessageBubble from './chat/MessageBubble.jsx';
import QuickReplies from './chat/QuickReplies.jsx';
import ChatInput from './chat/ChatInput.jsx';
import TypingIndicator from './chat/TypingIndicator.jsx';
import EmptyState from './chat/EmptyState.jsx';

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
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const isInitializingRef = useRef(false);

  const AI_NAME = 'Arjun';
  const AI_TITLE = 'AI Assistant';

  // Initialize session and conversation
  useEffect(() => {
    if (isOpen && !conversationStarted && !isInitializingRef.current) {
      initializeConversation();
    }
  }, [isOpen, conversationStarted, initializeConversation]);

  // End conversation when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (conversationId) {
        endConversation();
      }
      // Reset initialization flag when modal closes so it can be initialized again
      isInitializingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, conversationId]);

  const endConversation = async () => {
    if (!conversationId) return;
    
    try {
      await fetch(`${API_URL}/ai-chat/conversations/${conversationId}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error ending conversation:', error);
      }
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

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Escape to close modal
      if (e.key === 'Escape' && !isMaximized) {
        onClose();
        return;
      }

      // Don't handle shortcuts if user is typing in input
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
        // Enter to send (handled in form submit)
        // Shift+Enter for newline is default browser behavior
        return;
      }

      // Focus input with Cmd/Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMaximized, onClose]);

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
          const formattedMessages = data.messages.map((msg) => {
            let quickReplies = undefined;
            let buttonClicks = undefined;
            
            if (msg.quick_replies) {
              try {
                quickReplies = JSON.parse(msg.quick_replies);
              } catch (e) {
                if (import.meta.env.DEV) {
                  console.warn('Failed to parse quick_replies:', e);
                }
              }
            }
            
            if (msg.button_clicks) {
              try {
                buttonClicks = JSON.parse(msg.button_clicks);
              } catch (e) {
                if (import.meta.env.DEV) {
                  console.warn('Failed to parse button_clicks:', e);
                }
              }
            }
            
            return {
              id: msg.id,
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.created_at),
              quickReplies,
              buttonClicks,
            };
          });

          setMessages(formattedMessages);
          return true; // History loaded
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error loading conversation history:', error);
      }
    }
    return false; // No history found
  };

  // Create welcome message helper function
  const createWelcomeMessage = useCallback(() => {
    const userName = isAuthenticated && user ? user.name : null;
    const welcomeContent = userName
      ? `Welcome back, ${userName}! 👋\n\nI'm ${AI_NAME}, your ${AI_TITLE}. How can I help you today?`
      : `Welcome to ${companyInfo.name}! 👋\n\nI'm ${AI_NAME}, your ${AI_TITLE}. How can I help you today?`;
    
    return {
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
  }, [isAuthenticated, user, AI_NAME, AI_TITLE]);

  const initializeConversation = useCallback(async () => {
    // Prevent multiple simultaneous initialization calls
    if (isInitializingRef.current) {
      return;
    }
    
    isInitializingRef.current = true;
    
    try {
      const sessionId = analyticsTracker.sessionId || generateSessionId();
      setSessionId(sessionId);

      // Try to load existing conversation history first
      const historyLoaded = await loadConversationHistory(sessionId);
      
      if (historyLoaded) {
        // History loaded, conversation already has messages
        setConversationStarted(true);
        isInitializingRef.current = false;
        return;
      }

      // No history found, prepare welcome message
      const welcomeMessage = createWelcomeMessage();

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
      if (import.meta.env.DEV) {
        console.error('Error initializing conversation:', error);
      }
      // Still show welcome message even if backend fails
      const welcomeMessage = createWelcomeMessage();
      setMessages([welcomeMessage]);
      setConversationStarted(true);
    } finally {
      isInitializingRef.current = false;
    }
  }, [createWelcomeMessage, isAuthenticated, user]);

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
      if (import.meta.env.DEV) {
        console.error('Error saving message:', error);
      }
    }
  };

  /** POST user message and return full response; backend may include assistantReply when AI (OpenAI/Anthropic) is configured. */
  const postUserMessageAndGetReply = async (convId, message) => {
    if (!convId) return null;
    try {
      setError(null);
      const res = await fetch(`${API_URL}/ai-chat/conversations/${convId}/messages`, {
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
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json().catch(() => ({}));
      return data?.assistantReply ? data : null;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error posting user message:', error);
      }
      setError('Failed to send message. Please try again.');
      return null;
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

    setIsLoading(true);
    const apiResponse = conversationId ? await postUserMessageAndGetReply(conversationId, userMessage) : null;
    if (apiResponse?.assistantReply) {
      setMessages((prev) => [
        ...prev,
        {
          id: apiResponse.assistantReply.messageId,
          role: 'assistant',
          content: apiResponse.assistantReply.content,
          quickReplies: apiResponse.assistantReply.quickReplies,
          timestamp: apiResponse.assistantReply.createdAt ? new Date(apiResponse.assistantReply.createdAt) : new Date(),
        },
      ]);
      setIsLoading(false);
    } else {
      await generateAIResponse(userMessage.content);
    }
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
    
    // Refocus input after sending
    setTimeout(() => inputRef.current?.focus(), 50);

    setIsLoading(true);
    const apiResponse = conversationId ? await postUserMessageAndGetReply(conversationId, userMessage) : null;
    if (apiResponse?.assistantReply) {
      setMessages((prev) => [
        ...prev,
        {
          id: apiResponse.assistantReply.messageId,
          role: 'assistant',
          content: apiResponse.assistantReply.content,
          quickReplies: apiResponse.assistantReply.quickReplies,
          timestamp: apiResponse.assistantReply.createdAt ? new Date(apiResponse.assistantReply.createdAt) : new Date(),
        },
      ]);
      setIsLoading(false);
    } else {
      await generateAIResponse(messageText);
    }

    const emailMatch = messageText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch && conversationId) {
      await updateConversationInfo({ email: emailMatch[0] });
    }
  };

  // Copy message to clipboard
  const copyMessage = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Failed to copy message:', err);
      }
    }
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
      if (import.meta.env.DEV) {
        console.error('Error updating conversation info:', error);
      }
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
      if (import.meta.env.DEV) {
        console.error('Error generating AI response:', error);
      }
      setError('Failed to generate response. Please try again.');
      const errorMessage = {
        id: Date.now(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact our support team.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Retry last message
  const retryLastMessage = async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      setError(null);
      setIsLoading(true);
      // Remove error message if exists
      setMessages(prev => prev.filter(m => !m.isError));
      await generateAIResponse(lastUserMessage.content);
    }
  };

  // Clear conversation
  const clearConversation = async () => {
    if (window.confirm('Are you sure you want to clear this conversation? This cannot be undone.')) {
      setMessages([]);
      setError(null);
      // End current conversation if exists
      if (conversationId) {
        await endConversation();
        setConversationId(null);
      }
      // Reset conversation started flag to allow new welcome message
      setConversationStarted(false);
      // Initialize new conversation
      if (isOpen) {
        await initializeConversation();
      }
    }
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-header-title"
        aria-describedby="chat-header-subtitle"
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
              <h3 id="chat-header-title" className="font-semibold flex items-center gap-2">
                {AI_NAME}
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </h3>
              <p id="chat-header-subtitle" className="text-xs text-orange-100">
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

        {/* Timestamp and Actions - Show current time or conversation start time */}
        <div className="px-4 py-2 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {messages.length > 0 && messages[0].timestamp
              ? formatDateWithWeekdayUser(messages[0].timestamp)
              : formatDateWithWeekdayUser(new Date())}
          </p>
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              aria-label="Clear conversation"
              title="Clear conversation"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.length === 0 && <EmptyState aiName={AI_NAME} />}
          {messages.map((message) => (
            <div key={message.id}>
              <MessageBubble
                message={message}
                onCopy={copyMessage}
                copiedMessageId={copiedMessageId}
              />
              {message.quickReplies && message.role === 'assistant' && (
                <QuickReplies
                  quickReplies={message.quickReplies}
                  onQuickReply={handleQuickReply}
                />
              )}
            </div>
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
          {error && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <p className="text-sm text-red-800">{error}</p>
              <div className="flex gap-2">
                {messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
                  <button
                    type="button"
                    onClick={retryLastMessage}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Retry
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs text-red-600 hover:text-red-800"
                  aria-label="Dismiss error"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
          <ChatInput
            ref={inputRef}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder="Type a message... (Shift+Enter for new line)"
          />
          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
            <p className="text-xs text-gray-500">
              This chat may be recorded and used in line with our{' '}
              <a href="/privacy-policy" className="text-orange-600 underline" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </p>
            <p id="input-help-text" className="text-xs text-gray-400">
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Shift+Enter</kbd> for new line
            </p>
          </div>
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

