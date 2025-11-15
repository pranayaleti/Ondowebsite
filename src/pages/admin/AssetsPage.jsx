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
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Maximize2,
  Minimize2,
  DownloadCloud,
  Plus,
  Upload
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
  const [selectedAssets, setSelectedAssets] = useState(new Set());
  const [collapsedClients, setCollapsedClients] = useState(new Set());
  const [collapsedProjects, setCollapsedProjects] = useState(new Set());
  const [previewAsset, setPreviewAsset] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputRef, setFileInputRef] = useState(null);
  const [newAssetData, setNewAssetData] = useState({
    user_id: '',
    name: '',
    type: 'image',
    category: 'image',
    description: '',
    url: '',
    file_size: null,
    project: ''
  });
  const [uploading, setUploading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAssets();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

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
        asset.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.project?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterUser) {
      filtered = filtered.filter(asset => asset.user_id === parseInt(filterUser));
    }

    if (filterType) {
      filtered = filtered.filter(asset => asset.type === filterType);
    }

    // Group by user, then by project
    const grouped = {};
    filtered.forEach(asset => {
      const userId = asset.user_id;
      const projectName = asset.project || 'Uncategorized';
      
      if (!grouped[userId]) {
        grouped[userId] = {
          user: {
            id: asset.user_id,
            name: asset.user_name,
            email: asset.user_email,
            company: asset.company_name
          },
          projects: {}
        };
      }
      
      if (!grouped[userId].projects[projectName]) {
        grouped[userId].projects[projectName] = [];
      }
      
      grouped[userId].projects[projectName].push(asset);
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
      link.target = '_blank';
      link.click();
    }
  };

  const handleBulkDownload = async () => {
    if (selectedAssets.size === 0) return;
    
    const selectedAssetObjects = assets.filter(a => selectedAssets.has(a.id));
    
    // Download each asset
    for (const asset of selectedAssetObjects) {
      if (asset.url) {
        const link = document.createElement('a');
        link.href = asset.url;
        link.download = asset.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Small delay between downloads to avoid browser blocking
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setSelectedAssets(new Set());
  };

  const handleSelectAll = (clientId) => {
    const group = groupedAssets[clientId];
    if (!group) return;
    
    // Get all assets for this client across all projects
    const allAssets = [];
    Object.values(group.projects).forEach(projectAssets => {
      allAssets.push(...projectAssets);
    });
    
    const allSelected = allAssets.every(asset => selectedAssets.has(asset.id));
    
    if (allSelected) {
      // Deselect all assets for this client
      const newSelected = new Set(selectedAssets);
      allAssets.forEach(asset => newSelected.delete(asset.id));
      setSelectedAssets(newSelected);
    } else {
      // Select all assets for this client
      const newSelected = new Set(selectedAssets);
      allAssets.forEach(asset => newSelected.add(asset.id));
      setSelectedAssets(newSelected);
    }
  };

  const handleSelectAllProject = (clientId, projectName) => {
    const group = groupedAssets[clientId];
    if (!group || !group.projects[projectName]) return;
    
    const projectAssets = group.projects[projectName];
    const allSelected = projectAssets.every(asset => selectedAssets.has(asset.id));
    
    if (allSelected) {
      // Deselect all assets for this project
      const newSelected = new Set(selectedAssets);
      projectAssets.forEach(asset => newSelected.delete(asset.id));
      setSelectedAssets(newSelected);
    } else {
      // Select all assets for this project
      const newSelected = new Set(selectedAssets);
      projectAssets.forEach(asset => newSelected.add(asset.id));
      setSelectedAssets(newSelected);
    }
  };

  const handleSelectAsset = (assetId) => {
    const newSelected = new Set(selectedAssets);
    if (newSelected.has(assetId)) {
      newSelected.delete(assetId);
    } else {
      newSelected.add(assetId);
    }
    setSelectedAssets(newSelected);
  };

  const toggleClientCollapse = (clientId) => {
    const newCollapsed = new Set(collapsedClients);
    if (newCollapsed.has(clientId)) {
      newCollapsed.delete(clientId);
    } else {
      newCollapsed.add(clientId);
    }
    setCollapsedClients(newCollapsed);
  };

  const toggleProjectCollapse = (clientId, projectName) => {
    const key = `${clientId}-${projectName}`;
    const newCollapsed = new Set(collapsedProjects);
    if (newCollapsed.has(key)) {
      newCollapsed.delete(key);
    } else {
      newCollapsed.add(key);
    }
    setCollapsedProjects(newCollapsed);
  };

  const handlePreview = (asset) => {
    setPreviewAsset(asset);
  };

  const closePreview = () => {
    setPreviewAsset(null);
  };

  const getSelectedCountForClient = (clientId) => {
    const group = groupedAssets[clientId];
    if (!group) return 0;
    let count = 0;
    Object.values(group.projects).forEach(projectAssets => {
      count += projectAssets.filter(asset => selectedAssets.has(asset.id)).length;
    });
    return count;
  };

  const getSelectedCountForProject = (clientId, projectName) => {
    const group = groupedAssets[clientId];
    if (!group || !group.projects[projectName]) return 0;
    return group.projects[projectName].filter(asset => selectedAssets.has(asset.id)).length;
  };

  const getTotalSelectedCount = () => {
    return selectedAssets.size;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }

    // Determine file type
    let fileType = 'document';
    if (file.type && file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type && file.type.startsWith('video/')) {
      fileType = 'video';
    } else if (file.type && file.type.startsWith('audio/')) {
      fileType = 'audio';
    } else if (file.type && (file.type.includes('pdf') || file.type === 'application/pdf')) {
      fileType = 'document';
    } else {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
        fileType = 'image';
      }
    }

    // Determine category
    let category = 'image';
    const fileName = file.name.toLowerCase();
    if (fileName.includes('logo')) {
      category = 'logo';
    } else if (fileName.includes('document') || fileName.includes('doc') || fileName.includes('pdf')) {
      category = 'document';
    } else if (fileType === 'image') {
      category = 'image';
    } else if (fileType === 'document') {
      category = 'document';
    }

    // Extract filename without extension
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');

    // Read file as base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setSelectedFile(file);
      setNewAssetData({
        ...newAssetData,
        name: fileNameWithoutExt || file.name,
        type: fileType,
        category: category,
        url: result,
        file_size: file.size,
        project: newAssetData.project || ''
      });
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!newAssetData.user_id) {
      setError('Please select a user');
      return;
    }

    if (!newAssetData.name || !newAssetData.type) {
      setError('Name and type are required');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      await adminAPI.createAsset(newAssetData);
      setShowAddModal(false);
      setSelectedFile(null);
      setNewAssetData({
        user_id: '',
        name: '',
        type: 'image',
        category: 'image',
        description: '',
        url: '',
        file_size: null,
        project: ''
      });
      if (fileInputRef) {
        fileInputRef.value = '';
      }
      fetchAssets();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">All Assets</h1>
            <p className="text-gray-400">View and manage all client-uploaded assets grouped by project/client</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Asset
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {getTotalSelectedCount() > 0 && (
          <div className="mb-6 bg-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">
                {getTotalSelectedCount()} asset{getTotalSelectedCount() !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedAssets(new Set())}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Clear selection
              </button>
            </div>
            <button
              onClick={handleBulkDownload}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              <DownloadCloud className="w-4 h-4" />
              Download Selected ({getTotalSelectedCount()})
            </button>
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
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => toggleClientCollapse(group.user.id)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        title={collapsedClients.has(group.user.id) ? 'Expand' : 'Collapse'}
                      >
                        {collapsedClients.has(group.user.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="flex-1">
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
                            <span>{Object.keys(group.projects).length} project{Object.keys(group.projects).length !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{(() => {
                              let total = 0;
                              Object.values(group.projects).forEach(projectAssets => {
                                total += projectAssets.length;
                              });
                              return total;
                            })()} asset{(() => {
                              let total = 0;
                              Object.values(group.projects).forEach(projectAssets => {
                                total += projectAssets.length;
                              });
                              return total !== 1 ? 's' : '';
                            })()}</span>
                          </div>
                          {getSelectedCountForClient(group.user.id) > 0 && (
                            <div className="flex items-center gap-2 text-orange-400">
                              <Check className="w-4 h-4" />
                              <span>{getSelectedCountForClient(group.user.id)} selected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectAll(group.user.id)}
                        className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        title="Select all assets for this client"
                      >
                        Select All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Projects and Assets */}
                {!collapsedClients.has(group.user.id) && (
                  <div className="p-6 space-y-4">
                    {Object.entries(group.projects).map(([projectName, projectAssets]) => {
                      const projectKey = `${group.user.id}-${projectName}`;
                      const isProjectCollapsed = collapsedProjects.has(projectKey);
                      
                      return (
                        <div key={projectKey} className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
                          {/* Project Header */}
                          <div className="bg-gray-800/50 p-4 border-b border-gray-700">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <button
                                  onClick={() => toggleProjectCollapse(group.user.id, projectName)}
                                  className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                                  title={isProjectCollapsed ? 'Expand' : 'Collapse'}
                                >
                                  {isProjectCollapsed ? (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                  <Folder className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-white">{projectName}</h3>
                                  <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <span>{projectAssets.length} asset{projectAssets.length !== 1 ? 's' : ''}</span>
                                    {getSelectedCountForProject(group.user.id, projectName) > 0 && (
                                      <span className="text-orange-400">
                                        {getSelectedCountForProject(group.user.id, projectName)} selected
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleSelectAllProject(group.user.id, projectName)}
                                className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                title="Select all assets in this project"
                              >
                                Select All
                              </button>
                            </div>
                          </div>
                          
                          {/* Assets Grid */}
                          {!isProjectCollapsed && (
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projectAssets.map((asset) => {
                        const AssetIcon = getAssetIcon(asset.type, asset.category);
                        const isSelected = selectedAssets.has(asset.id);
                        const isImage = asset.type === 'image';
                        const isDocument = asset.type === 'document';
                        
                        return (
                          <div
                            key={asset.id}
                            className={`bg-gray-900/50 rounded-lg p-4 border transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-orange-500 bg-orange-500/10' 
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                            onClick={() => handleSelectAsset(asset.id)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-colors ${
                                  isSelected 
                                    ? 'bg-orange-500 border-orange-500' 
                                    : 'bg-gray-800 border-gray-600'
                                }`}>
                                  {isSelected ? (
                                    <Check className="w-4 h-4 text-white" />
                                  ) : (
                                    <AssetIcon className="w-4 h-4 text-gray-400" />
                                  )}
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
                              <div className="flex items-center gap-1">
                                {(isImage || isDocument) && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePreview(asset);
                                    }}
                                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
                                    title="Preview"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(asset);
                                  }}
                                  className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {asset.url && isImage && (
                              <div 
                                className="mb-3 rounded-lg overflow-hidden bg-gray-900/50 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePreview(asset);
                                }}
                              >
                                <img
                                  src={asset.url}
                                  alt={asset.name}
                                  className="w-full h-32 object-cover hover:opacity-80 transition-opacity"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}

                            {isDocument && (
                              <div 
                                className="mb-3 rounded-lg overflow-hidden bg-gray-900/50 p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePreview(asset);
                                }}
                              >
                                <div className="flex items-center justify-center h-24">
                                  <FileText className="w-12 h-12 text-gray-500" />
                                </div>
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
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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

        {/* Preview Modal */}
        {previewAsset && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closePreview}
          >
            <div 
              className="relative max-w-7xl max-h-[90vh] bg-gray-900 rounded-xl border border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const AssetIcon = getAssetIcon(previewAsset.type, previewAsset.category);
                      return <AssetIcon className="w-5 h-5 text-orange-400" />;
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">{previewAsset.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{previewAsset.type}</span>
                      {previewAsset.file_size && (
                        <>
                          <span>•</span>
                          <span>{formatFileSize(previewAsset.file_size)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(previewAsset)}
                    className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={closePreview}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
                {previewAsset.type === 'image' && previewAsset.url ? (
                  <div className="flex items-center justify-center">
                    <img
                      src={previewAsset.url}
                      alt={previewAsset.name}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden items-center justify-center h-64 text-gray-400">
                      <div className="text-center">
                        <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Failed to load image</p>
                      </div>
                    </div>
                  </div>
                ) : previewAsset.type === 'document' && previewAsset.url ? (
                  <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="mb-6">
                      <FileText className="w-24 h-24 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 text-center mb-4">{previewAsset.name}</p>
                    </div>
                    <iframe
                      src={previewAsset.url}
                      className="w-full h-[600px] border border-gray-700 rounded-lg bg-white"
                      title={previewAsset.name}
                    />
                    <div className="mt-4 text-sm text-gray-400">
                      <p>If the document doesn't load, try downloading it instead.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <div className="text-center">
                      <File className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Preview not available for this file type</p>
                    </div>
                  </div>
                )}
                
                {previewAsset.description && (
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-semibold text-white mb-2">Description</h4>
                    <p className="text-sm text-gray-300">{previewAsset.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Asset Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Add New Asset</h2>
                  <p className="text-sm text-orange-100 mt-1">Upload an asset and assign it to a client</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                    setSelectedFile(null);
                    setNewAssetData({
                      user_id: '',
                      name: '',
                      type: 'image',
                      category: 'image',
                      description: '',
                      url: '',
                      file_size: null
                    });
                    if (fileInputRef) {
                      fileInputRef.value = '';
                    }
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* User Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Client <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={newAssetData.user_id}
                      onChange={(e) => setNewAssetData({...newAssetData, user_id: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select a client</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      File <span className="text-red-400">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors">
                      <input
                        ref={(el) => setFileInputRef(el)}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                        </span>
                        <span className="text-xs text-gray-500">Max 10MB</span>
                      </label>
                    </div>
                    {selectedFile && (
                      <div className="mt-2 text-xs text-gray-400">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </div>
                    )}
                  </div>

                  {/* Asset Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Asset Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newAssetData.name}
                      onChange={(e) => setNewAssetData({...newAssetData, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter asset name"
                      required
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={newAssetData.type}
                      onChange={(e) => setNewAssetData({...newAssetData, type: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="document">Document</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newAssetData.category}
                      onChange={(e) => setNewAssetData({...newAssetData, category: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="image">Image</option>
                      <option value="logo">Logo</option>
                      <option value="document">Document</option>
                    </select>
                  </div>

                  {/* Project */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project
                    </label>
                    <input
                      type="text"
                      value={newAssetData.project}
                      onChange={(e) => setNewAssetData({...newAssetData, project: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter project name (optional)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to add to "Uncategorized"</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newAssetData.description}
                      onChange={(e) => setNewAssetData({...newAssetData, description: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows={3}
                      placeholder="Optional description..."
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-900/50 p-6 flex items-center justify-end gap-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                    setSelectedFile(null);
                    setNewAssetData({
                      user_id: '',
                      name: '',
                      type: 'image',
                      category: 'image',
                      description: '',
                      url: '',
                      file_size: null
                    });
                    if (fileInputRef) {
                      fileInputRef.value = '';
                    }
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile || !newAssetData.user_id}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Asset
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssetsPage;

