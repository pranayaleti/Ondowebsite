import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { portalAPI } from '../../utils/auth';
import { FileText, Download, Eye, Loader, AlertCircle, DollarSign, Calendar, CheckCircle, XCircle, Clock, Plus, Trash2, X } from 'lucide-react';
import SEOHead from '../../components/SEOHead';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await portalAPI.getInvoices();
      setInvoices(data.invoices || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPDF = (invoiceId) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    window.open(`${API_URL}/portal/invoices/${invoiceId}/pdf`, '_blank');
  };

  const handleDownloadPDF = (invoiceId, invoiceNumber) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const link = document.createElement('a');
    link.href = `${API_URL}/portal/invoices/${invoiceId}/pdf`;
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const calculateTotalDue = () => {
    return invoices
      .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount || inv.amount || 0), 0);
  };

  const handleCreateInvoice = async () => {
    try {
      setError(null);
      setCreating(true);
      
      // Validate that at least amount or items are provided
      const items = formData.items.length > 0 ? formData.items : [];
      const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity || 1) * parseFloat(item.price || 0)), 0) || parseFloat(formData.amount || 0);
      
      if (subtotal <= 0) {
        throw new Error('Please provide an amount or add items with prices');
      }
      
      const tax = parseFloat(formData.tax || 0);
      const total = subtotal + tax;

      const invoiceData = {
        amount: subtotal,
        tax: tax,
        total_amount: total,
        status: formData.status || 'pending',
        due_date: formData.due_date || null,
        description: formData.description || null,
        items: items.length > 0 ? items : null,
        notes: formData.notes || null
      };

      await portalAPI.createInvoice(invoiceData);
      
      setShowCreateModal(false);
      setFormData({
        amount: '',
        tax: '0',
        total_amount: '',
        status: 'pending',
        due_date: '',
        description: '',
        items: [],
        notes: ''
      });
      setItemForm({ description: '', quantity: '1', price: '' });
      await fetchInvoices();
    } catch (err) {
      console.error('Create invoice error:', err);
      setError(err.message || 'Failed to create invoice. Please check your connection and try again.');
    } finally {
      setCreating(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Invoices - Portal" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Invoices</h1>
            <p className="text-gray-400">View and manage your invoices</p>
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
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Total Invoices</h3>
            <p className="text-2xl font-bold text-white">{invoices.length}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Pending</h3>
            <p className="text-2xl font-bold text-white">
              {invoices.filter(inv => inv.status === 'pending').length}
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <h3 className="text-sm text-gray-400 mb-1">Amount Due</h3>
            <p className="text-2xl font-bold text-white">${calculateTotalDue().toFixed(2)}</p>
          </div>
        </div>

        {/* Invoices List */}
        {invoices.length > 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Invoice #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Due Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {invoices.map((invoice) => {
                    const items = invoice.items ? (typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items) : [];
                    const total = parseFloat(invoice.total_amount || invoice.amount || 0);
                    const dueDate = invoice.due_date ? new Date(invoice.due_date) : null;
                    const isOverdue = dueDate && dueDate < new Date() && invoice.status !== 'paid';
                    
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-white font-medium">
                              {invoice.invoice_number || `INV-${invoice.id}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {new Date(invoice.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {dueDate ? (
                            <span className={isOverdue ? 'text-red-400' : 'text-gray-300'}>
                              {dueDate.toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">${total.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(isOverdue ? 'overdue' : invoice.status)}`}>
                            {getStatusIcon(isOverdue ? 'overdue' : invoice.status)}
                            {isOverdue ? 'Overdue' : invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewPDF(invoice.id)}
                              className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
                              title="View PDF"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(invoice.id, invoice.invoice_number || invoice.id)}
                              className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

        {/* Create Invoice Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create Invoice</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
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

              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
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
                      setFormData({
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
                    onClick={handleCreateInvoice}
                    disabled={creating}
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {creating ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Invoice'
                    )}
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
