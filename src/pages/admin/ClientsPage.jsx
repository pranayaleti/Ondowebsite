import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/auth';
import { 
  Users, Loader, Search, Filter, Calendar, Mail, Phone, Building2, 
  Globe, MapPin, Clock, Tag, Edit, Save, X, CheckCircle, AlertCircle 
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const ClientsPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterCompanySize, setFilterCompanySize] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterSignupSource, setFilterSignupSource] = useState('all');
  const [filterAccountStatus, setFilterAccountStatus] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, filterRole, filterCompanySize, filterIndustry, filterSignupSource, filterAccountStatus, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getUsers();
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Filter by company size
    if (filterCompanySize !== 'all') {
      filtered = filtered.filter(user => user.company_size === filterCompanySize);
    }

    // Filter by industry
    if (filterIndustry !== 'all') {
      filtered = filtered.filter(user => user.industry === filterIndustry);
    }

    // Filter by signup source
    if (filterSignupSource !== 'all') {
      filtered = filtered.filter(user => user.signup_source === filterSignupSource);
    }

    // Filter by account status
    if (filterAccountStatus !== 'all') {
      filtered = filtered.filter(user => user.account_status === filterAccountStatus);
    }

    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditFormData({
      name: user.name || '',
      phone: user.phone || '',
      company_name: user.company_name || '',
      company_size: user.company_size || '',
      industry: user.industry || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      country: user.country || '',
      zip_code: user.zip_code || '',
      website: user.website || '',
      account_status: user.account_status || 'active',
      notes: user.notes || '',
      tags: user.tags || '',
    });
  };

  const handleSave = async (userId) => {
    try {
      await adminAPI.updateUser(userId, editFormData);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditFormData({});
  };

  const getUniqueValues = (field) => {
    return [...new Set(users.map(u => u[field]).filter(Boolean))].sort();
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    regular: users.filter(u => u.role === 'USER').length,
    newThisMonth: users.filter(u => {
      const created = new Date(u.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
    active: users.filter(u => u.account_status === 'active').length,
    withCompany: users.filter(u => u.company_name).length,
    activeThisWeek: users.filter(u => {
      if (!u.last_login) return false;
      const lastLogin = new Date(u.last_login);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastLogin >= weekAgo;
    }).length
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Clients - Admin" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Clients - Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Clients Management</h1>
          <p className="text-gray-400">Manage all platform users</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
            Error: {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-sm text-gray-400">Total Users</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-sm text-gray-400">Active</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.active}</h3>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-6 h-6 text-orange-400" />
              <span className="text-sm text-gray-400">With Company</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.withCompany}</h3>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-purple-400" />
              <span className="text-sm text-gray-400">Active This Week</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{stats.activeThisWeek}</h3>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, company, phone, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterCompanySize}
                  onChange={(e) => setFilterCompanySize(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Sizes</option>
                  {getUniqueValues('company_size').map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterIndustry}
                  onChange={(e) => setFilterIndustry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Industries</option>
                  {getUniqueValues('industry').map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterSignupSource}
                  onChange={(e) => setFilterSignupSource(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Sources</option>
                  {getUniqueValues('signup_source').map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterAccountStatus}
                  onChange={(e) => setFilterAccountStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {/* Users List */}
        {filteredUsers.length > 0 ? (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {user.role}
                        </span>
                        {user.account_status && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.account_status === 'active'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : user.account_status === 'inactive'
                                ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {user.account_status}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        )}
                        {user.company_name && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {user.company_name}
                            {user.company_size && ` (${user.company_size})`}
                          </div>
                        )}
                        {user.industry && (
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            {user.industry}
                          </div>
                        )}
                        {user.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300">
                              {user.website}
                            </a>
                          </div>
                        )}
                        {(user.city || user.state || user.country) && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {[user.city, user.state, user.country].filter(Boolean).join(', ')}
                          </div>
                        )}
                        {user.last_login && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Last login: {new Date(user.last_login).toLocaleDateString()}
                          </div>
                        )}
                        {user.signup_source && (
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Source: {user.signup_source}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => editingUser === user.id ? handleCancel() : handleEdit(user)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  >
                    {editingUser === user.id ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Edit className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {editingUser === user.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={editFormData.phone}
                          onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={editFormData.company_name}
                          onChange={(e) => setEditFormData({...editFormData, company_name: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Company Size</label>
                        <select
                          value={editFormData.company_size}
                          onChange={(e) => setEditFormData({...editFormData, company_size: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                        >
                          <option value="">Select size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                        <input
                          type="text"
                          value={editFormData.industry}
                          onChange={(e) => setEditFormData({...editFormData, industry: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Account Status</label>
                        <select
                          value={editFormData.account_status}
                          onChange={(e) => setEditFormData({...editFormData, account_status: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                        <textarea
                          value={editFormData.notes}
                          onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleSave(user.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Users Found</h3>
            <p className="text-gray-400">
              {searchTerm || filterRole !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No users found in the system'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientsPage;
