import React, { useState } from 'react';
import { Settings, Plus, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const ServicesPage = () => {
  const [services] = useState([
    {
      id: 1,
      name: 'Web Development',
      description: 'Full-stack web application development',
      status: 'active',
      price: '$5,000 - $50,000',
      category: 'Development',
      clients: 12
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'iOS and Android mobile applications',
      status: 'active',
      price: '$10,000 - $100,000',
      category: 'Development',
      clients: 8
    },
    {
      id: 3,
      name: 'SaaS Solutions',
      description: 'Custom SaaS platform development',
      status: 'active',
      price: '$20,000 - $200,000',
      category: 'SaaS',
      clients: 5
    },
    {
      id: 4,
      name: 'Consulting Services',
      description: 'Technical consulting and strategy',
      status: 'active',
      price: '$150 - $300/hour',
      category: 'Consulting',
      clients: 15
    },
    {
      id: 5,
      name: 'Maintenance & Support',
      description: 'Ongoing maintenance and technical support',
      status: 'active',
      price: '$500 - $5,000/month',
      category: 'Support',
      clients: 20
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Development': 'bg-blue-500/20 text-blue-400',
      'SaaS': 'bg-purple-500/20 text-purple-400',
      'Consulting': 'bg-orange-500/20 text-orange-400',
      'Support': 'bg-green-500/20 text-green-400'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <>
      <SEOHead title="Services - Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Services Management</h1>
            <p className="text-gray-400">Manage platform services and offerings</p>
          </div>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-gray-400">Total Services</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{services.length}</h3>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-sm text-gray-400">Active Services</span>
            </div>
            <h3 className="text-3xl font-bold text-white">
              {services.filter(s => s.status === 'active').length}
            </h3>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-6 h-6 text-orange-400" />
              <span className="text-sm text-gray-400">Categories</span>
            </div>
            <h3 className="text-3xl font-bold text-white">
              {new Set(services.map(s => s.category)).size}
            </h3>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-6 h-6 text-purple-400" />
              <span className="text-sm text-gray-400">Total Clients</span>
            </div>
            <h3 className="text-3xl font-bold text-white">
              {services.reduce((sum, s) => sum + s.clients, 0)}
            </h3>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{service.description}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Price Range</p>
                    <p className="text-sm font-medium text-white">{service.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Active Clients</p>
                    <p className="text-sm font-medium text-white">{service.clients}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-4 rounded-lg transition-colors border border-red-500/30">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServicesPage;
