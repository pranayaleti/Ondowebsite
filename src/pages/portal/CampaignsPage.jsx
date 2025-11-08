import React, { useState, useEffect } from 'react';
import { portalAPI } from '../../utils/auth';
import { Megaphone, Loader } from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await portalAPI.getCampaigns();
      setCampaigns(data.campaigns);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Campaigns - Portal" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Campaigns - Portal" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Campaigns</h1>
          <p className="text-gray-400">View and manage your campaigns</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
            Error: {error}
          </div>
        )}

        {campaigns.length > 0 ? (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Megaphone className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                      <p className="text-sm text-gray-400">
                        Created: {new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <Megaphone className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Campaigns</h3>
            <p className="text-gray-400">You don't have any campaigns yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CampaignsPage;

