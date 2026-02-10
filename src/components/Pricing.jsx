import { useState, useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { pricingOptions } from "../constants/data";
import analyticsTracker from "../utils/analytics.js";
import { API_URL } from "../utils/apiConfig.js";

const Pricing = ({ onConsult }) => {
  const cards = pricingOptions; // show all pricing options
  const [selectedIndex, setSelectedIndex] = useState(1); // preselect right card ("Most Popular")
  const [interactionCount, setInteractionCount] = useState(0);
  const [maxScrollDepth, setMaxScrollDepth] = useState(0);
  const startTimeRef = useRef(Date.now());
  const lastInteractionTimeRef = useRef(Date.now());

  // Track interaction to database
  const trackInteraction = async (interactionType, details = {}, event = null) => {
    const sessionId = analyticsTracker.sessionId;
    const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const newCount = interactionCount + 1;
    setInteractionCount(newCount);
    lastInteractionTimeRef.current = Date.now();

    // Get click coordinates if event provided
    const clickX = event?.clientX || null;
    const clickY = event?.clientY || null;

    // Get element info if event provided
    const element = event?.target || null;
    const elementType = element?.tagName?.toLowerCase() || null;
    const elementId = element?.id || null;
    const elementClass = element?.className || null;
    const elementText = element?.textContent?.trim().substring(0, 200) || null;

    // Get selected plan info
    const selectedPlan = cards[selectedIndex]?.title || null;
    const selectedPlanPrice = cards[selectedIndex]?.price || null;

    const payload = {
      sessionId,
      interactionType,
      interactionDetails: {
        ...details,
        interactionCount: newCount,
        timeOnPageSeconds: timeOnPage
      },
      elementType,
      elementId,
      elementClass,
      elementText,
      clickX,
      clickY,
      selectedPlan,
      selectedPlanPrice,
      selectedPlanIndex: selectedIndex,
      timeOnPageSeconds: timeOnPage,
      scrollDepth: maxScrollDepth,
      pageUrl: window.location.href,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    // Extract UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    payload.utmSource = urlParams.get('utm_source') || null;
    payload.utmMedium = urlParams.get('utm_medium') || null;
    payload.utmCampaign = urlParams.get('utm_campaign') || null;
    payload.utmContent = urlParams.get('utm_content') || null;

    // Save to database (non-blocking)
    try {
      await fetch(`${API_URL}/pricing/interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.warn('Failed to save pricing interaction:', error);
    }

    // Also track in analytics
    analyticsTracker.trackUserInteraction('pricing_page_interaction', {
      interactionType,
      ...details,
      selectedPlan,
      selectedPlanPrice,
      selectedPlanIndex: selectedIndex
    });
  };

  // Track card selection
  const handleCardClick = (index, event) => {
    const previousIndex = selectedIndex;
    setSelectedIndex(index);
    
    trackInteraction('card_selected', {
      previousPlanIndex: previousIndex,
      previousPlan: cards[previousIndex]?.title || null,
      newPlanIndex: index,
      newPlan: cards[index]?.title || null,
      newPlanPrice: cards[index]?.price || null
    }, event);
  };

  // Track button click
  const handleGetStartedClick = (option, event) => {
    trackInteraction('get_started_clicked', {
      planTitle: option.title,
      planPrice: option.price,
      planIndex: cards.findIndex(c => c.title === option.title)
    }, event);
    
    // Call original handler
    onConsult?.({ name: option.title, price: option.price, cadence: "Starting Price" });
  };

  // Track scroll depth
  useEffect(() => {
    let currentMaxScroll = maxScrollDepth;
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const scrollDepth = Math.round((scrollTop + clientHeight) / scrollHeight * 100);
      
      if (scrollDepth > currentMaxScroll) {
        currentMaxScroll = scrollDepth;
        setMaxScrollDepth(scrollDepth);
        
        // Track scroll milestones (25%, 50%, 75%, 100%)
        if ([25, 50, 75, 100].includes(scrollDepth)) {
          const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
          trackInteraction('scroll_milestone', {
            scrollDepth,
            timeOnPageSeconds: timeOnPage
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page view and initial card selection
  useEffect(() => {
    // Track page view
    trackInteraction('page_viewed', {
      totalPlans: cards.length,
      defaultSelectedPlan: cards[selectedIndex]?.title || null,
      defaultSelectedPlanPrice: cards[selectedIndex]?.price || null
    });

    // Track initial card selection
    trackInteraction('card_selected', {
      planIndex: selectedIndex,
      plan: cards[selectedIndex]?.title || null,
      planPrice: cards[selectedIndex]?.price || null,
      isInitialSelection: true
    });

    // Track page exit
    const handleBeforeUnload = () => {
      const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const finalScrollDepth = maxScrollDepth;
      const finalInteractionCount = interactionCount;
      
      // Use fetch with keepalive for reliable page exit tracking
      const payload = {
        sessionId: analyticsTracker.sessionId,
        interactionType: 'page_exit',
        interactionDetails: {
          timeOnPageSeconds: timeOnPage,
          maxScrollDepth: finalScrollDepth,
          totalInteractions: finalInteractionCount
        },
        timeOnPageSeconds: timeOnPage,
        scrollDepth: finalScrollDepth,
        pageUrl: window.location.href,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      // Extract UTM parameters
      const urlParams = new URLSearchParams(window.location.search);
      payload.utmSource = urlParams.get('utm_source') || null;
      payload.utmMedium = urlParams.get('utm_medium') || null;
      payload.utmCampaign = urlParams.get('utm_campaign') || null;
      payload.utmContent = urlParams.get('utm_content') || null;

      // Use fetch with keepalive for reliable delivery on page exit
      fetch(`${API_URL}/pricing/interaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {}); // Silently fail on page exit
    };

    // Use pagehide instead of beforeunload to allow back/forward cache
    // beforeunload prevents bfcache restoration
    window.addEventListener('pagehide', handleBeforeUnload);
    return () => window.removeEventListener('pagehide', handleBeforeUnload);
  }, []);

  // Track feature hover/interaction (optional - for more detailed tracking)
  const handleFeatureHover = (feature, planIndex, event) => {
    trackInteraction('feature_hovered', {
      feature,
      planIndex,
      plan: cards[planIndex]?.title || null
    }, event);
  };

  return (
    <div className="mt-20 mb-20 md:mb-24 lg:mb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-8 tracking-wide break-words">
        <span className="text-white">Service</span>
        <br />
        <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text drop-shadow-lg">
          Packages
        </span>
      </h2>
      <p className="text-center text-neutral-200 text-base sm:text-lg mb-12 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
        Choose the package that best fits your business needs. All packages include
        professional development, testing, and deployment.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
        {cards.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <div
              key={option.title}
              className={`relative rounded-2xl p-8 md:p-10 border backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col h-full ${
                isSelected
                  ? "border-orange-400/60 bg-[radial-gradient(ellipse_at_center_top,rgba(255,122,0,0.15),rgba(0,0,0,0.6))] shadow-[0_0_0_1px_rgba(251,146,60,0.2),0_20px_60px_-20px_rgba(251,146,60,0.5)]"
                  : "border-neutral-700 bg-neutral-900/40 hover:border-neutral-500"
              }`}
              onClick={(e) => handleCardClick(index, e)}
              onMouseEnter={(e) => trackInteraction('card_hovered', {
                planIndex: index,
                plan: option.title,
                planPrice: option.price,
                isSelected
              }, e)}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <p className="text-3xl md:text-4xl mb-6 text-white font-semibold">
                  {option.title === "UI/UX Master Suite" ? (
                    <>
                      UI/UX<br />Master Suite
                    </>
                  ) : (
                    option.title
                  )}
                </p>
                <div
                  className={`h-3 w-3 rounded-full ${
                    isSelected ? "bg-orange-500" : "bg-neutral-600"
                  }`}
                  aria-hidden
                />
              </div>

              <p className="mb-8 flex items-start gap-1">
                <span className="text-5xl mr-1 text-white font-bold">{option.price}</span>
                <span className="text-xl text-neutral-300 -mt-2">*</span>
              </p>

              <ul className="flex-grow">
                {option.features.map((feature, featureIndex) => (
                  <li 
                    key={feature} 
                    className="mt-5 flex items-start"
                    onMouseEnter={(e) => handleFeatureHover(feature, index, e)}
                    onClick={(e) => trackInteraction('feature_clicked', {
                      feature,
                      featureIndex,
                      planIndex: index,
                      plan: option.title
                    }, e)}
                  >
                    <CheckCircle2 className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="ml-2 text-neutral-200">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGetStartedClick(option, e);
                }}
                onMouseEnter={(e) => trackInteraction('button_hovered', {
                  buttonType: 'get_started',
                  planIndex: index,
                  plan: option.title,
                  planPrice: option.price
                }, e)}
                className={`inline-flex justify-center items-center text-center w-full h-12 px-5 mt-12 mb-4 tracking-tight text-lg rounded-md transition duration-200 ${
                  isSelected
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-neutral-800 text-white hover:bg-neutral-700"
                }`}
              >
                Get Started
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
