import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/auth';
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  File, 
  Download, 
  Loader, 
  AlertCircle,
  Folder,
  User,
  Mail,
  Building,
  Calendar,
  Filter,
  Search,
  X
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterType, setFilterType] = useState('');
  const [groupedAssets, setGroupedAssets] = useState({});

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    groupAssetsByUser();
  }, [assets, filterUser, filterType, searchTerm]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getAssets();
      setAssets(data.assets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const groupAssetsByUser = () => {
    let filtered = assets;

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterUser) {
      filtered = filtered.filter(asset => asset.user_id === parseInt(filterUser));
    }

    if (filterType) {
      filtered = filtered.filter(asset => asset.type === filterType);
    }

    // Group by user
    const grouped = {};
    filtered.forEach(asset => {
      const userId = asset.user_id;
      if (!grouped[userId]) {
        grouped[userId] = {
          user: {
            id: asset.user_id,
            name: asset.user_name,
            email: asset.user_email,
            company: asset.company_name
          },
          assets: []
        };
      }
      grouped[userId].assets.push(asset);
    });

    setGroupedAssets(grouped);
  };

  const getAssetIcon = (type, category) => {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      case 'document':
        return FileText;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = (asset) => {
    if (asset.url) {
      const link = document.createElement('a');
      link.href = asset.url;
      link.download = asset.name;
      link.click();
    }
  };

  const uniqueUsers = Array.from(new Set(assets.map(a => a.user_id)))
    .map(id => {
      const asset = assets.find(a => a.user_id === id);
      return { id, name: asset.user_name, email: asset.user_email };
    });

  const uniqueTypes = Array.from(new Set(assets.map(a => a.type)));

  if (loading) {
    return (
      <>
        <SEOHead title="Assets - Admin" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Assets - Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">All Assets</h1>
          <p className="text-gray-400">View and manage all client-uploaded assets grouped by project/client</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assets, clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Clients</option>
              {uniqueUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
          {(searchTerm || filterUser || filterType) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {searchTerm && (
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm flex items-center gap-2">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="hover:text-orange-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterUser && (
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm flex items-center gap-2">
                  Client: {uniqueUsers.find(u => u.id === parseInt(filterUser))?.name}
                  <button onClick={() => setFilterUser('')} className="hover:text-orange-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filterType && (
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm flex items-center gap-2">
                  Type: {filterType}
                  <button onClick={() => setFilterType('')} className="hover:text-orange-300">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Folder className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Total Assets</h3>
            <p className="text-2xl font-bold text-white">{assets.length}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Total Clients</h3>
            <p className="text-2xl font-bold text-white">{Object.keys(groupedAssets).length}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Image className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Images</h3>
            <p className="text-2xl font-bold text-white">{assets.filter(a => a.type === 'image').length}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Documents</h3>
            <p className="text-2xl font-bold text-white">{assets.filter(a => a.type === 'document').length}</p>
          </div>
        </div>

        {/* Grouped Assets */}
        {Object.keys(groupedAssets).length > 0 ? (
          <div className="space-y-6">
            {Object.values(groupedAssets).map((group, index) => (
              <div key={group.user.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                {/* User/Project Header */}
                <div className="bg-gray-900/50 p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">{group.user.name}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{group.user.email}</span>
                          </div>
                          {group.user.company && (
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              <span>{group.user.company}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4" />
                            <span>{group.assets.length} asset{group.assets.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assets Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.assets.map((asset) => {
                      const AssetIcon = getAssetIcon(asset.type, asset.category);
                      return (
                        <div
                          key={asset.id}
                          className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                                <AssetIcon className="w-5 h-5 text-orange-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-white truncate mb-1">{asset.name}</h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">
                                    {asset.type}
                                  </span>
                                  {asset.category && (
                                    <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400">
                                      {asset.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownload(asset)}
                              className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                          {asset.url && asset.type === 'image' && (
                            <div className="mb-3 rounded-lg overflow-hidden bg-gray-900/50">
                              <img
                                src={asset.url}
                                alt={asset.name}
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                            </div>
                            {asset.file_size && (
                              <span>{formatFileSize(asset.file_size)}</span>
                            )}
                          </div>

                          {asset.description && (
                            <p className="mt-2 text-xs text-gray-400 line-clamp-2">{asset.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <Folder className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Assets Found</h3>
            <p className="text-gray-400">
              {searchTerm || filterUser || filterType
                ? 'No assets match your filters. Try adjusting your search criteria.'
                : 'No assets have been uploaded yet.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default AssetsPage;

