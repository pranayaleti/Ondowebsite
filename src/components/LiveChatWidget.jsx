import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Phone, Mail, Clock, CheckCircle, Star, Zap, Users, DollarSign, Calendar, FileText, ExternalLink, Minimize2, Maximize2 } from 'lucide-react';

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm here to help with your software development needs. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [chatRating, setChatRating] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    "Start a free consultation",
    "Schedule consultation", 
    "View our services",
    "Talk to sales"
  ];

  const quickActions = [
    {
      icon: DollarSign,
      title: "Start Free Consultation",
      description: "Instant project guidance",
      action: "quote",
      color: "bg-green-500"
    },
    {
      icon: Calendar,
      title: "Book Consultation",
      description: "Free 30-min strategy call",
      action: "consultation",
      color: "bg-blue-500"
    },
    {
      icon: FileText,
      title: "View Portfolio",
      description: "See our recent projects",
      action: "portfolio",
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Meet the Team",
      description: "Learn about our developers",
      action: "team",
      color: "bg-orange-500"
    }
  ];

  const pricingCards = [
    {
      title: "Starter Website",
      price: "$1,200",
      features: ["3-5 pages", "Mobile responsive", "Basic SEO"],
      popular: false
    },
    {
      title: "Business Website", 
      price: "$2,500",
      features: ["5-10 pages", "Advanced SEO", "CMS included"],
      popular: true
    },
    {
      title: "Custom Web App",
      price: "$4,500",
      features: ["User authentication", "Admin dashboard", "Database"],
      popular: false
    }
  ];

  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    setShowQuickActions(false);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    let message = '';
    let response = '';
    
    switch(action) {
      case 'quote':
        message = 'I\'d like to get a quote for my project';
        response = 'Great! I\'d love to help you get a quote. Our projects typically range from $1,200 for starter websites to $25,000+ for enterprise SaaS platforms. Let me connect you with our team for a detailed estimate.';
        break;
      case 'consultation':
        message = 'I\'d like to schedule a consultation';
        response = 'Perfect! I can help you schedule a free 30-minute consultation with our team. We\'ll discuss your project requirements and provide expert recommendations. Would you like to book a time that works for you?';
        break;
      case 'portfolio':
        message = 'Can I see your portfolio?';
        response = 'Absolutely! You can view our portfolio at /portfolio or I can send you specific examples based on your industry. What type of project are you working on?';
        break;
      case 'team':
        message = 'Tell me about your team';
        response = 'Our team consists of experienced full-stack developers, UI/UX designers, and DevOps engineers. We specialize in React, Node.js, Python, and cloud technologies. You can learn more about us at /about.';
        break;
    }

    if (message) {
      handleSendMessage(message);
    }
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('quote') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "I'd be happy to help you get a quote! Our projects typically range from $1,200 for starter websites to $25,000+ for enterprise SaaS platforms. Would you like me to connect you with our team for a detailed estimate?";
    }
    
    if (lowerMessage.includes('consultation') || lowerMessage.includes('meeting') || lowerMessage.includes('call')) {
      return "Perfect! I can help you schedule a free 30-minute consultation with our team. We'll discuss your project requirements and provide expert recommendations. Would you like to book a time that works for you?";
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
      return "We specialize in full-stack software development including:\n• Custom web applications\n• SaaS platforms\n• Mobile apps\n• E-commerce solutions\n• Technical consulting\n\nWhat type of project are you working on?";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 Welcome to Ondosoft! I'm here to help you with any questions about our software development services. What brings you here today?";
    }
    
    return "Thanks for your message! I'd love to connect you with our team for a more detailed discussion. Would you like to schedule a free consultation or get a project quote?";
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRating = (rating) => {
    setChatRating(rating);
    const ratingMessage = {
      id: Date.now(),
      text: `Thank you for the ${rating}-star rating! We appreciate your feedback.`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, ratingMessage]);
  };

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    setShowUserForm(false);
    const welcomeMessage = {
      id: Date.now(),
      text: `Nice to meet you, ${userInfo.name}! I'll make sure to connect you with the right person for your ${userInfo.company} project.`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, welcomeMessage]);
  };

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            <button
              onClick={() => setIsOpen(true)}
              className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
              aria-label="Open live chat"
            >
              <MessageCircle className="h-6 w-6 relative z-10" />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse font-semibold">
                Live
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            {/* Enhanced Tooltip */}
            <div className="absolute bottom-full right-0 mb-3 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Chat with us!</span>
              </div>
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>

            {/* Floating notification */}
            <div className="absolute -top-1 -left-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
              New
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'h-16' : isExpanded ? 'h-[600px]' : 'h-96'
        }`}>
          <div className={`bg-white rounded-2xl shadow-2xl ${isExpanded ? 'w-96' : 'w-80'} h-full flex flex-col overflow-hidden`}>
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg">Ondosoft Support</h3>
                    <p className="text-orange-100 text-sm flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {isOnline ? 'Online now' : 'Away - we\'ll respond soon'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-orange-100 hover:text-white transition-colors p-1 rounded"
                    title={isExpanded ? 'Minimize' : 'Expand'}
                  >
                    {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-orange-100 hover:text-white transition-colors p-1 rounded"
                    title="Minimize"
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-orange-100 hover:text-white transition-colors p-1 rounded"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Quick Actions */}
                {showQuickActions && messages.length <= 1 && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">How can we help you today?</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(action.action)}
                          className={`${action.color} text-white p-3 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 text-left`}
                        >
                          <div className="flex items-center space-x-2">
                            <action.icon className="h-4 w-4" />
                            <div>
                              <div className="text-xs font-semibold">{action.title}</div>
                              <div className="text-xs opacity-90">{action.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Info Form */}
                {showUserForm && (
                  <div className="p-4 bg-gray-50 border-b">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Tell us about yourself</h4>
                    <form onSubmit={handleUserInfoSubmit} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Company name"
                        value={userInfo.company}
                        onChange={(e) => setUserInfo({...userInfo, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold"
                      >
                        Continue Chat
                      </button>
                    </form>
                  </div>
                )}

                {/* Messages */}
                <div 
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                  style={{ maxHeight: isExpanded ? '400px' : '300px' }}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length > 1 && messages.length <= 3 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(reply)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors hover:scale-105"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing Cards */}
                {messages.some(msg => msg.text.toLowerCase().includes('pricing') || msg.text.toLowerCase().includes('cost')) && (
                  <div className="px-4 pb-2">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Our Pricing</h4>
                    <div className="space-y-2">
                      {pricingCards.map((card, index) => (
                        <div key={index} className={`p-3 rounded-lg border-2 ${card.popular ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-semibold text-sm">{card.title}</h5>
                              <p className="text-xs text-gray-600">{card.features.join(' • ')}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-orange-600">{card.price}</div>
                              {card.popular && <div className="text-xs text-orange-600 font-semibold">Popular</div>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(newMessage)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white shadow-sm"
                    />
                    <button
                      onClick={() => handleSendMessage(newMessage)}
                      disabled={!newMessage.trim()}
                      className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowUserForm(!showUserForm)}
                        className="text-xs text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        {showUserForm ? 'Hide' : 'Share'} contact info
                      </button>
                      <button
                        onClick={() => window.open('/contact', '_blank')}
                        className="text-xs text-gray-600 hover:text-orange-500 transition-colors flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Contact page
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Press Enter to send
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                {messages.length > 3 && !chatRating && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-t">
                    <div className="text-center">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">How was your experience?</h4>
                      <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(star)}
                            className="text-gray-300 hover:text-yellow-400 transition-colors"
                          >
                            <Star className="h-5 w-5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Options */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-2xl">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <a
                        href="tel:+15551234567"
                        className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group"
                      >
                        <Phone className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Call</span>
                      </a>
                      <a
                        href="mailto:contact@ondosoft.com"
                        className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group"
                      >
                        <Mail className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Email</span>
                      </a>
                      <button
                        onClick={() => window.open('/pricing', '_blank')}
                        className="flex items-center text-gray-600 hover:text-orange-500 transition-colors group"
                      >
                        <DollarSign className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Pricing</span>
                      </button>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Usually responds in minutes</span>
                      <span className="sm:hidden">Fast response</span>
                    </div>
                  </div>
                  
                  {/* Trust indicators */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          <span>Secure chat</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="h-3 w-3 text-orange-500 mr-1" />
                          <span>Instant response</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>4.9/5 rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChatWidget;
