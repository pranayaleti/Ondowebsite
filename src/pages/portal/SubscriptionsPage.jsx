import React, { useState, useEffect } from 'react';
import { portalAPI } from '../../utils/auth';
import { CreditCard, Loader, CheckCircle2, Star, X, AlertCircle } from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await portalAPI.getSubscriptions();
      setSubscriptions(data.subscriptions || []);
      setAvailablePlans(data.availablePlans || []);
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

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription? You can reactivate it later if needed.')) {
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);
      await portalAPI.updateSubscription(subscriptionId, { status: 'cancelled' });
      setSuccessMessage('Subscription cancelled successfully. You can subscribe to a new plan anytime.');
      await fetchSubscriptions();
    } catch (err) {
      setError(err.message || 'Failed to cancel subscription. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Subscriptions - Portal" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Subscriptions - Portal" />
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
              <CheckCircle2 className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-400 hover:text-green-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active Subscriptions */}
        {subscriptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Active Subscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((subscription) => {
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
                        Started: {new Date(subscription.created_at).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => handleCancelSubscription(subscription.id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
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
            {subscriptions.length > 0 ? 'Available Plans' : 'Choose a Subscription Plan'}
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
                      disabled={subscribing || subscriptions.some(s => s.plan_name === plan.plan_name && s.status === 'active')}
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
                      ) : subscriptions.some(s => s.plan_name === plan.plan_name && s.status === 'active') ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Subscribed
                        </>
                      ) : (
                        'Subscribe Now'
                      )}
                    </button>
                    {subscriptions.some(s => s.plan_name === plan.plan_name && s.status === 'active') && (
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
    </>
  );
};

export default SubscriptionsPage;

