import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/auth.js';
import { API_URL } from '../../utils/apiConfig.js';
import { FileText, Download, Eye, Loader, AlertCircle, DollarSign, Calendar, CheckCircle, XCircle, Clock, Plus, Edit, Trash2, Save, X, User, Mail } from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import { formatDateTimeMST } from '../../utils/dateFormat.js';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    amount: '',
    tax: '0',
    total_amount: '',
    status: 'pending',
    due_date: '',
    description: '',
    items: [],
    notes: ''
  });
  const [itemForm, setItemForm] = useState({ description: '', quantity: '1', price: '' });

  useEffect(() => {
    fetchInvoices();
    fetchUsers();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getInvoices();
      setInvoices(data.invoices || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      setError(null);
      const items = formData.items.length > 0 ? formData.items : [];
      const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity || 1) * parseFloat(item.price || 0)), 0) || parseFloat(formData.amount || 0);
      const tax = parseFloat(formData.tax || 0);
      const total = subtotal + tax;

      await adminAPI.createInvoice({
        ...formData,
        amount: subtotal,
        total_amount: total,
        items: items.length > 0 ? items : null
      });
      
      setShowCreateModal(false);
      setFormData({
        user_id: '',
        amount: '',
        tax: '0',
        total_amount: '',
        status: 'pending',
        due_date: '',
        description: '',
        items: [],
        notes: ''
      });
      await fetchInvoices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateInvoice = async (invoiceId) => {
    try {
      setError(null);
      const invoice = invoices.find(inv => inv.id === invoiceId);
      const items = formData.items.length > 0 ? formData.items : (invoice.items ? (typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items) : []);
      const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity || 1) * parseFloat(item.price || 0)), 0) || parseFloat(formData.amount || invoice.amount || 0);
      const tax = parseFloat(formData.tax || invoice.tax || 0);
      const total = subtotal + tax;

      await adminAPI.updateInvoice(invoiceId, {
        ...formData,
        amount: subtotal,
        total_amount: total,
        items: items.length > 0 ? items : null
      });
      
      setEditingInvoice(null);
      setFormData({
        user_id: '',
        amount: '',
        tax: '0',
        total_amount: '',
        status: 'pending',
        due_date: '',
        description: '',
        items: [],
        notes: ''
      });
      await fetchInvoices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddItem = () => {
    if (itemForm.description && itemForm.price) {
      setFormData({
        ...formData,
        items: [...formData.items, { ...itemForm, quantity: parseFloat(itemForm.quantity || 1), price: parseFloat(itemForm.price) }]
      });
      setItemForm({ description: '', quantity: '1', price: '' });
    }
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice.id);
    const items = invoice.items ? (typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items) : [];
    setFormData({
      user_id: invoice.user_id,
      amount: invoice.amount || '',
      tax: invoice.tax || '0',
      total_amount: invoice.total_amount || '',
      status: invoice.status || 'pending',
      due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
      description: invoice.description || '',
      items: items,
      notes: invoice.notes || ''
    });
  };

  const handleViewPDF = (invoiceId) => {
    window.open(`${API_URL}/admin/invoices/${invoiceId}/pdf`, '_blank');
  };

  const handleDownloadPDF = (invoiceId, invoiceNumber) => {
    const link = document.createElement('a');
    link.href = `${API_URL}/admin/invoices/${invoiceId}/pdf`;
    link.download = `invoice-${invoiceNumber || invoiceId}.html`;
    link.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const calculateTotalDue = () => {
    return invoices
      .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount || inv.amount || 0), 0);
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Invoices - Admin" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-12 h-12 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Invoices - Admin" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Invoices Management</h1>
            <p className="text-gray-400">Manage all invoices</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Invoice
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
            Error: {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-orange-400" />
              <span className="text-sm text-gray-400">Total Invoices</span>
            </div>
            <h3 className="text-3xl font-bold text-white">{invoices.length}</h3>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-yellow-400" />
              <span className="text-sm text-gray-400">Pending</span>
            </div>
            <h3 className="text-3xl font-bold text-white">
              {invoices.filter(inv => inv.status === 'pending').length}
            </h3>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-sm text-gray-400">Paid</span>
            </div>
            <h3 className="text-3xl font-bold text-white">
              {invoices.filter(inv => inv.status === 'paid').length}
            </h3>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-red-400" />
              <span className="text-sm text-gray-400">Total Due</span>
            </div>
            <h3 className="text-3xl font-bold text-white">${calculateTotalDue().toFixed(2)}</h3>
          </div>
        </div>

        {/* Invoices List */}
        {invoices.length > 0 ? (
          <div className="space-y-4">
            {invoices.map((invoice) => {
              const total = parseFloat(invoice.total_amount || invoice.amount || 0);
              const dueDate = invoice.due_date ? new Date(invoice.due_date) : null;
              const isOverdue = dueDate && dueDate < new Date() && invoice.status !== 'paid';
              
              return (
                <div
                  key={invoice.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {invoice.invoice_number || `INV-${invoice.id}`}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(isOverdue ? 'overdue' : invoice.status)}`}>
                            {isOverdue ? <XCircle className="w-3 h-3" /> : invoice.status === 'paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {isOverdue ? 'Overdue' : invoice.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="text-white font-medium">{invoice.user_name || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{invoice.user_email || ''}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Created {formatDateTimeMST(invoice.created_at)}</span>
                          </div>
                          {dueDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className={isOverdue ? 'text-red-400' : 'text-gray-400'}>
                                Due {formatDateTimeMST(dueDate)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-white font-semibold text-lg">${total.toFixed(2)}</span>
                          </div>
                        </div>
                        {invoice.description && (
                          <p className="mt-2 text-sm text-gray-400 line-clamp-2">{invoice.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingInvoice === invoice.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateInvoice(invoice.id)}
                            className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
                            title="Save"
                          >
                            <Save className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingInvoice(null);
                              setFormData({
                                user_id: '',
                                amount: '',
                                tax: '0',
                                total_amount: '',
                                status: 'pending',
                                due_date: '',
                                description: '',
                                items: [],
                                notes: ''
                              });
                            }}
                            className="p-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 transition-colors"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditInvoice(invoice)}
                            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleViewPDF(invoice.id)}
                            className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-colors"
                            title="View PDF"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(invoice.id, invoice.invoice_number || invoice.id)}
                            className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingInvoice === invoice.id && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      {/* Edit form will be shown here - keeping the modal approach for now */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center">
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Invoices</h3>
            <p className="text-gray-400 mb-6">You don't have any invoices yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Your First Invoice
            </button>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || editingInvoice) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingInvoice ? 'Edit Invoice' : 'Create Invoice'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingInvoice(null);
                    setFormData({
                      user_id: '',
                      amount: '',
                      tax: '0',
                      total_amount: '',
                      status: 'pending',
                      due_date: '',
                      description: '',
                      items: [],
                      notes: ''
                    });
                  }}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
                  <select
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select a client</option>
                    {users.filter(u => u.role === 'USER').map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tax</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.tax}
                      onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    placeholder="Invoice description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Items</label>
                  <div className="space-y-2 mb-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-900 rounded-lg">
                        <span className="flex-1 text-white">{item.description}</span>
                        <span className="text-gray-400">Qty: {item.quantity}</span>
                        <span className="text-gray-400">${(item.quantity * item.price).toFixed(2)}</span>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Item description"
                    />
                    <input
                      type="number"
                      value={itemForm.quantity}
                      onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                      className="w-20 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Qty"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={itemForm.price}
                      onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                      className="w-24 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Price"
                    />
                    <button
                      onClick={handleAddItem}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="3"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingInvoice(null);
                      setFormData({
                        user_id: '',
                        amount: '',
                        tax: '0',
                        total_amount: '',
                        status: 'pending',
                        due_date: '',
                        description: '',
                        items: [],
                        notes: ''
                      });
                    }}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => editingInvoice ? handleUpdateInvoice(editingInvoice) : handleCreateInvoice()}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-colors"
                  >
                    {editingInvoice ? 'Update' : 'Create'} Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InvoicesPage;

