import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle, ArrowRight, DollarSign, Clock, Users, Code, Smartphone, Cloud, Database } from 'lucide-react';

const ProjectCostEstimator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    type: '',
    complexity: '',
    features: [],
    timeline: '',
    teamSize: '',
    integrations: []
  });
  const [estimatedCost, setEstimatedCost] = useState({ min: 0, max: 0 });
  const [isCalculating, setIsCalculating] = useState(false);

  const projectTypes = [
    {
      id: 'website',
      name: 'Small Business Website',
      icon: Code,
      basePrice: { min: 1200, max: 2500 },
      description: 'Professional website with 5-10 pages'
    },
    {
      id: 'webapp',
      name: 'Custom Web Application',
      icon: Code,
      basePrice: { min: 3500, max: 8000 },
      description: 'Full-stack web application with user authentication'
    },
    {
      id: 'saas',
      name: 'SaaS Platform',
      icon: Cloud,
      basePrice: { min: 8000, max: 25000 },
      description: 'Multi-tenant SaaS solution with subscription billing'
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      icon: Smartphone,
      basePrice: { min: 6000, max: 15000 },
      description: 'Native iOS/Android or cross-platform mobile app'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Solution',
      icon: Database,
      basePrice: { min: 4000, max: 12000 },
      description: 'Online store with payment processing and inventory'
    }
  ];

  const complexityLevels = [
    {
      id: 'simple',
      name: 'Simple',
      multiplier: 1,
      description: 'Basic functionality, standard design'
    },
    {
      id: 'moderate',
      name: 'Moderate',
      multiplier: 1.5,
      description: 'Custom features, responsive design'
    },
    {
      id: 'complex',
      name: 'Complex',
      multiplier: 2.2,
      description: 'Advanced functionality, custom integrations'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      multiplier: 3.5,
      description: 'Large-scale, high-performance solution'
    }
  ];

  const features = [
    { id: 'auth', name: 'User Authentication', price: 800 },
    { id: 'payment', name: 'Payment Processing', price: 1200 },
    { id: 'admin', name: 'Admin Dashboard', price: 1500 },
    { id: 'api', name: 'REST API', price: 2000 },
    { id: 'mobile', name: 'Mobile Responsive', price: 600 },
    { id: 'seo', name: 'SEO Optimization', price: 800 },
    { id: 'analytics', name: 'Analytics Integration', price: 400 },
    { id: 'chat', name: 'Live Chat', price: 600 },
    { id: 'email', name: 'Email Marketing', price: 800 },
    { id: 'cms', name: 'Content Management', price: 1200 }
  ];

  const timelineOptions = [
    { id: 'rush', name: 'Rush (2-4 weeks)', multiplier: 1.5 },
    { id: 'fast', name: 'Fast (1-2 months)', multiplier: 1.2 },
    { id: 'standard', name: 'Standard (2-4 months)', multiplier: 1 },
    { id: 'flexible', name: 'Flexible (4+ months)', multiplier: 0.9 }
  ];

  const calculateCost = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const selectedType = projectTypes.find(type => type.id === projectData.type);
      const selectedComplexity = complexityLevels.find(level => level.id === projectData.complexity);
      const selectedTimeline = timelineOptions.find(option => option.id === projectData.timeline);
      
      if (!selectedType || !selectedComplexity || !selectedTimeline) {
        setIsCalculating(false);
        return;
      }
      
      let baseMin = selectedType.basePrice.min;
      let baseMax = selectedType.basePrice.max;
      
      // Apply complexity multiplier
      baseMin *= selectedComplexity.multiplier;
      baseMax *= selectedComplexity.multiplier;
      
      // Add feature costs
      const featureCost = projectData.features.reduce((total, featureId) => {
        const feature = features.find(f => f.id === featureId);
        return total + (feature ? feature.price : 0);
      }, 0);
      
      baseMin += featureCost;
      baseMax += featureCost;
      
      // Apply timeline multiplier
      baseMin *= selectedTimeline.multiplier;
      baseMax *= selectedTimeline.multiplier;
      
      setEstimatedCost({
        min: Math.round(baseMin),
        max: Math.round(baseMax)
      });
      
      setIsCalculating(false);
    }, 1500);
  };

  useEffect(() => {
    if (projectData.type && projectData.complexity && projectData.timeline) {
      calculateCost();
    }
  }, [projectData.type, projectData.complexity, projectData.timeline, projectData.features]);

  const handleFeatureToggle = (featureId) => {
    setProjectData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(id => id !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const resetEstimator = () => {
    setCurrentStep(1);
    setProjectData({
      type: '',
      complexity: '',
      features: [],
      timeline: '',
      teamSize: '',
      integrations: []
    });
    setEstimatedCost({ min: 0, max: 0 });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Your <span className="text-orange-500">Project Cost Estimate</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Answer a few questions about your project and get an instant cost estimate. 
            Our transparent pricing helps you plan your budget with confidence.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-orange-500 h-2">
            <div 
              className="bg-orange-600 h-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>

          <div className="p-8 md:p-12">
            {/* Step 1: Project Type */}
            {currentStep === 1 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">What type of project do you need?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setProjectData(prev => ({ ...prev, type: type.id }));
                        setCurrentStep(2);
                      }}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                        projectData.type === type.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <div className={`p-3 rounded-lg mr-4 ${
                          projectData.type === type.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <type.icon className="h-6 w-6" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">{type.name}</h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                      <div className="text-orange-600 font-semibold">
                        ${type.basePrice.min.toLocaleString()} - ${type.basePrice.max.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Complexity */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">How complex is your project?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {complexityLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => {
                        setProjectData(prev => ({ ...prev, complexity: level.id }));
                        setCurrentStep(3);
                      }}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                        projectData.complexity === level.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">{level.name}</h4>
                      <p className="text-gray-600 mb-4">{level.description}</p>
                      <div className="flex items-center text-orange-600 font-semibold">
                        <span className="text-sm">Complexity factor: {level.multiplier}x</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Features */}
            {currentStep === 3 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">What features do you need?</h3>
                <p className="text-gray-600 mb-8">Select all that apply (optional)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {features.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 text-left hover:shadow-md ${
                        projectData.features.includes(feature.id)
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{feature.name}</span>
                        <div className="flex items-center">
                          <span className="text-orange-600 font-semibold mr-2">+${feature.price.toLocaleString()}</span>
                          {projectData.features.includes(feature.id) && (
                            <CheckCircle className="h-5 w-5 text-orange-500" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Timeline */}
            {currentStep === 4 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">What's your timeline?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {timelineOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setProjectData(prev => ({ ...prev, timeline: option.id }));
                      }}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg ${
                        projectData.timeline === option.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">{option.name}</h4>
                      <div className="flex items-center text-orange-600 font-semibold">
                        <Clock className="h-5 w-5 mr-2" />
                        <span className="text-sm">
                          {option.multiplier > 1 ? '+' : option.multiplier < 1 ? '-' : ''}
                          {Math.abs((option.multiplier - 1) * 100).toFixed(0)}% cost impact
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={resetEstimator}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}

            {/* Cost Estimate Results */}
            {estimatedCost.min > 0 && (
              <div className="mt-12 p-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl text-white">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-4">Your Project Estimate</h3>
                  {isCalculating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                      <span className="text-xl">Calculating...</span>
                    </div>
                  ) : (
                    <div className="mb-8">
                      <div className="text-5xl font-bold mb-2">
                        ${estimatedCost.min.toLocaleString()} - ${estimatedCost.max.toLocaleString()}
                      </div>
                      <p className="text-orange-100 text-lg">
                        Estimated cost range for your project
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/20 rounded-lg p-4">
                      <DollarSign className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">Transparent</div>
                      <div className="text-orange-100 text-sm">No hidden fees</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <Clock className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">Fast</div>
                      <div className="text-orange-100 text-sm">Quick delivery</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <Users className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">Expert</div>
                      <div className="text-orange-100 text-sm">Senior developers</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/contact"
                      className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center"
                    >
                      Get Detailed Quote
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </a>
                    <a
                      href="/contact"
                      className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center"
                    >
                      Schedule Consultation
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCostEstimator;
