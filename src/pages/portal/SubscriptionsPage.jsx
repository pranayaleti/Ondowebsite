import { useState, useEffect, useMemo } from 'react';
import { portalAPI } from '../../utils/auth.js';
import { CreditCard, Loader, CheckCircle2, Star, X, AlertCircle } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import { pricingOptions } from '../../constants/data';
import { formatDateTimeUserTimezone } from '../../utils/dateFormat.js';

// Transform pricingOptions to subscription format
const transformPricingToSubscription = (pricingOptions) => {
  return pricingOptions.map((option, index) => {
    // Extract numeric price from string like "$1,200" or handle "Custom"
    let price = null;
    let priceDisplay = option.price;
    if (option.price !== 'Custom') {
      const numericPrice = parseFloat(option.price.replace(/[^0-9.]/g, ''));
      price = numericPrice;
      priceDisplay = option.price;
    }

    // Generate ID from title
    const id = option.title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Determine billing period
    let billingPeriod = 'one-time';
    if (option.title === 'Upfront & Subscription') {
      billingPeriod = 'custom';
    }

    return {
      id,
      plan_name: option.title,
      price,
      price_display: priceDisplay,
      status: 'available',
      billing_period: billingPeriod,
      features: JSON.stringify(option.features)
    };
  });
};

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [subscriptionToCancel, setSubscriptionToCancel] = useState(null);

  // Transform pricingOptions to subscription format - single source of truth
  const availablePlans = useMemo(() => transformPricingToSubscription(pricingOptions), []);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await portalAPI.getSubscriptions();
      // Normalize status to lowercase for all subscriptions
      const normalizedSubscriptions = (data.subscriptions || []).map(sub => ({
        ...sub,
        status: sub.status ? String(sub.status).toLowerCase().trim() : 'active'
      }));
      console.log('Fetched subscriptions with statuses:', normalizedSubscriptions.map(s => ({ id: s.id, plan: s.plan_name, status: s.status })));
      setSubscriptions(normalizedSubscriptions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      setSubscribing(true);
      setError(null);
      setSuccessMessage(null);

      // Ensure features is a JSON string
      let featuresString = plan.features;
      if (typeof plan.features === 'string') {
        // Already a string, use as-is
        featuresString = plan.features;
      } else if (Array.isArray(plan.features)) {
        // Convert array to JSON string
        featuresString = JSON.stringify(plan.features);
      } else {
        // Default to empty array
        featuresString = JSON.stringify([]);
      }

      const subscriptionData = {
        plan_name: plan.plan_name,
        price: plan.price,
        price_display: plan.price_display,
        billing_period: plan.billing_period,
        features: featuresString
      };

      const result = await portalAPI.createSubscription(subscriptionData);
      setSuccessMessage(`You are now subscribed to ${plan.plan_name}! You can change or cancel your subscription anytime.`);
      
      // Refresh subscriptions
      await fetchSubscriptions();
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancelClick = (subscriptionId) => {
    setSubscriptionToCancel(subscriptionId);
    setShowCancelConfirm(true);
  };

  const handleCancelConfirm = async () => {
    if (!subscriptionToCancel) return;

    try {
      setError(null);
      setSuccessMessage(null);
      
      // Update subscription status to cancelled
      const response = await portalAPI.updateSubscription(subscriptionToCancel, { status: 'cancelled' });
      
      console.log('Subscription cancelled response:', response);
      
      // Immediately remove cancelled subscription from local state
      setSubscriptions(prev => {
        const updated = prev.filter(sub => String(sub.id) !== String(subscriptionToCancel));
        console.log(`Removed subscription ${subscriptionToCancel} from list. Remaining: ${updated.length}`);
        return updated;
      });
      
      setSuccessMessage('Subscription cancelled successfully. Please choose the most suitable option for your requirements from the available plans below.');
      setShowCancelConfirm(false);
      setSubscriptionToCancel(null);
      
      // Refresh from server to ensure consistency
      await fetchSubscriptions();
    } catch (err) {
      console.error('Cancel subscription error:', err);
      setError(err.message || 'Failed to cancel subscription. Please try again.');
      setShowCancelConfirm(false);
      setSubscriptionToCancel(null);
    }
  };

  const handleCancelCancel = () => {
    setShowCancelConfirm(false);
    setSubscriptionToCancel(null);
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Subscriptions - Dashboard" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Subscriptions - Dashboard" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Subscriptions</h1>
          <p className="text-gray-400">Manage your subscription plans</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Error: {error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-green-400 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-400 hover:text-green-300 flex-shrink-0"
            >
              <X className="w-6 h-6 sm:w-5 h-5" />
            </button>
          </div>
        )}

        {/* Active Subscriptions */}
        {(() => {
          const activeSubscriptions = subscriptions.filter(s => {
            const status = String(s.status || '').toLowerCase().trim();
            const isActive = status === 'active';
            if (!isActive) {
              console.log(`Filtering out subscription ${s.id} (${s.plan_name}) with status: "${status}"`);
            }
            return isActive;
          });
          console.log(`Active subscriptions count: ${activeSubscriptions.length} out of ${subscriptions.length} total`);
          return activeSubscriptions.length > 0;
        })() && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Active Subscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.filter(s => {
                const status = String(s.status || '').toLowerCase().trim();
                return status === 'active';
              }).map((subscription) => {
                const features = subscription.features ? JSON.parse(subscription.features) : [];
                return (
                  <div
                    key={subscription.id}
                    className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-orange-400" />
                        <div>
                          <h3 className="text-xl font-bold text-white">{subscription.plan_name}</h3>
                          <p className="text-sm text-gray-400">Active Subscription</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                        {subscription.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-white mb-1">
                        {subscription.price_display || (subscription.price ? `$${parseFloat(subscription.price).toLocaleString()}` : 'Custom')}
                      </p>
                      <p className="text-sm text-gray-400">
                        {subscription.billing_period === 'one-time' ? 'One-time payment' : 
                         subscription.billing_period === 'monthly' ? 'Per month' :
                         subscription.billing_period === 'yearly' ? 'Per year' : 'Custom billing'}
                      </p>
                    </div>

                    {features.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-300 mb-2">Features:</p>
                        <ul className="space-y-1">
                          {features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                              <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {features.length > 3 && (
                            <li className="text-xs text-gray-500">+{features.length - 3} more features</li>
                          )}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-gray-500">
                        Started: {formatDateTimeUserTimezone(subscription.created_at)}
                      </p>
                      <button
                        onClick={() => handleCancelClick(subscription.id)}
                        className="px-4 py-2 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all duration-200"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {subscriptions.filter(s => s.status?.toLowerCase() === 'active').length > 0 ? 'Available Plans' : 'Choose a Subscription Plan'}
          </h2>
          {availablePlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {availablePlans.map((plan, index) => {
                const features = plan.features ? JSON.parse(plan.features) : [];
                const isPopular = index === 1; // Full Stack Development
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl p-6 border backdrop-blur-sm transition-all duration-300 flex flex-col h-full ${
                      isPopular
                        ? 'border-orange-400/60 bg-gradient-to-br from-orange-500/20 to-orange-600/20 shadow-lg shadow-orange-500/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        MOST POPULAR
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-2">{plan.plan_name}</h3>
                      <div className="mb-4">
                        <p className="text-4xl font-bold text-white mb-1">
                          {plan.price_display || 'Custom'}
                        </p>
                        <p className="text-sm text-gray-400">
                          {plan.billing_period === 'one-time' ? 'One-time payment' : 
                           plan.billing_period === 'monthly' ? 'Per month' :
                           plan.billing_period === 'yearly' ? 'Per year' : 'Custom pricing'}
                        </p>
                      </div>
                    </div>

                    {features.length > 0 && (
                      <ul className="flex-grow space-y-3 mb-6">
                        {features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={subscribing || subscriptions.some(s => s.plan_name === plan.plan_name && s.status?.toLowerCase() === 'active')}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                        isPopular
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {subscribing ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Subscribing...
                        </>
                      ) : subscriptions.some(s => s.plan_name === plan.plan_name && s.status?.toLowerCase() === 'active') ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Subscribed
                        </>
                      ) : (
                        'Subscribe Now'
                      )}
                    </button>
                    {subscriptions.some(s => s.plan_name === plan.plan_name && s.status?.toLowerCase() === 'active') && (
                      <p className="text-xs text-center text-gray-400 mt-2">
                        You can change or cancel anytime
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
              <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Plans Available</h3>
              <p className="text-gray-400">Please contact support to subscribe to a plan.</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Cancel Subscription Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl max-w-md w-full transform transition-all animate-scale-in">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              Cancel Subscription?
            </h3>
            
            <p className="text-gray-400 text-center mb-8">
              Are you sure you want to cancel this subscription? After cancellation, you can choose the most suitable option for your requirements from our available plans.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={handleCancelCancel}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionsPage;

