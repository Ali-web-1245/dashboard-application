import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEye, 
  FiEdit2, 
  FiTrash2, 
  FiX, 
  FiChevronUp,
  FiSettings
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './invoice.css';

// Initial Mock Invoices Data matching the screenshot exactly
const initialInvoicesData = [
  { id: 'INV-001', customer: 'John Smith', date: '2026-09-01', amount: 1200, status: 'Paid' },
  { id: 'INV-002', customer: 'Sarah Connor', date: '2026-09-03', amount: 850, status: 'Pending' },
  { id: 'INV-003', customer: 'Mike Johnson', date: '2026-09-05', amount: 2400, status: 'Paid' },
  { id: 'INV-004', customer: 'Emma Watson', date: '2026-09-06', amount: 560, status: 'Overdue' },
  { id: 'INV-005', customer: 'Robert Brown', date: '2026-09-07', amount: 1800, status: 'Pending' },
  { id: 'INV-006', customer: 'Alex Turner', date: '2026-09-08', amount: 3100, status: 'Paid' },
  { id: 'INV-007', customer: 'Sophia Lee', date: '2026-09-09', amount: 950, status: 'Overdue' },
];

export const Invoice = () => {
  // Theme context for global Settings toggle
  const { toggleSettingsPanel } = useTheme();

  // Load Invoices from LocalStorage or Fallback to Initial Data
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('dashboard_invoices');
    return saved ? JSON.parse(saved) : initialInvoicesData;
  });

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    customer: '',
    date: '',
    amount: '',
    status: 'Paid'
  });
  const [formError, setFormError] = useState('');

  // Persist Invoices to LocalStorage on Change
  useEffect(() => {
    localStorage.setItem('dashboard_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Combined Search & Filter Logic
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      inv.id.toLowerCase().includes(searchLower) ||
      inv.customer.toLowerCase().includes(searchLower) ||
      inv.date.includes(searchLower) ||
      inv.amount.toString().includes(searchLower) ||
      inv.status.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  // Calculate Pagination Values
  const totalItems = filteredInvoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Ensure current page remains valid when items are deleted or filtered
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const displayedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  // Form Handlers
  const handleOpenAddModal = () => {
    setCurrentInvoice(null);
    setFormData({
      id: `INV-00${invoices.length + 1}`,
      customer: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      status: 'Paid'
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (invoice) => {
    setCurrentInvoice(invoice);
    setFormData({ ...invoice });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenViewModal = (invoice) => {
    setCurrentInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleOpenDeleteModal = (invoice) => {
    setCurrentInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleSaveInvoice = (e) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.customer.trim() || !formData.date || !formData.amount) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      setFormError('Amount must be a valid positive number.');
      return;
    }

    const numericAmount = parseFloat(formData.amount);

    if (currentInvoice) {
      // Edit existing invoice
      setInvoices(invoices.map(inv => inv.id === currentInvoice.id ? { ...formData, amount: numericAmount } : inv));
    } else {
      // Check duplicate ID
      if (invoices.some(inv => inv.id.toLowerCase() === formData.id.trim().toLowerCase())) {
        setFormError('Invoice ID already exists!');
        return;
      }
      // Add new invoice
      setInvoices([{ ...formData, amount: numericAmount }, ...invoices]);
    }

    setIsFormModalOpen(false);
  };

  const handleDeleteInvoice = () => {
    if (currentInvoice) {
      setInvoices(invoices.filter(inv => inv.id !== currentInvoice.id));
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="invoice-page-container">
      {/* PAGE HEADER */}
      <div className="invoice-page-header">
        <div>
          <h1 className="page-title">Invoice</h1>
          <p className="page-subtitle">Manage all your invoices</p>
        </div>
        <button className="btn-new-invoice" onClick={handleOpenAddModal}>
          <FiPlus size={18} /> + New Invoice
        </button>
      </div>

      {/* MAIN INVOICE TABLE CARD */}
      <div className="invoice-card">
        {/* CARD CONTROLS HEADER */}
        <div className="invoice-card-header">
          <h2 className="card-title-count">
            All Invoices <span>({invoices.length})</span>
          </h2>

          <div className="filter-controls">
            {/* Search Input */}
            <div className="search-box">
              <FiSearch className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Select */}
            <div className="select-box">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* INVOICE TABLE */}
        <div className="table-responsive">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>
                  <div className="th-content">INVOICE ID <FiChevronUp size={12} /></div>
                </th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {displayedInvoices.length > 0 ? (
                displayedInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="col-id">{inv.id}</td>
                    <td className="col-customer">{inv.customer}</td>
                    <td className="col-date">{inv.date}</td>
                    <td className="col-amount">${Number(inv.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>
                      <span className={`status-badge ${inv.status.toLowerCase()}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="text-right col-actions">
                      <button className="action-btn view" title="View" onClick={() => handleOpenViewModal(inv)}>
                        <FiEye size={15} />
                      </button>
                      <button className="action-btn edit" title="Edit" onClick={() => handleOpenEditModal(inv)}>
                        <FiEdit2 size={15} />
                      </button>
                      <button className="action-btn delete" title="Delete" onClick={() => handleOpenDeleteModal(inv)}>
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No invoices found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER / PAGINATION */}
        <div className="invoice-card-footer">
          <span className="showing-info">
            {totalItems > 0 
              ? `Showing ${startIndex + 1}–${endIndex} of ${totalItems}`
              : 'Showing 0–0 of 0'}
          </span>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FLOATING SETTINGS BUTTON */}
      <button 
        className="floating-settings-btn" 
        onClick={toggleSettingsPanel}
        aria-label="Open Settings"
      >
        <FiSettings size={20} />
      </button>

      {/* 1. CREATE / EDIT INVOICE MODAL */}
      {isFormModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsFormModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentInvoice ? 'Edit Invoice' : 'New Invoice'}</h3>
              <button className="close-btn" onClick={() => setIsFormModalOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveInvoice}>
              <div className="modal-body">
                {formError && <div className="form-error-banner">{formError}</div>}
                
                <div className="form-group">
                  <label>Invoice ID *</label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled={!!currentInvoice}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="e.g. INV-008"
                  />
                </div>

                <div className="form-group">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="e.g. Sarah Connor"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Amount ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="850.00"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsFormModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {currentInvoice ? 'Save Changes' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VIEW INVOICE DETAILS MODAL */}
      {isViewModalOpen && currentInvoice && (
        <div className="modal-backdrop" onClick={() => setIsViewModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice Details</h3>
              <button className="close-btn" onClick={() => setIsViewModalOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
            <div className="modal-body view-modal-body">
              <div className="view-detail-item">
                <span>Invoice ID</span>
                <strong className="col-id">{currentInvoice.id}</strong>
              </div>
              <div className="view-detail-item">
                <span>Customer</span>
                <strong>{currentInvoice.customer}</strong>
              </div>
              <div className="view-detail-item">
                <span>Date</span>
                <span>{currentInvoice.date}</span>
              </div>
              <div className="view-detail-item">
                <span>Amount</span>
                <strong style={{ fontSize: '1.2rem', color: '#ffffff' }}>
                  ${Number(currentInvoice.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
              </div>
              <div className="view-detail-item">
                <span>Status</span>
                <span className={`status-badge ${currentInvoice.status.toLowerCase()}`}>
                  {currentInvoice.status}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setIsViewModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && currentInvoice && (
        <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: '#a6b0cf', fontSize: '0.9rem', margin: 0 }}>
                Are you sure you want to delete invoice <strong style={{ color: '#93c5fd' }}>{currentInvoice.id}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn-danger" onClick={handleDeleteInvoice}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;