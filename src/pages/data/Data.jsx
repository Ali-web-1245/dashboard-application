import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiChevronDown, 
  FiEdit2, 
  FiTrash2, 
  FiSettings, 
  FiX 
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './data.css';

const INITIAL_RECORDS = [
  { id: 1, product: "Pro Plan Subscription", category: "Software", region: "North America", revenue: 12400, qty: 240, date: "2026-09-01" },
  { id: 2, product: "Enterprise License", category: "Software", region: "Europe", revenue: 45000, qty: 12, date: "2026-09-02" },
  { id: 3, product: "Consulting Services", category: "Service", region: "Asia", revenue: 8200, qty: 30, date: "2026-09-03" },
  { id: 4, product: "Hardware Kit", category: "Hardware", region: "North America", revenue: 3100, qty: 55, date: "2026-09-04" },
  { id: 5, product: "Training Program", category: "Service", region: "Europe", revenue: 5600, qty: 80, date: "2026-09-05" },
  { id: 6, product: "Cloud Storage Plan", category: "Software", region: "Asia", revenue: 9800, qty: 145, date: "2026-09-06" },
  { id: 7, product: "Security Package", category: "Hardware", region: "Europe", revenue: 15500, qty: 35, date: "2026-09-07" },
  { id: 8, product: "Business Consulting", category: "Service", region: "North America", revenue: 11200, qty: 20, date: "2026-09-08" }
];

const ITEMS_PER_PAGE = 5;

