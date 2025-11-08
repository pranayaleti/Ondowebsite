import { useState } from 'react';
import { CreditCard, Plus, Check, X, Star } from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const PlansPage = () => {
  const [plans] = useState([
    {
      id: 1,
      name: 'Starter',
      price: 29,
      period: 'month',
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to 5 campaigns',
        '10GB storage',
        'Basic analytics',
        'Email support',
        '5 team members'
      ],
      popular: false,
      subscribers: 45
    },
    {
      id: 2,
      name: 'Professional',
      price: 99,
      period: 'month',
      description: 'For growing businesses with advanced needs',
      features: [
        'Unlimited campaigns',
        '100GB storage',
        'Advanced analytics',
        'Priority support',
        'Unlimited team members',
        'API access',
        'Custom integrations'
      ],
      popular: true,
      subscribers: 128
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 299,
      period: 'month',
      description: 'For large organizations with custom requirements',
      features: [
        'Everything in Professional',
        'Unlimited storage',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom SLA',
        'White-label options',
        'Advanced security',
        'Compliance reporting'
      ],
      popular: false,
      subscribers: 32
    },
    {
      id: 4,
      name: 'Custom',
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for your specific needs',
      features: [
        'Fully customizable',
        'Dedicated infrastructure',
        'Custom integrations',
        'On-site support',
        'Training included'
      ],
      popular: false,
      subscribers: 8
    }
  ]);

  return (
    <>
      <SEOHead title="Plans - Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Plans Management</h1>
            <p className="text-gray-400">Manage subscription plans and pricing</p>
          </div>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Plan
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-gray-400">Total Plans</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{plans.length}</h3>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-6 h-6 text-green-400" />
              <span className="text-sm text-gray-400">Total Subscribers</span>
            </div>
            <h3 className="text-3xl font-bold text-white">
              {plans.reduce((sum, p) => sum + p.subscribers, 0)}
            </h3>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-orange-400" />
              <span className="text-sm text-gray-400">Most Popular</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {plans.find(p => p.popular)?.name || 'N/A'}
            </h3>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-6 h-6 text-purple-400" />
              <span className="text-sm text-gray-400">Avg. Price</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              ${Math.round(plans.filter(p => typeof p.price === 'number').reduce((sum, p) => sum + p.price, 0) / plans.filter(p => typeof p.price === 'number').length)}
            </h3>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border transition-colors relative ${
                plan.popular
                  ? 'border-orange-500/50 ring-2 ring-orange-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  {typeof plan.price === 'number' ? (
                    <>
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>

              <div className="border-t border-gray-700 pt-6 mb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Subscribers</span>
                  <span className="text-lg font-bold text-white">{plan.subscribers}</span>
                </div>
                <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}>
                  Manage Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlansPage;