export const Data = () => {
  const { toggleSettingsPanel } = useTheme();

  // LocalStorage State Initialization
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('dashboard_data_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored records", e);
      }
    }
    return INITIAL_RECORDS;
  });

  // Search, Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    product: '',
    category: 'Software',
    region: 'North America',
    revenue: '',
    qty: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState({});

  // Persist records to LocalStorage
  useEffect(() => {
    localStorage.setItem('dashboard_data_records', JSON.stringify(records));
  }, [records]);

  // Derived Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Category Filter
      const matchesCategory = selectedCategory === 'All' || rec.category === selectedCategory;
      
      // Region Filter
      const matchesRegion = selectedRegion === 'All' || rec.region === selectedRegion;

      // Search Query
      const term = searchTerm.toLowerCase();
      const formattedRev = `$${rec.revenue.toLocaleString()}`;
      const matchesSearch = 
        rec.product.toLowerCase().includes(term) ||
        rec.category.toLowerCase().includes(term) ||
        rec.region.toLowerCase().includes(term) ||
        rec.qty.toString().includes(term) ||
        rec.date.includes(term) ||
        formattedRev.toLowerCase().includes(term) ||
        rec.revenue.toString().includes(term);

      return matchesCategory && matchesRegion && matchesSearch;
    });
  }, [records, searchTerm, selectedCategory, selectedRegion]);

  // Handle auto page-reset when filtering/deleting
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE) || 1;
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredRecords, totalPages, currentPage]);

  // Paginated Subset
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setFormData({
      product: '',
      category: 'Software',
      region: 'North America',
      revenue: '',
      qty: '',
      date: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingRecord(record);
    setFormData({
      product: record.product,
      category: record.category,
      region: record.region,
      revenue: record.revenue.toString(),
      qty: record.qty.toString(),
      date: record.date
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.product.trim()) errors.product = "Product name is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.region) errors.region = "Region is required";
    if (!formData.revenue || isNaN(formData.revenue) || Number(formData.revenue) < 0) {
      errors.revenue = "Valid revenue number is required";
    }
    if (!formData.qty || isNaN(formData.qty) || Number(formData.qty) < 0) {
      errors.qty = "Valid quantity is required";
    }
    if (!formData.date) errors.date = "Date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const numericData = {
      product: formData.product.trim(),
      category: formData.category,
      region: formData.region,
      revenue: parseFloat(formData.revenue),
      qty: parseInt(formData.qty, 10),
      date: formData.date
    };

    if (editingRecord) {
      setRecords(records.map(r => r.id === editingRecord.id ? { ...r, ...numericData } : r));
    } else {
      const newRecord = {
        id: Date.now(),
        ...numericData
      };
      setRecords([newRecord, ...records]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    setRecords(records.filter(r => r.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  const formatCurrency = (val) => {
    return `$${Number(val).toLocaleString()}`;
  };

  const startRecord = filteredRecords.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length);

  return (
    <div className="data-page-container">
      {/* PAGE HEADER */}
      <div className="data-header">
        <div className="header-titles">
          <h1 className="data-title">Data</h1>
          <p className="data-subtitle">Browse, sort, filter and manage all your data records</p>
        </div>
        <button className="add-record-btn" onClick={handleOpenAddModal}>
          <FiPlus size={16} /> Add Record
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="data-table-card">
        {/* CARD TOP BAR */}
        <div className="table-card-header">
          <h3 className="table-card-title">
            Data Records ({records.length})
          </h3>

          <div className="table-controls">
            {/* Search Input */}
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" size={14} />
              <input
                type="text"
                className="search-input"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Region Filter */}
            <div className="filter-dropdown-wrapper">
              <select
                className="filter-dropdown"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                aria-label="Filter Region"
              >
                <option value="All">All Regions</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="South America">South America</option>
                <option value="Africa">Africa</option>
                <option value="Australia">Australia</option>
              </select>
              <FiChevronDown className="dropdown-arrow" size={14} />
            </div>

            {/* Category Filter */}
            <div className="filter-dropdown-wrapper">
              <select
                className="filter-dropdown"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter Category"
              >
                <option value="All">All</option>
                <option value="Software">Software</option>
                <option value="Service">Service</option>
                <option value="Hardware">Hardware</option>
              </select>
              <FiChevronDown className="dropdown-arrow" size={14} />
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="table-responsive-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="th-id"># ^</th>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>REGION</th>
                <th>REVENUE</th>
                <th>QTY</th>
                <th>DATE</th>
                <th className="th-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record, index) => {
                  const displayIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                  return (
                    <tr key={record.id}>
                      <td className="td-id">#{displayIndex}</td>
                      <td className="product-name">{record.product}</td>
                      <td>
                        <span className={`category-badge category-${record.category.toLowerCase()}`}>
                          {record.category}
                        </span>
                      </td>
                      <td className="region-cell">{record.region}</td>
                      <td className="revenue-cell">{formatCurrency(record.revenue)}</td>
                      <td className="qty-cell">{record.qty}</td>
                      <td className="date-cell">{record.date}</td>
                      <td className="td-actions">
                        <button 
                          className="action-icon-btn edit-btn" 
                          onClick={() => handleOpenEditModal(record)}
                          aria-label={`Edit ${record.product}`}
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button 
                          className="action-icon-btn delete-btn" 
                          onClick={() => setDeleteTargetId(record.id)}
                          aria-label={`Delete ${record.product}`}
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="no-data-cell">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER & PAGINATION */}
        <div className="table-footer">
          <span className="pagination-info">
            Showing {startRecord}–{endRecord} of {filteredRecords.length}
          </span>

          {totalPages > 0 && (
            <div className="pagination-buttons">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingRecord ? 'Edit Record' : 'Add Record'}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <FiX size={18} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Product</label>
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className={formErrors.product ? 'input-error' : ''}
                  placeholder="e.g. Pro Plan Subscription"
                />
                {formErrors.product && <span className="error-text">{formErrors.product}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Software">Software</option>
                    <option value="Service">Service</option>
                    <option value="Hardware">Hardware</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  >
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="South America">South America</option>
                    <option value="Africa">Africa</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Revenue ($)</label>
                  <input
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                    className={formErrors.revenue ? 'input-error' : ''}
                    placeholder="12400"
                  />
                  {formErrors.revenue && <span className="error-text">{formErrors.revenue}</span>}
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                    className={formErrors.qty ? 'input-error' : ''}
                    placeholder="240"
                  />
                  {formErrors.qty && <span className="error-text">{formErrors.qty}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={formErrors.date ? 'input-error' : ''}
                />
                {formErrors.date && <span className="error-text">{formErrors.date}</span>}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingRecord ? 'Update Record' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTargetId && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <h3>Delete Record</h3>
            <p>Are you sure you want to delete this record?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteTargetId(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SETTINGS BUTTON */}
      <button 
        className="floating-settings-btn" 
        onClick={toggleSettingsPanel}
        aria-label="Open Settings"
      >
        <FiSettings size={20} />
      </button>
    </div>
  );
};

export default Data;